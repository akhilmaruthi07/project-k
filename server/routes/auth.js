import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { parseFetch } from '../lib/parseRest.js'
import { signToken } from '../lib/jwt.js'

export const authRouter = Router()

function safeRole(role) {
  return role === 'admin' ? 'admin' : 'student'
}

// Create a Parse user (student by default).
authRouter.post('/signup', async (req, res) => {
  const { username, password, email } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' })
  }

  try {
    // bcrypt is used here for demonstration; Parse stores password hashing internally.
    // We still validate password length and avoid sending obviously weak values.
    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }
    await bcrypt.genSalt(10)

    const created = await parseFetch('/users', {
      method: 'POST',
      body: {
        username: String(username).trim(),
        password: String(password),
        ...(email ? { email: String(email).trim() } : {}),
        role: 'student',
      },
    })

    return res.json({ ok: true, userId: created.objectId })
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message, details: e.details })
  }
})

// Log in via Parse REST and mint our own JWT for API calls.
authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body || {}
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' })
  }

  try {
    const qs = new URLSearchParams({
      username: String(username).trim(),
      password: String(password),
    })

    const login = await parseFetch(`/login?${qs.toString()}`, { method: 'GET' })

    const me = await parseFetch('/users/me', {
      method: 'GET',
      sessionToken: login.sessionToken,
    })

    const token = signToken({
      sub: me.objectId,
      role: safeRole(me.role),
      sessionToken: login.sessionToken,
    })

    return res.json({
      ok: true,
      token,
      user: { id: me.objectId, username: me.username, role: safeRole(me.role) },
    })
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message, details: e.details })
  }
})

