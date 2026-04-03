import { useMemo } from 'react'
import DOMPurify from 'dompurify'

const PURIFY = {
  ADD_TAGS: ['iframe', 'video', 'audio', 'source'],
  ADD_ATTR: [
    'allow',
    'allowfullscreen',
    'frameborder',
    'controls',
    'preload',
    'loading',
    'target',
    'rel',
    'type',
  ],
}

/** Affiche du HTML issu du serveur (déjà nettoyé) avec une couche DOMPurify côté client. */
export function SafeHtml({ html, className }) {
  const clean = useMemo(() => DOMPurify.sanitize(html || '', PURIFY), [html])
  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />
}
