import { useEffect, useMemo, useState } from 'react'
import { FilePlus2, LoaderCircle, Save, Sparkles, Trash2 } from 'lucide-react'
import { api } from '../lib/api'

const blankPage = () => ({ id: null, emoji: '📄', title: 'Untitled', content: '' })

export default function LiveWorkspace({ user, onOpenAuth }) {
  const [pages, setPages] = useState([])
  const [draft, setDraft] = useState(blankPage())
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const selectedId = draft.id
  const initials = useMemo(() => (user?.name || 'CF').split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase(), [user])

  const loadPages = async () => {
    if (!user) return
    setLoading(true)
    try {
      const result = await api('/api/pages')
      setPages(result.pages)
      if (!draft.id && result.pages.length) setDraft(result.pages[0])
    } catch (err) {
      setStatus(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) loadPages()
    else { setPages([]); setDraft(blankPage()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const savePage = async () => {
    if (!user) return onOpenAuth('signup')
    setLoading(true)
    setStatus('Saving…')
    try {
      const method = draft.id ? 'PUT' : 'POST'
      const path = draft.id ? `/api/pages/${draft.id}` : '/api/pages'
      const result = await api(path, {
        method,
        body: JSON.stringify({ emoji: draft.emoji, title: draft.title, content: draft.content }),
      })
      setDraft(result.page)
      setPages((current) => {
        const others = current.filter((page) => page.id !== result.page.id)
        return [result.page, ...others]
      })
      setStatus('Saved to SQLite ✓')
    } catch (err) {
      setStatus(err.message)
    } finally {
      setLoading(false)
    }
  }

  const removePage = async () => {
    if (!draft.id) return setDraft(blankPage())
    if (!window.confirm(`Delete “${draft.title}”?`)) return
    setLoading(true)
    try {
      await api(`/api/pages/${draft.id}`, { method: 'DELETE' })
      const remaining = pages.filter((page) => page.id !== draft.id)
      setPages(remaining)
      setDraft(remaining[0] || blankPage())
      setStatus('Page deleted')
    } catch (err) {
      setStatus(err.message)
    } finally {
      setLoading(false)
    }
  }

  const summarize = async () => {
    if (!user) return onOpenAuth('login')
    setAiLoading(true)
    setStatus('Generating summary…')
    try {
      const result = await api('/api/ai/summarize', {
        method: 'POST',
        body: JSON.stringify({ text: draft.content || draft.title }),
      })
      setDraft((current) => ({ ...current, content: `${current.content}${current.content ? '\n\n' : ''}${result.summary}` }))
      setStatus(result.mode === 'external-api' ? 'AI summary added ✓' : 'Local AI fallback added ✓')
    } catch (err) {
      setStatus(err.message)
    } finally {
      setAiLoading(false)
    }
  }

  return (
    <section className="live-workspace section-shell" id="workspace">
      <div className="section-heading section-heading--row">
        <div><span className="eyebrow">Live full-stack workspace</span><h2>Your work, actually saved.</h2></div>
        <p>Sign up, create a page, refresh the browser, and open it again. The data is stored in a real SQLite database through the Express API.</p>
      </div>

      <div className="live-app-shell">
        <aside className="live-sidebar">
          <div className="live-sidebar__user"><span>{initials}</span><div><strong>{user?.name || 'Guest workspace'}</strong><small>{user?.email || 'Sign in to persist pages'}</small></div></div>
          <button className="new-page" onClick={() => user ? setDraft(blankPage()) : onOpenAuth('signup')}><FilePlus2 size={16} /> New page</button>
          <div className="page-list">
            {loading && !pages.length && <div className="page-list__empty"><LoaderCircle className="spin" size={17} /> Loading</div>}
            {!user && <button className="page-list__auth" onClick={() => onOpenAuth('signup')}>Create an account to unlock the workspace →</button>}
            {user && !loading && !pages.length && <div className="page-list__empty">No saved pages yet.</div>}
            {pages.map((page) => <button key={page.id} className={selectedId === page.id ? 'page-list__item is-active' : 'page-list__item'} onClick={() => setDraft(page)}><span>{page.emoji}</span><b>{page.title}</b></button>)}
          </div>
        </aside>

        <article className="live-editor">
          <div className="live-editor__toolbar">
            <div className="backend-badge"><span className="backend-dot" /> Express API · SQLite</div>
            <div className="editor-actions">
              <button onClick={summarize} disabled={aiLoading || loading}><Sparkles size={16} /> {aiLoading ? 'Working…' : 'AI summary'}</button>
              <button onClick={removePage} disabled={loading}><Trash2 size={16} /></button>
              <button className="save-button" onClick={savePage} disabled={loading}><Save size={16} /> {loading ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
          <div className="editor-canvas">
            <input className="emoji-input" value={draft.emoji} onChange={(e) => setDraft({ ...draft, emoji: e.target.value.slice(0, 8) })} aria-label="Page emoji" />
            <input className="title-input" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Untitled" />
            <textarea className="content-input" value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} placeholder="Start writing…" />
            <div className="editor-status">{status || (user ? 'Ready' : 'Guest preview — sign up to save')}</div>
          </div>
        </article>
      </div>
    </section>
  )
}
