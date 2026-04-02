import { Helmet } from 'react-helmet-async'
import { DEFAULT_DESCRIPTION, getSiteUrl, SITE_NAME_SHORT } from '../config/site'

/** Données structurées WebSite + Organization (page d’accueil uniquement). */
export function JsonLdSite() {
  const url = getSiteUrl()
  if (!url) return null

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${url}/#website`,
        url,
        name: SITE_NAME_SHORT,
        description: DEFAULT_DESCRIPTION,
        inLanguage: 'fr-CD',
        publisher: { '@id': `${url}/#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${url}/#organization`,
        name: SITE_NAME_SHORT,
        url,
        description: DEFAULT_DESCRIPTION,
      },
    ],
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  )
}
