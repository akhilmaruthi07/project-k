import { useEffect, useState } from 'react'

/**
 * Live countdown to a target Date. Returns null if target is invalid or in the past.
 */
export function useCountdown(expiryDate) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!expiryDate || !(expiryDate instanceof Date) || expiryDate.getTime() <= Date.now()) {
      return undefined
    }
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [expiryDate])

  if (!expiryDate || !(expiryDate instanceof Date)) {
    return { expired: true, label: '—', totalMs: 0 }
  }

  const end = expiryDate.getTime()
  const diff = end - now

  if (diff <= 0) {
    return { expired: true, label: 'Expired', totalMs: 0 }
  }

  const s = Math.floor(diff / 1000)
  const days = Math.floor(s / 86400)
  const hours = Math.floor((s % 86400) / 3600)
  const mins = Math.floor((s % 3600) / 60)
  const secs = s % 60

  let label
  if (days > 0) {
    label = `${days}d ${hours}h ${mins}m`
  } else if (hours > 0) {
    label = `${hours}h ${mins}m ${secs}s`
  } else {
    label = `${mins}m ${secs}s`
  }

  return { expired: false, label, totalMs: diff }
}
