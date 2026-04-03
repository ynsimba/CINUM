import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { resolveUiLang } from '../utils/uiLang'

/** Synchronise l’attribut `lang` du document avec la langue i18n (WCAG 3.1.1). */
export function DocumentLang() {
  const { i18n } = useTranslation()
  const lang = resolveUiLang(i18n)
  return (
    <Helmet>
      <html lang={lang} />
    </Helmet>
  )
}
