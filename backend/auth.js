import jwt from 'jsonwebtoken'

const secret = () => process.env.JWT_SECRET || 'codeforge-local-development-secret-change-me'

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
