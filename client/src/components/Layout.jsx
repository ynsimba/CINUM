import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { CookieConsent } from './CookieConsent'
import { LoginModal } from './LoginModal'
import { PageLoader } from './PageLoader'

function focusMainContent() {
  const el = document.getElementById('contenu-principal')
  if (el && typeof el.focus === 'function') {
    window.requestAnimationFrame(() => {
      el.focus({ preventScroll: false })
    })
  }
}

export function Layout() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const hidePublicFooter = pathname.startsWith('/admin')

  return (
    <>
      <a
        href="#contenu-principal"
        className="visually-hidden-focusable skip-link"
        onClick={() => focusMainContent()}
      >
        {t('a11y.skip')}
      </a>
      <Navbar />
      <main
        id="contenu-principal"
        className="flex-grow-1 cinum-main"
        tabIndex={-1}
        aria-label={t('a11y.main_landmark')}
      >
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>
      {!hidePublicFooter && <Footer />}
      <LoginModal />
      <CookieConsent />
    </>
  )
}
