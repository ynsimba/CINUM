import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { DEFAULT_SHARE_IMAGE, getSiteUrl, SITE_NAME_SHORT } from '../config/site'

const TRACKING_QUERY_KEYS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
  'msclkid',
])

function sanitizeCanonicalSearch(search) {
  if (!search) return ''
  const params = new URLSearchParams(search)
  for (const key of [...params.keys()]) {
    if (TRACKING_QUERY_KEYS.has(key.toLowerCase())) params.delete(key)
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

/**
 * Meta SEO (title, description, Open Graph, Twitter) et accessibilité (langue document).
 * @param {string} title — Titre complet de la page (déjà suffixé si besoin).
 * @param {string} [description] — Meta description (≈150–160 caractères recommandés).
 * @param {boolean} [noindex] — true pour pages privées (connexion, admin).
 * @param {string} [ogType] — ex. 'article' pour une actualité.
 * @param {string} [image] — URL absolue/relative de l’image de partage.
 * @param {string} [imageAlt] — Texte alternatif de l’image de partage.
 * @param {string} [publishedTime] — Date ISO 8601 (article/news).
 * @param {string} [modifiedTime] — Date ISO 8601 (article/news).
 * @param {string} [keywords] — Mots-clés séparés par virgules.
 */
export function Seo({
  title,
  description,
  noindex = false,
  ogType = 'website',
  image,
  imageAlt,
  publishedTime,
  modifiedTime,
  keywords,
}) {
  const { pathname, search } = useLocation()
  const base = getSiteUrl()
  const canonicalSearch = sanitizeCanonicalSearch(search)
  const canonical = base ? `${base}${pathname === '/' ? '' : pathname}${canonicalSearch}` : null
  const imagePath = image || DEFAULT_SHARE_IMAGE
  const imageUrl = imagePath
    ? imagePath.startsWith('http://') || imagePath.startsWith('https://')
      ? imagePath
      : base
        ? `${base}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`
        : null
    : null
  const desc = description || undefined

  return (
    <Helmet>
      <title>{title}</title>
      {desc && <meta name="description" content={desc} />}
      {keywords && <meta name="keywords" content={keywords} />}
      {canonical && <link rel="canonical" href={canonical} />}
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1'}
      />
      <meta name="theme-color" content="#214aa5" />
      <meta name="apple-mobile-web-app-capable" content="yes" />

      <meta property="og:site_name" content={SITE_NAME_SHORT} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      {desc && <meta property="og:description" content={desc} />}
      {canonical && <meta property="og:url" content={canonical} />}
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      <meta property="og:locale" content="fr_CD" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {desc && <meta name="twitter:description" content={desc} />}
      {canonical && <meta name="twitter:url" content={canonical} />}
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}

      {canonical && <link rel="alternate" hrefLang="fr-cd" href={canonical} />}
      {canonical && <link rel="alternate" hrefLang="fr" href={canonical} />}
      {canonical && <link rel="alternate" hrefLang="en" href={canonical} />}
      {canonical && <link rel="alternate" hrefLang="x-default" href={canonical} />}
    </Helmet>
  )
}
