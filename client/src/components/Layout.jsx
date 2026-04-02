import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { CookieConsent } from './CookieConsent'
import { LoginModal } from './LoginModal'

export function Layout() {
  const { t } = useTranslation()
  return (
    <>
      <a href="#contenu-principal" className="visually-hidden-focusable skip-link">
        {t('a11y.skip')}
      </a>
      <Navbar />
      <main
        id="contenu-principal"
        className="flex-grow-1 cinum-main"
        tabIndex={-1}
        aria-label="Contenu principal"
      >
        <Outlet />
      </main>
      <Footer />
      <LoginModal />
      <CookieConsent />
    </>
  )
}
