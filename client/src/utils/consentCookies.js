/** Nom du cookie first-party pour le choix RGPD (mesure d’audience / essentiels). */
export const CONSENT_COOKIE_NAME = 'cinum_consent'

const STORAGE_KEY_LEGACY = 'cinum-cookie-consent'
const MAX_AGE_SEC = 365 * 24 * 60 * 60

function readCookie(name) {
  if (typeof document === 'undefined') return null
  const m = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}=([^;]*)`)
  )
  return m ? decodeURIComponent(m[1].trim()) : null
}

/**
 * Lit le consentement : cookie prioritaire, puis migration depuis localStorage.
 * @returns {'all' | 'essential' | null}
 */
export function getConsentPreference() {
  if (typeof window === 'undefined') return null
  const fromCookie = readCookie(CONSENT_COOKIE_NAME)
  if (fromCookie === 'all' || fromCookie === 'essential') return fromCookie

  try {
    const legacy = localStorage.getItem(STORAGE_KEY_LEGACY)
    if (legacy === 'all' || legacy === 'essential') {
      setConsentCookie(legacy)
      return legacy
    }
  } catch {
    /* ignore */
  }
  return null
}

/**
 * Enregistre le choix en cookie HTTP + localStorage (aligné pour l’existant).
 * @param {'all' | 'essential'} value
 */
export function setConsentCookie(value) {
  if (typeof document === 'undefined') return
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; Max-Age=${MAX_AGE_SEC}; SameSite=Lax${secure}`
  try {
    localStorage.setItem(STORAGE_KEY_LEGACY, value)
  } catch {
    /* ignore */
  }
}
