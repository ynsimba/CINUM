import { useEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

/**
 * Gestion du scroll global :
 * - remonte en haut sur navigation classique,
 * - restaure la position sur retour navigateur,
 * - gère les ancres (#id) de façon fluide.
 */
export function ScrollToTop() {
  const { pathname, search, hash } = useLocation()
  const navType = useNavigationType()

  useEffect(() => {
    const key = `${pathname}${search}`
    const onSave = () => {
      try {
        sessionStorage.setItem(`scroll:${key}`, String(window.scrollY || 0))
      } catch {
        // no-op
      }
    }
    window.addEventListener('beforeunload', onSave)
    return () => {
      onSave()
      window.removeEventListener('beforeunload', onSave)
    }
  }, [pathname, search])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const key = `${pathname}${search}`

    if (hash) {
      const id = hash.replace(/^#/, '')
      const target = id ? document.getElementById(id) : null
      if (target) {
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
        })
        return
      }
    }

    if (navType === 'POP') {
      const saved = Number(sessionStorage.getItem(`scroll:${key}`) || '0')
      window.scrollTo({ top: Number.isFinite(saved) ? saved : 0, left: 0, behavior: 'auto' })
      return
    }

    window.scrollTo({ top: 0, left: 0, behavior: reduce ? 'auto' : 'smooth' })
  }, [pathname, search, hash, navType])

  return null
}
