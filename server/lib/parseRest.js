const DEFAULT_PARSE_URL = 'https://parseapi.back4app.com'

function normalizeServerUrl(url) {
  if (!url) return DEFAULT_PARSE_URL
  const trimmed = String(url).trim()
  if (!trimmed) return DEFAULT_PARSE_URL
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed
}

export function getParseConfig() {
  const serverURL = normalizeServerUrl(process.env.PARSE_SERVER_URL)
  const appId = process.env.PARSE_APP_ID
  const restKey = process.env.PARSE_REST_API_KEY

  if (!appId || !restKey) {
    throw new Error(
      'Missing PARSE_APP_ID or PARSE_REST_API_KEY in server env.',
    )
  }

  return { serverURL, appId, restKey }
}

export async function parseFetch(path, { method = 'GET', sessionToken, body } = {}) {
  const { serverURL, appId, restKey } = getParseConfig()

  const headers = {
    'X-Parse-Application-Id': appId,
    'X-Parse-REST-API-Key': restKey,
    'Content-Type': 'application/json',
  }
  if (sessionToken) headers['X-Parse-Session-Token'] = sessionToken

  const res = await fetch(`${serverURL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()
  let json = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = { raw: text }
  }

  if (!res.ok) {
    const message =
      json?.error || json?.message || `Parse REST error ${res.status}`
    const err = new Error(message)
    err.status = res.status
    err.details = json
    throw err
  }

  return json
}

export function toParseDate(date) {
  const d = date instanceof Date ? date : new Date(date)
  return { __type: 'Date', iso: d.toISOString() }
}

export function toUserPointer(objectId) {
  return { __type: 'Pointer', className: '_User', objectId }
}

