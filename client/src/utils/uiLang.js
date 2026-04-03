/** Code langue UI : fr | ln | en */
export function resolveUiLang(i18n) {
  const base = (i18n?.language || 'fr').split('-')[0].toLowerCase()
  if (base === 'ln') return 'ln'
  if (base === 'en') return 'en'
  return 'fr'
}

/** Locale pour dates (toLocaleString). */
export function localeForDate(i18n) {
  const u = resolveUiLang(i18n)
  if (u === 'en') return 'en-GB'
  if (u === 'ln') return 'fr-FR'
  return 'fr-FR'
}
