import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import fr from '../locales/fr.json'
import ln from '../locales/ln.json'

const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('cinum-lang') : null

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    ln: { translation: ln },
  },
  lng: saved || 'fr',
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
})

export function setLanguage(lng) {
  i18n.changeLanguage(lng)
  localStorage.setItem('cinum-lang', lng)
}

export default i18n
