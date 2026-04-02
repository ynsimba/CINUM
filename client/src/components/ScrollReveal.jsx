import { useEffect, useRef, useState } from 'react'

const variantClass = {
  'fade-up': 'scroll-reveal--fade-up',
  fade: 'scroll-reveal--fade',
  'fade-left': 'scroll-reveal--fade-left',
  scale: 'scroll-reveal--scale',
}

/**
 * Anime l’apparition au scroll (Intersection Observer). Respecte prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  className = '',
  variant = 'fade-up',
  delay = 0,
  threshold = 0.08,
  rootMargin = '0px 0px -24px 0px',
  as: Component = 'div',
  once = true,
  style,
  ...rest
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) obs.unobserve(entry.target)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold, rootMargin }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, rootMargin, once])

  const v = variantClass[variant] || variantClass['fade-up']

  return (
    <Component
      ref={ref}
      className={`scroll-reveal ${v} ${visible ? 'scroll-reveal--visible' : ''} ${className}`.trim()}
      style={{ '--sr-delay': `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Component>
  )
}
