import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { isAdminAuthBypass } from '../config/adminFlags'
import { setLanguage } from '../i18n'
import { resolveUiLang } from '../utils/uiLang'

const linkClass = ({ isActive }) => `nav-link px-lg-2 ${isActive ? 'active fw-semibold' : ''}`

/** Rubriques regroupées sous « Informations » — la barre ne garde que 3 liens + outils */
const portalPaths = [
  '/a-propos',
  '/contact',
  '/confidentialite',
  '/mentions-legales',
  '/code-du-numerique',
  '/signalement/suivi',
  '/faq',
  '/glossaire',
  '/presse',
  '/rapports-activite',
  '/droits',
  '/devoirs',
  '/infractions',
  '/sanctions',
  '/bonnes-pratiques',
  '/espace-educatif',
  '/litteratie-numerique',
  '/actualites',
]

export function Navbar() {
  const { t, i18n } = useTranslation()
  const { user, logoutStaff } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const portalActive =
    portalPaths.some((p) => location.pathname === p || location.pathname.startsWith(`${p}/`)) ||
    location.pathname.startsWith('/article/')

  const close = () => setOpen(false)

  const renderToolbar = (langId) => (
    <>
      <label className="visually-hidden" htmlFor={langId}>
        {t('a11y.lang')}
      </label>
      <select
        id={langId}
        className="form-select form-select-sm"
        style={{ width: 'auto', minWidth: '4.5rem' }}
        value={resolveUiLang(i18n)}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="fr">FR</option>
        <option value="ln">LN</option>
        <option value="en">EN</option>
      </select>
      {user ? (
        <div className="btn-group btn-group-sm">
          <Link className="btn btn-outline-primary" to="/admin" onClick={close}>
            {t('nav.admin')}
          </Link>
          <button
            type="button"
            className="btn btn-outline-secondary"
            aria-label={t('a11y.logout')}
            onClick={() => logoutStaff()}
          >
            {t('nav.logout_short')}
          </button>
        </div>
      ) : (
        isAdminAuthBypass && (
          <Link className="btn btn-sm btn-outline-primary" to="/admin" onClick={close}>
            {t('nav.admin')}
          </Link>
        )
      )}
    </>
  )

  return (
    <header className="border-bottom bg-white shadow-sm sticky-top cinum-header">
      <nav className="navbar navbar-expand-lg navbar-light py-2 py-md-3" aria-label={t('a11y.menu')}>
        <div className="container cinum-navbar-wrap px-3 px-sm-4">
          <Link
            className="navbar-brand fw-bold me-2 d-inline-flex align-items-center text-decoration-none text-black cinum-navbar-brand"
            to="/"
            onClick={close}
          >
            <img
              src="/logo.png"
              alt="CINUM — portail du civisme numérique, retour à l’accueil"
              className="cinum-navbar-logo me-2 flex-shrink-0"
              decoding="async"
            />
            <span className="cinum-navbar-wordmark">CINUM</span>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navbarMain"
            aria-expanded={open}
            aria-label={open ? t('a11y.menu_close') : t('a11y.menu_open')}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div
            className={`collapse navbar-collapse cinum-navbar-collapse ${open ? 'show' : ''}`}
            id="navbarMain"
          >
            <ul className="navbar-nav cinum-navbar-nav-main mb-2 mb-lg-0 align-items-lg-center gap-lg-1 cinum-nav-touch">
              <li className="nav-item">
                <NavLink className={linkClass} to="/" end onClick={close}>
                  {t('nav.home')}
                </NavLink>
              </li>
              <li className="nav-item dropdown">
                <a
                  className={`nav-link dropdown-toggle px-lg-2 ${portalActive ? 'active fw-semibold' : ''}`}
                  href="#"
                  id="navPortal"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  aria-haspopup="menu"
                  aria-label={t('nav.portal_aria')}
                  aria-current={portalActive ? 'true' : undefined}
                  onClick={(e) => e.preventDefault()}
                >
                  {t('nav.portal')}
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-lg-end shadow border-0 py-3"
                  style={{ minWidth: '18rem', maxHeight: 'min(85vh, 32rem)', overflowY: 'auto' }}
                  aria-labelledby="navPortal"
                >
                  <li>
                    <h6 className="dropdown-header text-uppercase small mb-0">{t('nav.sec_institution')}</h6>
                  </li>
                  <li>
                    <NavLink className="dropdown-item py-2" to="/a-propos" onClick={close}>
                      {t('nav.about')}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item py-2" to="/contact" onClick={close}>
                      {t('nav.contact')}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item py-2" to="/confidentialite" onClick={close}>
                      {t('home.link_privacy')}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item py-2" to="/mentions-legales" onClick={close}>
                      {t('home.link_legal')}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item py-2" to="/code-du-numerique" onClick={close}>
                      {t('nav.digital_code')}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item py-2" to="/signalement/suivi" onClick={close}>
                      {t('home.track_report')}
                    </NavLink>
                  </li>
                  <li>
                    <hr className="dropdown-divider my-2" aria-hidden="true" />
                  </li>
                  <li>
                    <h6 className="dropdown-header text-uppercase small mb-0">{t('nav.sec_learn')}</h6>
                  </li>
                  <li>
                    <NavLink className="dropdown-item py-2" to="/espace-educatif" onClick={close}>
                      {t('nav.education')}
                    </NavLink>
                  </li>
                  <li>
                    <hr className="dropdown-divider my-2" aria-hidden="true" />
                  </li>
                  <li>
                    <h6 className="dropdown-header text-uppercase small mb-0">{t('nav.sec_help')}</h6>
                  </li>
                  <li>
                    <NavLink className="dropdown-item py-2" to="/faq" onClick={close}>
                      {t('nav.faq')}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item py-2" to="/glossaire" onClick={close}>
                      {t('nav.glossary')}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item py-2" to="/litteratie-numerique" onClick={close}>
                      {t('nav.digital_literacy')}
                    </NavLink>
                  </li>
                  <li>
                    <hr className="dropdown-divider my-2" aria-hidden="true" />
                  </li>
                  <li>
                    <h6 className="dropdown-header text-uppercase small mb-0">{t('nav.sec_media')}</h6>
                  </li>
                  <li>
                    <NavLink className="dropdown-item py-2" to="/presse" onClick={close}>
                      {t('nav.press')}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item py-2" to="/rapports-activite" onClick={close}>
                      {t('nav.activity_reports')}
                    </NavLink>
                  </li>
                  <li>
                    <hr className="dropdown-divider my-2" aria-hidden="true" />
                  </li>
                  <li>
                    <h6 className="dropdown-header text-uppercase small mb-0">{t('nav.sec_rights')}</h6>
                  </li>
                  <li>
                    <NavLink className="dropdown-item py-2" to="/droits" onClick={close}>
                      {t('nav.rights')}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item py-2" to="/devoirs" onClick={close}>
                      {t('nav.duties')}
                    </NavLink>
                  </li>
                  <li>
                    <hr className="dropdown-divider my-2" aria-hidden="true" />
                  </li>
                  <li>
                    <h6 className="dropdown-header text-uppercase small mb-0">{t('nav.sec_risk')}</h6>
                  </li>
                  <li>
                    <NavLink className="dropdown-item py-2" to="/infractions" onClick={close}>
                      {t('nav.offenses')}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item py-2" to="/sanctions" onClick={close}>
                      {t('nav.sanctions')}
                    </NavLink>
                  </li>
                  <li>
                    <NavLink className="dropdown-item py-2" to="/bonnes-pratiques" onClick={close}>
                      {t('nav.practices')}
                    </NavLink>
                  </li>
                  <li>
                    <hr className="dropdown-divider my-2" aria-hidden="true" />
                  </li>
                  <li>
                    <h6 className="dropdown-header text-uppercase small mb-0">{t('nav.sec_news')}</h6>
                  </li>
                  <li>
                    <NavLink className="dropdown-item py-2" to="/actualites" onClick={close}>
                      {t('nav.news')}
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) =>
                    `nav-link px-lg-2 fw-semibold ${isActive ? 'text-primary' : 'text-danger'}`
                  }
                  to="/signalement"
                  onClick={close}
                >
                  {t('nav.report')}
                </NavLink>
              </li>
            </ul>
            <div className="cinum-navbar-tools-mobile d-flex d-lg-none align-items-center gap-2 flex-wrap mt-2 pt-2 border-top">
              {renderToolbar('cinum-lang-mobile')}
            </div>
          </div>
          <div className="cinum-navbar-tools-desktop d-none d-lg-flex align-items-center gap-2 flex-shrink-0">
            {renderToolbar('cinum-lang-desktop')}
          </div>
        </div>
      </nav>
    </header>
  )
}
