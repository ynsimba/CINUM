import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { getSiteUrl } from '../config/site'

/**
 * Meta SEO (title, description, Open Graph, Twitter) et accessibilité (langue document).
 * @param {string} title — Titre complet de la page (déjà suffixé si besoin).
 * @param {string} [description] — Meta description (≈150–160 caractères recommandés).
 * @param {boolean} [noindex] — true pour pages privées (connexion, admin).
 * @param {string} [ogType] — ex. 'article' pour une actualité.
 */
export function Seo({ title, description, noindex = false, ogType = 'website' }) {
  const { pathname } = useLocation()
  const base = getSiteUrl()
  const canonical = base ? `${base}${pathname === '/' ? '' : pathname}` : null
  const desc = description || undefined

  return (
    <Helmet>
      <title>{title}</title>
      {desc && <meta name="description" content={desc} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      {desc && <meta property="og:description" content={desc} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:locale" content="fr_CD" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {desc && <meta name="twitter:description" content={desc} />}
    </Helmet>
  )
}
