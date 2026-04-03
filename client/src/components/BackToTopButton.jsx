import { useEffect, useState } from 'react'

export function BackToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 420)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function goTop() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, left: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      className={`cinum-back-to-top ${visible ? 'cinum-back-to-top--show' : ''}`}
      onClick={goTop}
      aria-label="Retour en haut de la page"
      title="Retour en haut"
    >
      <i className="fa-solid fa-arrow-up" aria-hidden="true"></i>
    </button>
  )
}
