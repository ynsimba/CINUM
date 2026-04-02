/** Nom du site (titres, JSON-LD). */
export const SITE_NAME_SHORT = 'CINUM'

/** URL publique du site, sans slash final (ex. https://www.exemple.cd). Utilisée pour canonical et Open Graph. */
export function getSiteUrl() {
  const raw = import.meta.env.VITE_SITE_URL || ''
  return String(raw).replace(/\/$/, '')
}

/** Description par défaut (accueil et fallback meta). */
export const DEFAULT_DESCRIPTION =
  'Portail institutionnel du civisme numérique en République démocratique du Congo : droits et devoirs en ligne, prévention des abus, signalement sécurisé et références au cadre légal (loi n° 20/017).'
