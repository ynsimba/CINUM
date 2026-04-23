/** Nom du site (titres, JSON-LD). */
export const SITE_NAME_SHORT = 'CINUM'
export const SITE_NAME_FULL = 'Civisme numérique — RDC'

/** URL publique du site, sans slash final (ex. https://www.exemple.cd). Utilisée pour canonical et Open Graph. */
export function getSiteUrl() {
  const raw = import.meta.env.VITE_SITE_URL || ''
  return String(raw).replace(/\/$/, '')
}

/** Description par défaut (accueil et fallback meta). */
export const DEFAULT_DESCRIPTION =
  'Portail institutionnel du civisme numérique en République démocratique du Congo : former pour prévenir, encadrer pour orienter et protéger pour sécuriser face aux menaces du cyberespace.'

/** Image de partage par défaut (Open Graph / Twitter). */
export const DEFAULT_SHARE_IMAGE = '/logo.png'
