/** Première balise <img src="…"> trouvée dans du HTML (contenu riche). */
export function extractFirstImageSrcFromHtml(html) {
  if (!html || typeof html !== 'string') return ''
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  return m ? m[1].trim() : ''
}

/** URL de couverture : champ dédié, sinon première image du corps. */
export function getNewsCoverSrc(item) {
  const u = (item?.coverImageUrl || '').trim()
  if (u) return u
  return extractFirstImageSrcFromHtml(item?.content || '')
}
