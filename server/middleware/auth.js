import { verifyToken } from '../lib/jwt.js'

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const [, token] = header.split(' ')
  if (!token) return res.status(401).json({ error: 'Missing token' })

  try {
    const decoded = verifyToken(token)
    req.auth = decoded
    return next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export function requireAdmin(req, res, next) {
  if (req.auth?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin only' })
  }
  return next()
}

