import { useEffect, useRef } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Seo } from '../../components/Seo'
import { AdminRefreshProvider } from '../../context/AdminRefreshContext'
import { useAuth } from '../../context/AuthContext'

const sub = ({ isActive }) => `nav-link ${isActive ? 'active fw-semibold' : 'text-body'}`
const ADMIN_IDLE_TIMEOUT_MS = 5 * 60 * 1000

export function AdminLayout() {
  const { user, logoutStaff } = useAuth()
  const navigate = useNavigate()
  const loc = useLocation()
  const timeoutRef = useRef(null)
  const logoutInProgressRef = useRef(false)

  useEffect(() => {
    if (!user) return undefined

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']

    const clearTimer = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }

    const onIdle = async () => {
      if (logoutInProgressRef.current) return
      logoutInProgressRef.current = true
      try {
        await logoutStaff()
      } catch {
        // Ignore network errors here: client state is still reset by logoutStaff.
      } finally {
        navigate('/connexion', {
          replace: true,
          state: { from: { pathname: loc.pathname, search: loc.search, hash: loc.hash } },
        })
      }
    }

    const restartTimer = () => {
      clearTimer()
      timeoutRef.current = window.setTimeout(onIdle, ADMIN_IDLE_TIMEOUT_MS)
    }

    activityEvents.forEach((evt) => window.addEventListener(evt, restartTimer, { passive: true }))
    restartTimer()

    return () => {
      clearTimer()
      activityEvents.forEach((evt) => window.removeEventListener(evt, restartTimer))
    }
  }, [user, logoutStaff, navigate, loc.pathname, loc.search, loc.hash])

  return (
    <>
      <Seo
        title="Administration — Civisme numérique RDC"
        description="Interface d’administration du portail CINUM (réservée aux rôles habilités)."
        noindex
      />
      <div className="border-bottom bg-white py-2">
        <div className="container px-3 px-sm-4 d-flex flex-column flex-sm-row flex-wrap justify-content-between align-items-start align-items-sm-center gap-2 gap-sm-3">
          <Link to="/" className="small text-decoration-none text-break">
            ← Retour au site public
          </Link>
          <span className="small text-muted text-sm-end">Espace d’administration</span>
        </div>
      </div>
      <div className="bg-light border-bottom py-2">
        <div className="container px-3 px-sm-4">
          <nav aria-label="Administration">
            <ul className="nav flex-wrap gap-1 gap-sm-2 small cinum-admin-subnav">
              <li className="nav-item">
                <NavLink className={sub} to="/admin" end>
                  Tableau de bord
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={sub} to="/admin/articles">
                  Articles
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={sub} to="/admin/actualites">
                  Actualités
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={sub} to="/admin/signalements">
                  Signalements
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={sub} to="/admin/ressources">
                  Ressources
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={sub} to="/admin/lois">
                  Références légales
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={sub} to="/admin/messages-contact">
                  Messages contact
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className={sub} to="/admin/securite-compte">
                  Sécurité du compte
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <AdminRefreshProvider>
        <div className="container px-3 px-sm-4 py-3 py-md-4">
          <Outlet />
        </div>
      </AdminRefreshProvider>
    </>
  )
}
