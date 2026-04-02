import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'

/** Synchronise l’attribut `lang` du document avec la langue i18n (WCAG 3.1.1). */
export function DocumentLang() {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('ln') ? 'ln' : 'fr'
  return (
    <Helmet>
      <html lang={lang} />
    </Helmet>
  )
}
