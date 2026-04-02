import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth()
  const loc = useLocation()

  if (loading) {
    return (
      <div
        className="container py-5 text-center"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="spinner-border text-primary" aria-hidden="true" />
        <span className="visually-hidden">Vérification de la session…</span>
      </div>
    )
  }

  if (!user) return <Navigate to="/connexion" state={{ from: loc }} replace />

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
