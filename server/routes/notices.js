import { Router } from 'express'
import { requireAdmin, requireAuth } from '../middleware/auth.js'
import { parseFetch, toParseDate, toUserPointer } from '../lib/parseRest.js'

export const noticesRouter = Router()

// Public/Authenticated read (depends on CLP). Uses sessionToken if provided.
noticesRouter.get('/', async (req, res) => {
  const { includeExpired } = req.query
  const now = new Date()

  try {
    const where = {}
    if (!includeExpired || includeExpired === 'false') {
      where.expiryDate = { $gt: toParseDate(now) }
    }

    const qs = new URLSearchParams({
      include: 'createdBy',
      order: '-createdAt',
      where: JSON.stringify(where),
    })

    const data = await parseFetch(`/classes/Notices?${qs.toString()}`, {
      method: 'GET',
    })

    return res.json({ ok: true, results: data.results || [] })
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message, details: e.details })
  }
})

// Admin-only writes via our JWT.
noticesRouter.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { title, content, category, expiryDate, isPinned, isUrgent } = req.body || {}
  if (!title || !content || !category || !expiryDate) {
    return res.status(400).json({ error: 'title, content, category, expiryDate are required' })
  }

  try {
    const created = await parseFetch('/classes/Notices', {
      method: 'POST',
      sessionToken: req.auth.sessionToken,
      body: {
        title: String(title).trim(),
        content: String(content).trim(),
        category: String(category),
        expiryDate: toParseDate(expiryDate),
        isPinned: Boolean(isPinned),
        isUrgent: Boolean(isUrgent),
        createdBy: toUserPointer(req.auth.sub),
      },
    })
    return res.json({ ok: true, ...created })
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message, details: e.details })
  }
})

noticesRouter.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params
  const { title, content, category, expiryDate, isPinned, isUrgent } = req.body || {}

  try {
    const updated = await parseFetch(`/classes/Notices/${id}`, {
      method: 'PUT',
      sessionToken: req.auth.sessionToken,
      body: {
        ...(title != null ? { title: String(title).trim() } : {}),
        ...(content != null ? { content: String(content).trim() } : {}),
        ...(category != null ? { category: String(category) } : {}),
        ...(expiryDate != null ? { expiryDate: toParseDate(expiryDate) } : {}),
        ...(isPinned != null ? { isPinned: Boolean(isPinned) } : {}),
        ...(isUrgent != null ? { isUrgent: Boolean(isUrgent) } : {}),
      },
    })
    return res.json({ ok: true, ...updated })
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message, details: e.details })
  }
})

noticesRouter.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  const { id } = req.params
  try {
    await parseFetch(`/classes/Notices/${id}`, {
      method: 'DELETE',
      sessionToken: req.auth.sessionToken,
    })
    return res.json({ ok: true })
  } catch (e) {
    return res.status(e.status || 500).json({ error: e.message, details: e.details })
  }
})

