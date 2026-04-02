import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getConsentPreference, setConsentCookie } from '../utils/consentCookies'

let matomoInjected = false

function loadMatomo() {
  const url = import.meta.env.VITE_MATOMO_URL
  const siteId = import.meta.env.VITE_MATOMO_SITE_ID
  if (!url || !siteId || typeof window === 'undefined' || matomoInjected) return
  matomoInjected = true

  window._paq = window._paq || []
  window._paq.push(['trackPageView'])
  window._paq.push(['enableLinkTracking'])
  const u = url.replace(/\/?$/, '/')
  window._paq.push(['setTrackerUrl', `${u}matomo.php`])
  window._paq.push(['setSiteId', siteId])
  const d = document
  const g = d.createElement('script')
  const s = d.getElementsByTagName('script')[0]
  g.async = true
  g.src = `${u}matomo.js`
  s.parentNode.insertBefore(g, s)
}

export function CookieConsent() {
  const { t } = useTranslation()
  const [choice, setChoice] = useState(() => getConsentPreference())

  useEffect(() => {
    if (choice === 'all') {
      loadMatomo()
    }
  }, [choice])

  function acceptAll() {
    setConsentCookie('all')
    setChoice('all')
  }

  function essentialOnly() {
    setConsentCookie('essential')
    setChoice('essential')
  }

  if (choice) return null

  return (
    <div
      className="cinum-cookie-banner position-fixed bottom-0 start-0 end-0 shadow-lg border-top bg-white"
      style={{ zIndex: 1080 }}
      role="region"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className="container px-3 px-sm-4 py-3">
        <div className="row align-items-stretch align-items-md-start g-3">
          <div className="col-12 col-lg-8">
            <h2 id="cookie-consent-title" className="h6 mb-2">
              {t('cookie.title')}
            </h2>
            <p id="cookie-consent-desc" className="small text-muted mb-0 text-break">
              {t('cookie.body')}
            </p>
          </div>
          <div className="col-12 col-lg-4 d-grid d-sm-flex flex-sm-wrap gap-2 justify-content-lg-end align-content-start">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm order-2 order-sm-1 flex-grow-1 flex-sm-grow-0"
              onClick={essentialOnly}
            >
              {t('cookie.reject')}
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm order-1 order-sm-2 flex-grow-1 flex-sm-grow-0"
              onClick={acceptAll}
            >
              {t('cookie.accept')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
