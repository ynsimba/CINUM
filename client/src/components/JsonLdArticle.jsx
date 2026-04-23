import { Helmet } from 'react-helmet-async'
import { getSiteUrl, SITE_NAME_SHORT } from '../config/site'

export function JsonLdArticle({ title, description, urlPath, image, publishedAt, updatedAt }) {
  const site = getSiteUrl()
  if (!site || !title) return null

  const canonical = `${site}${urlPath.startsWith('/') ? urlPath : `/${urlPath}`}`
  const imageUrl =
    image && (image.startsWith('http://') || image.startsWith('https://'))
      ? image
      : image
        ? `${site}${image.startsWith('/') ? image : `/${image}`}`
        : undefined

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description || undefined,
    datePublished: publishedAt || undefined,
    dateModified: updatedAt || publishedAt || undefined,
    image: imageUrl ? [imageUrl] : undefined,
    mainEntityOfPage: canonical,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME_SHORT,
      url: site,
    },
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  )
}
