import { Node, mergeAttributes } from '@tiptap/core'

/** Fichier audio hébergé (<audio controls>) */
export const AudioFile = Node.create({
  name: 'audioFile',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'audio[controls]',
        getAttrs: (el) => {
          if (!(el instanceof HTMLElement)) return false
          const src = el.getAttribute('src')
          if (!src) return false
          return { src }
        },
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['audio', mergeAttributes(HTMLAttributes, { controls: true, preload: 'metadata' })]
  },
})

/** Fichier vidéo hébergé (<video controls>) — distinct de l’iframe YouTube */
export const VideoFile = Node.create({
  name: 'videoFile',
  group: 'block',
  atom: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'video[controls]',
        getAttrs: (el) => {
          if (!(el instanceof HTMLElement)) return false
          const src = el.getAttribute('src')
          if (!src) return false
          return { src }
        },
      },
    ]
  },
  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(HTMLAttributes, { controls: true })]
  },
})
