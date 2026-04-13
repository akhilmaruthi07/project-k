import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ROLES } from './lib/constants'
import { AdminDashboard } from './pages/AdminDashboard'
import { Login } from './pages/Login'
import { StudentDashboard } from './pages/StudentDashboard'

function Protected({ role, children }) {
  const { user, loading, role: userRole, parseReady } = useAuth()
  const location = useLocation()

  if (!parseReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="max-w-md px-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
          Add Back4App keys to <code className="rounded bg-black/5 px-1 dark:bg-white/10">.env</code> and reload.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-sky-500 dark:border-zinc-700" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (role && userRole !== role) {
    return <Navigate to={userRole === ROLES.ADMIN ? '/admin' : '/student'} replace />
  }

  return children
}

function HomeRedirect() {
  const { user, loading, role, parseReady } = useAuth()

  if (!parseReady) return <Navigate to="/login" replace />
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-sky-500" />
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  if (role === ROLES.ADMIN) return <Navigate to="/admin" replace />
  return <Navigate to="/student" replace />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            className: 'dark:bg-zinc-900 dark:text-zinc-100',
            style: {
              borderRadius: '12px',
              boxShadow: 'var(--shadow-soft-lg)',
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/student"
            element={
              <Protected role={ROLES.STUDENT}>
                <StudentDashboard />
              </Protected>
            }
          />
          <Route
            path="/admin"
            element={
              <Protected role={ROLES.ADMIN}>
                <AdminDashboard />
              </Protected>
            }
          />
          <Route path="/" element={<HomeRedirect />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}
