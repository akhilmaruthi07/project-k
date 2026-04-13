import { Parse } from './parseClient'
import { NOTICE_CLASS, ROLES } from './constants'

/**
 * Maps a Parse object to a plain notice for the UI.
 */
export function mapNotice(parseObject) {
  const createdBy = parseObject.get('createdBy')
  return {
    id: parseObject.id,
    title: parseObject.get('title') ?? '',
    content: parseObject.get('content') ?? '',
    category: parseObject.get('category') ?? 'General',
    expiryDate: parseObject.get('expiryDate') ?? null,
    isPinned: Boolean(parseObject.get('isPinned')),
    isUrgent: Boolean(parseObject.get('isUrgent')),
    createdAt: parseObject.createdAt,
    updatedAt: parseObject.updatedAt,
    createdByName: createdBy?.get?.('username') ?? createdBy?.get?.('email') ?? null,
  }
}

function applyAdminWriteAcl(notice, adminUser) {
  const acl = new Parse.ACL()
  acl.setPublicReadAccess(true)
  acl.setPublicWriteAccess(false)
  if (adminUser?.id) {
    acl.setWriteAccess(adminUser.id, true)
    acl.setReadAccess(adminUser.id, true)
  }
  notice.setACL(acl)
}

/**
 * Fetches non-expired notices (server-side expiry filter). Admins may include expired via flag.
 */
export async function fetchNotices({ includeExpired = false } = {}) {
  const q = new Parse.Query(NOTICE_CLASS)
  q.include('createdBy')
  q.descending('createdAt')
  if (!includeExpired) {
    q.greaterThan('expiryDate', new Date())
  }
  const results = await q.find()
  return results.map(mapNotice)
}

/**
 * Subscribes to live updates (requires Live Query enabled on Back4App).
 * Returns unsubscribe function (no-op if subscription is unavailable).
 */
export function subscribeNotices({ onUpdate, onError }) {
  const q = new Parse.Query(NOTICE_CLASS)
  q.include('createdBy')

  let subscription
  let cancelled = false

  const setup = async () => {
    try {
      if (typeof q.subscribe !== 'function') return
      subscription = await q.subscribe()
      if (cancelled) {
        subscription?.unsubscribe?.()
        return
      }
      subscription.on('create', () => onUpdate?.())
      subscription.on('update', () => onUpdate?.())
      subscription.on('delete', () => onUpdate?.())
      subscription.on('error', (err) => onError?.(err))
    } catch (e) {
      onError?.(e)
    }
  }
  setup()

  return () => {
    cancelled = true
    if (subscription) {
      try {
        subscription.unsubscribe()
      } catch {
        /* ignore */
      }
    }
  }
}

export async function createNotice(data) {
  const user = Parse.User.current()
  if (!user || user.get('role') !== ROLES.ADMIN) {
    throw new Error('Only admins can create notices.')
  }

  const Notice = Parse.Object.extend(NOTICE_CLASS)
  const notice = new Notice()

  notice.set('title', data.title.trim())
  notice.set('content', data.content.trim())
  notice.set('category', data.category)
  notice.set('expiryDate', data.expiryDate)
  notice.set('isPinned', Boolean(data.isPinned))
  notice.set('isUrgent', Boolean(data.isUrgent))
  notice.set('createdBy', user)

  applyAdminWriteAcl(notice, user)

  await notice.save()
  return mapNotice(notice)
}

export async function updateNotice(noticeId, data) {
  const user = Parse.User.current()
  if (!user || user.get('role') !== ROLES.ADMIN) {
    throw new Error('Only admins can update notices.')
  }

  const q = new Parse.Query(NOTICE_CLASS)
  const notice = await q.get(noticeId)

  notice.set('title', data.title.trim())
  notice.set('content', data.content.trim())
  notice.set('category', data.category)
  notice.set('expiryDate', data.expiryDate)
  notice.set('isPinned', Boolean(data.isPinned))
  notice.set('isUrgent', Boolean(data.isUrgent))

  applyAdminWriteAcl(notice, user)

  await notice.save()
  return mapNotice(notice)
}

export async function deleteNotice(noticeId) {
  const user = Parse.User.current()
  if (!user || user.get('role') !== ROLES.ADMIN) {
    throw new Error('Only admins can delete notices.')
  }

  const q = new Parse.Query(NOTICE_CLASS)
  const notice = await q.get(noticeId)
  await notice.destroy()
}
