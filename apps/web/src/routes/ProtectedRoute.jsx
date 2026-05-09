import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'

export function ProtectedRoute({ children, adminOnly }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!isAuthenticated) return (
    <Navigate to="/login" state={{ from: location }} replace />
  )

  if (adminOnly && !isAdmin) return (
    <Navigate to="/dashboard" replace />
  )

  return children
}

// Redirects already-authenticated users away from public-only pages (login, signup).
// Uses <Navigate> inside the render cycle — never a useEffect — so it fires
// synchronously with the setUser() update and avoids all race conditions.
export function PublicRoute({ children, redirectTo }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (isAuthenticated) {
    // Honour the "from" state set by ProtectedRoute, but never redirect to
    // the root ("/") which would flash the landing page.
    const raw = location.state?.from?.pathname
    const to = redirectTo
      ?? (raw && raw !== '/' && raw.startsWith('/') ? raw : '/dashboard')
    return <Navigate to={to} replace />
  }

  return children
}
