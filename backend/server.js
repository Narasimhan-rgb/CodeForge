import 'dotenv/config'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import { initDatabase, one, all, run } from './database.js'
import { requireAuth, signToken } from './auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const port = Number(process.env.PORT || 4000)
const databaseFile = process.env.DATABASE_FILE || (process.env.VERCEL ? '/tmp/codeforge.db' : './backend/data/codeforge.db')

await initDatabase(path.resolve(rootDir, databaseFile))

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

const publicUser = (row) => ({
  id: Number(row.id),
  name: row.name,
  email: row.email,
  createdAt: row.created_at,
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, app: 'CodeForge', database: 'SQLite', time: new Date().toISOString() })
})

app.post('/api/auth/signup', async (req, res) => {
  const name = String(req.body?.name || '').trim()
  const email = String(req.body?.email || '').trim().toLowerCase()
  const password = String(req.body?.password || '')

  if (name.length < 2) return res.status(400).json({ error: 'Enter your name.' })
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' })
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' })
  if (one('SELECT id FROM users WHERE email = ?', [email])) return res.status(409).json({ error: 'An account with this email already exists.' })

  const passwordHash = await bcrypt.hash(password, 10)
  const id = run('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)', [name, email, passwordHash])
  const user = one('SELECT id, name, email, created_at FROM users WHERE id = ?', [id])

  res.status(201).json({ user: publicUser(user), token: signToken(user) })
})

app.post('/api/auth/login', async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  const password = String(req.body?.password || '')
  const user = one('SELECT * FROM users WHERE email = ?', [email])

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ error: 'Incorrect email or password.' })
  }

  res.json({ user: publicUser(user), token: signToken(user) })
})

app.get('/api/auth/me', requireAuth, (req, res) => {
  const user = one('SELECT id, name, email, created_at FROM users WHERE id = ?', [req.user.id])
  if (!user) return res.status(404).json({ error: 'Account not found.' })
  res.json({ user: publicUser(user) })
})

app.get('/api/pages', requireAuth, (req, res) => {
  const pages = all(
    `SELECT id, emoji, title, content, created_at AS createdAt, updated_at AS updatedAt
     FROM pages WHERE user_id = ? ORDER BY datetime(updated_at) DESC, id DESC`,
    [req.user.id],
  )
  res.json({ pages })
})

app.post('/api/pages', requireAuth, (req, res) => {
  const title = String(req.body?.title || 'Untitled').trim().slice(0, 120) || 'Untitled'
  const content = String(req.body?.content || '').slice(0, 20000)
  const emoji = String(req.body?.emoji || '📄').slice(0, 8) || '📄'
  const id = run('INSERT INTO pages (user_id, emoji, title, content) VALUES (?, ?, ?, ?)', [req.user.id, emoji, title, content])
  const page = one(
    `SELECT id, emoji, title, content, created_at AS createdAt, updated_at AS updatedAt
     FROM pages WHERE id = ? AND user_id = ?`,
    [id, req.user.id],
  )
  res.status(201).json({ page })
})

app.put('/api/pages/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id)
  const existing = one('SELECT id FROM pages WHERE id = ? AND user_id = ?', [id, req.user.id])
  if (!existing) return res.status(404).json({ error: 'Page not found.' })

  const title = String(req.body?.title || 'Untitled').trim().slice(0, 120) || 'Untitled'
  const content = String(req.body?.content || '').slice(0, 20000)
  const emoji = String(req.body?.emoji || '📄').slice(0, 8) || '📄'
  run(
    `UPDATE pages SET emoji = ?, title = ?, content = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND user_id = ?`,
    [emoji, title, content, id, req.user.id],
  )
  const page = one(
    `SELECT id, emoji, title, content, created_at AS createdAt, updated_at AS updatedAt
     FROM pages WHERE id = ? AND user_id = ?`,
    [id, req.user.id],
  )
  res.json({ page })
})

app.delete('/api/pages/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id)
  const existing = one('SELECT id FROM pages WHERE id = ? AND user_id = ?', [id, req.user.id])
  if (!existing) return res.status(404).json({ error: 'Page not found.' })
  run('DELETE FROM pages WHERE id = ? AND user_id = ?', [id, req.user.id])
  res.status(204).end()
})

app.post('/api/demo-requests', (req, res) => {
  const name = String(req.body?.name || '').trim().slice(0, 120)
  const email = String(req.body?.email || '').trim().toLowerCase().slice(0, 180)
  const company = String(req.body?.company || '').trim().slice(0, 120)
  const details = req.body?.details && typeof req.body.details === 'object' ? req.body.details : {}
  const detailsJson = JSON.stringify(details).slice(0, 12000)

  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Name and a valid work email are required.' })
  }
  if (!company) return res.status(400).json({ error: 'Company or organization is required.' })

  const id = run(
    'INSERT INTO demo_requests (name, email, company, details) VALUES (?, ?, ?, ?)',
    [name, email, company, detailsJson],
  )
  res.status(201).json({ id, stored: true, message: 'Demo request saved.' })
})

app.post('/api/ai/summarize', requireAuth, async (req, res) => {
  const text = String(req.body?.text || '').trim().slice(0, 12000)
  if (!text) return res.status(400).json({ error: 'Add some page content first.' })

  const url = process.env.AI_API_URL
  const key = process.env.AI_API_KEY
  const model = process.env.AI_MODEL

  if (!url || !key || !model) {
    const compact = text.replace(/\s+/g, ' ').trim()
    const sentences = compact.split(/(?<=[.!?])\s+/).filter(Boolean).slice(0, 3)
    const summary = sentences.join(' ') || compact.slice(0, 280)
    return res.json({ summary: `Local demo summary: ${summary}`, mode: 'local-fallback' })
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: 'Summarize the workspace note in 3 concise bullet points.' },
          { role: 'user', content: text },
        ],
      }),
    })
    if (!response.ok) throw new Error(`AI API returned ${response.status}`)
    const data = await response.json()
    const summary = data?.choices?.[0]?.message?.content || data?.output_text || 'Summary generated.'
    res.json({ summary, mode: 'external-api' })
  } catch (error) {
    res.status(502).json({ error: `AI provider error: ${error.message}` })
  }
})

const distDir = path.join(rootDir, 'dist')
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(distDir, 'index.html')))
}

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ error: 'Unexpected server error.' })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`CodeForge backend running on port ${port}`)
  console.log(`SQLite database: ${path.resolve(rootDir, databaseFile)}`)
})
