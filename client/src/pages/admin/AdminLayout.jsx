import { Link, NavLink, Outlet } from 'react-router-dom'
import { Seo } from '../../components/Seo'

const sub = ({ isActive }) => `nav-link ${isActive ? 'active fw-semibold' : 'text-body'}`

export function AdminLayout() {
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
            </ul>
          </nav>
        </div>
      </div>
      <div className="container px-3 px-sm-4 py-3 py-md-4">
        <Outlet />
      </div>
    </>
  )
}
