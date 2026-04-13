import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Parse, initParse } from '../lib/parseClient'
import { ROLES } from '../lib/constants'

const AuthContext = createContext(null)

/**
 * Reads role from the current Parse user (custom field `role`).
 */
function getRoleFromUser(user) {
  if (!user) return null
  const r = user.get('role')
  return r === ROLES.ADMIN || r === ROLES.STUDENT ? r : ROLES.STUDENT
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const parseReady = useMemo(() => initParse(), [])
  const [loading, setLoading] = useState(() => parseReady)

  /* Sync React state from Parse.User.current() on mount — external session store. */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!parseReady) return

    const current = Parse.User.current()
    if (current) {
      setUser(current)
      setRole(getRoleFromUser(current))
    }
    setLoading(false)
  }, [parseReady])
  /* eslint-enable react-hooks/set-state-in-effect */

  const refreshUser = useCallback(async () => {
    if (!parseReady) return
    try {
      await Parse.User.current()?.fetch()
      const u = Parse.User.current()
      setUser(u ?? null)
      setRole(getRoleFromUser(u))
    } catch {
      setUser(null)
      setRole(null)
    }
  }, [parseReady])

  const login = useCallback(async (username, password) => {
    const u = await Parse.User.logIn(username, password)
    setUser(u)
    setRole(getRoleFromUser(u))
    return u
  }, [])

  /** New accounts are always students; promote to admin in the Back4App dashboard (User.role = admin). */
  const signup = useCallback(async ({ username, password, email }) => {
    const newUser = new Parse.User()
    newUser.set('username', username.trim())
    newUser.set('password', password)
    if (email?.trim()) newUser.set('email', email.trim())
    newUser.set('role', ROLES.STUDENT)

    const u = await newUser.signUp()
    setUser(u)
    setRole(getRoleFromUser(u))
    return u
  }, [])

  const logout = useCallback(async () => {
    await Parse.User.logOut()
    setUser(null)
    setRole(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      role,
      loading,
      parseReady,
      login,
      signup,
      logout,
      refreshUser,
      isAdmin: role === ROLES.ADMIN,
      isStudent: role === ROLES.STUDENT,
    }),
    [user, role, loading, parseReady, login, signup, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook paired with provider
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
