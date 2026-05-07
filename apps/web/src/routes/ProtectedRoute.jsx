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
