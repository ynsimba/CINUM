/** Retire les balises HTML pour les métas ou extraits. */
export function stripHtml(html) {
  if (!html) return ''
  return String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Tronque un texte pour une meta description (≈150–160 caractères). */
export function truncateMeta(text, max = 158) {
  if (!text) return ''
  const t = String(text)
    .replace(/\s+/g, ' ')
    .trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 50 ? cut.slice(0, lastSpace) : cut) + '…'
}
