import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchNotices, subscribeNotices } from '../lib/noticesApi'

/**
 * Client-side filter: hide expired notices (backup if query is relaxed).
 */
function isActive(notice) {
  if (!notice.expiryDate) return false
  return new Date(notice.expiryDate) > new Date()
}

function sortNotices(list, sortBy) {
  const copy = [...list]

  if (sortBy === 'newest') {
    copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return copy
  }

  if (sortBy === 'oldest') {
    copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    return copy
  }

  // priority: pinned → urgent → sooner expiry → newer
  copy.sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
    if (a.isUrgent !== b.isUrgent) return a.isUrgent ? -1 : 1
    const ae = new Date(a.expiryDate).getTime()
    const be = new Date(b.expiryDate).getTime()
    if (ae !== be) return ae - be
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
  return copy
}

export function useNotices({
  includeExpired = false,
  category = 'all',
  search = '',
  sortBy = 'priority',
  pollMs = 45000,
}) {
  const [raw, setRaw] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      setError(null)
      const data = await fetchNotices({ includeExpired })
      setRaw(data)
    } catch (e) {
      setError(e?.message || 'Failed to load notices')
    } finally {
      setLoading(false)
    }
  }, [includeExpired])

  useEffect(() => {
    setLoading(true)
    load()
  }, [load])

  // Polling fallback
  useEffect(() => {
    const id = setInterval(load, pollMs)
    return () => clearInterval(id)
  }, [load, pollMs])

  // Live Query when available
  useEffect(() => {
    const unsub = subscribeNotices({
      onUpdate: load,
      onError: () => {
        /* Live Query optional; polling still runs */
      },
    })
    return unsub
  }, [load])

  const filtered = useMemo(() => {
    let list = includeExpired ? raw : raw.filter(isActive)

    if (category && category !== 'all') {
      list = list.filter((n) => n.category === category)
    }

    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q),
      )
    }

    return sortNotices(list, sortBy)
  }, [raw, includeExpired, category, search, sortBy])

  return { notices: filtered, loading, error, reload: load }
}
