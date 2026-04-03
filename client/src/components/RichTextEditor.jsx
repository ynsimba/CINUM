import { useEffect, useMemo, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Youtube, { isValidYoutubeUrl } from '@tiptap/extension-youtube'
import { api } from '../api/client'
import { AudioFile, VideoFile } from './editor/tiptapMediaNodes'

async function postEditorMedia(file) {
  const fd = new FormData()
  fd.append('file', file)
  const { data } = await api.post('/api/admin/editor-media', fd, {
    timeout: 120_000,
  })
  return data.url
}

function ToolbarButton({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      className={`btn btn-sm ${active ? 'btn-primary' : 'btn-outline-secondary'}`}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  )
}

function EditorToolbar({ editor }) {
  if (!editor) return null

  const setImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const url = await postEditorMedia(file)
      editor.chain().focus().setImage({ src: url }).run()
    }
    input.click()
  }

  const setMediaFile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'audio/*,video/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const url = await postEditorMedia(file)
      if (file.type.startsWith('audio/')) {
        editor.chain().focus().insertContent({ type: 'audioFile', attrs: { src: url } }).run()
      } else {
        editor.chain().focus().insertContent({ type: 'videoFile', attrs: { src: url } }).run()
      }
    }
    input.click()
  }

  const setLink = () => {
    const prev = editor.getAttributes('link').href
    const url = window.prompt('Adresse du lien (URL)', prev || 'https://')
    if (url === null) return
    const trimmed = url.trim()
    if (trimmed === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: trimmed }).run()
  }

  const setYoutube = () => {
    const url = window.prompt('URL de la vidéo YouTube', 'https://www.youtube.com/watch?v=')
    if (!url?.trim()) return
    if (!isValidYoutubeUrl(url.trim())) {
      window.alert('URL YouTube non reconnue.')
      return
    }
    editor.chain().focus().setYoutubeVideo({ src: url.trim() }).run()
  }

  return (
    <div className="rich-text-toolbar border-bottom bg-light px-2 py-1 d-flex flex-wrap gap-1 align-items-center">
      <ToolbarButton
        title="Titre 1"
        active={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </ToolbarButton>
      <ToolbarButton
        title="Titre 2"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </ToolbarButton>
      <ToolbarButton
        title="Titre 3"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </ToolbarButton>
      <span className="text-muted px-1">|</span>
      <ToolbarButton
        title="Gras"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <strong>B</strong>
      </ToolbarButton>
      <ToolbarButton
        title="Italique"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <em>I</em>
      </ToolbarButton>
      <ToolbarButton
        title="Souligné"
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <u>U</u>
      </ToolbarButton>
      <ToolbarButton
        title="Barré"
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <s>S</s>
      </ToolbarButton>
      <span className="text-muted px-1">|</span>
      <ToolbarButton
        title="Liste à puces"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        •
      </ToolbarButton>
      <ToolbarButton
        title="Liste numérotée"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1.
      </ToolbarButton>
      <span className="text-muted px-1">|</span>
      <ToolbarButton title="Lien" active={editor.isActive('link')} onClick={setLink}>
        Lien
      </ToolbarButton>
      <ToolbarButton title="Insérer une image" active={false} onClick={setImage}>
        Image
      </ToolbarButton>
      <ToolbarButton title="Vidéo YouTube" active={editor.isActive('youtube')} onClick={setYoutube}>
        YouTube
      </ToolbarButton>
      <ToolbarButton title="Fichier audio ou vidéo" active={false} onClick={setMediaFile}>
        Média
      </ToolbarButton>
    </div>
  )
}

/**
 * Éditeur riche (TipTap, compatible React 19) : liens, image (upload), YouTube, fichier audio/vidéo hébergé.
 */
export function RichTextEditor({ value, onChange, placeholder = 'Rédigez le contenu…', id }) {
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: {
          openOnClick: false,
          HTMLAttributes: {
            rel: 'noopener noreferrer',
            target: '_blank',
          },
        },
      }),
      Image.configure({
        HTMLAttributes: { class: 'img-fluid rounded' },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      Youtube.configure({
        nocookie: true,
        width: 560,
        height: 315,
        HTMLAttributes: {
          class: 'rounded',
        },
      }),
      AudioFile,
      VideoFile,
    ],
    [placeholder]
  )

  const editor = useEditor(
    {
      extensions,
      content: value ?? '',
      editorProps: {
        attributes: {
          class: 'rich-text-prose',
          ...(id ? { id } : {}),
        },
      },
      onUpdate: ({ editor: ed }) => {
        onChangeRef.current(ed.getHTML())
      },
    },
    [extensions]
  )

  useEffect(() => {
    if (!editor || editor.isDestroyed) return
    const next = value ?? ''
    const cur = editor.getHTML()
    if (next === cur) return
    const norm = (h) => (!h || h === '<p></p>' ? '' : h)
    if (norm(next) === norm(cur)) return
    editor.commands.setContent(next || '', { emitUpdate: false })
  }, [value, editor])

  return (
    <div className="rich-text-editor-wrap border rounded overflow-hidden bg-white">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} className="rich-text-editor-content" />
    </div>
  )
}
