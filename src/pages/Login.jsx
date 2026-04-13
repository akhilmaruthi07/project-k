import { motion as Motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../lib/constants'
import { Button } from '../components/Button'

export function Login() {
  const { login, signup, parseReady, user, loading, role } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (loading || !parseReady) return
    if (user && role) {
      navigate(role === ROLES.ADMIN ? '/admin' : '/student', { replace: true })
    }
  }, [user, role, loading, parseReady, navigate])

  const goHome = (role) => {
    if (role === ROLES.ADMIN) navigate('/admin', { replace: true })
    else navigate('/student', { replace: true })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!parseReady) {
      toast.error('Configure Parse keys in .env first.')
      return
    }
    setBusy(true)
    try {
      const u = await login(username, password)
      toast.success('Welcome back')
      goHome(u.get('role'))
    } catch (err) {
      toast.error(err?.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!parseReady) {
      toast.error('Configure Parse keys in .env first.')
      return
    }
    setBusy(true)
    try {
      const u = await signup({ username, password, email })
      toast.success('Account created')
      goHome(u.get('role'))
    } catch (err) {
      toast.error(err?.message || 'Sign up failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(14,165,233,0.15),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(14,165,233,0.12),transparent)]" />

      <Motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/30">
            <span className="text-xl font-bold">DN</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Digital Notice Board
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Sign in with your Back4App account
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-200/80 bg-white/90 p-6 shadow-[var(--shadow-soft-lg)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
          <div className="mb-6 flex rounded-2xl bg-zinc-100 p-1 dark:bg-zinc-800">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 rounded-xl py-2 text-sm font-medium transition ${
                mode === 'login'
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50'
                  : 'text-zinc-500'
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 rounded-xl py-2 text-sm font-medium transition ${
                mode === 'signup'
                  ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50'
                  : 'text-zinc-500'
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={mode === 'login' ? handleLogin : handleSignup} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                Username
              </label>
              <input
                required
                autoComplete="username"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {mode === 'signup' && (
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Email (optional)
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-500">
                Password
              </label>
              <input
                required
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Create account'}
            </Button>
          </form>

          {!parseReady && (
            <p className="mt-4 rounded-xl bg-amber-500/10 px-3 py-2 text-xs text-amber-800 dark:text-amber-200">
              Add <code className="rounded bg-black/5 px-1 dark:bg-white/10">VITE_PARSE_APP_ID</code> and{' '}
              <code className="rounded bg-black/5 px-1 dark:bg-white/10">VITE_PARSE_JS_KEY</code> to{' '}
              <code className="rounded bg-black/5 px-1 dark:bg-white/10">.env</code>. See README.
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-zinc-500">
          New signups are <strong>students</strong>. Promote a user to admin in Back4App (User → role = admin).
        </p>
        <p className="mt-2 text-center text-xs">
          <Link to="/" className="text-sky-600 hover:underline dark:text-sky-400">
            Home
          </Link>
        </p>
      </Motion.div>
    </div>
  )
}
