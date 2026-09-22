import jwt from 'jsonwebtoken'

import { randomBytes } from 'node:crypto'
const configuredSecret = process.env.JWT_SECRET
if ((process.env.NODE_ENV === 'production' || process.env.VERCEL) && (!configuredSecret || configuredSecret.length < 32)) {
  throw new Error('Set JWT_SECRET to at least 32 random characters before deployment.')
}
const localSecret = randomBytes(48).toString('hex')
const secret = () => configuredSecret || localSecret

export function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    secret(),
    { expiresIn: '12h' },
  )
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) return res.status(401).json({ error: 'Authentication required.' })

  try {
    const payload = jwt.verify(token, secret())
    req.user = {
      id: Number(payload.sub),
      email: payload.email,
      name: payload.name,
    }
    next()
  } catch {
    res.status(401).json({ error: 'Your session has expired. Please log in again.' })
  }
}
