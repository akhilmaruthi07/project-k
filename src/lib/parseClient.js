import Parse from 'parse'

let parseInitialized = false

function normalizeServerUrl(url) {
  if (!url) return null
  const trimmed = String(url).trim()
  if (!trimmed) return null
  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed
}

/**
 * Initializes Parse (Back4App) once. Call from app bootstrap.
 * Required envs:
 * - VITE_PARSE_APP_ID
 * - VITE_PARSE_JS_KEY
 * - VITE_PARSE_SERVER_URL (optional; defaults to Back4App)
 */
export function initParse() {
  const appId = import.meta.env.VITE_PARSE_APP_ID
  const jsKey = import.meta.env.VITE_PARSE_JS_KEY
  const serverURL =
    normalizeServerUrl(import.meta.env.VITE_PARSE_SERVER_URL) ||
    'https://parseapi.back4app.com'

  if (!appId || !jsKey) {
    console.warn(
      '[Parse] Missing VITE_PARSE_APP_ID or VITE_PARSE_JS_KEY. Add them to .env — see README.',
    )
    return false
  }

  if (!parseInitialized) {
    // Requested initialization shape (Back4App)
    Parse.initialize(appId, jsKey)
    Parse.serverURL = serverURL
    parseInitialized = true
  }

  return true
}

export { Parse }
