import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { STAFF_ROLES } from '../constants/staffRoles'
import { isAdminAuthBypass } from '../config/adminFlags'

/**
 * Protège les routes enfants : session requise, rôle parmi `roles` (par défaut admin + modérateur).
 * Si `VITE_DISABLE_ADMIN_AUTH=true` (dev temporaire), accès sans connexion — à retirer en production.
 */
export function ProtectedRoute({ roles = STAFF_ROLES }) {
  const { user, loading } = useAuth()
  const loc = useLocation()

  if (isAdminAuthBypass) {
    return <Outlet />
  }

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
