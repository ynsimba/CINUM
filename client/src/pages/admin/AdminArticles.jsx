import { useEffect, useState } from 'react'
import { api, fetchCsrf } from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import { RichTextEditor } from '../../components/RichTextEditor'
import { stripHtml } from '../../utils/seo'

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  category: 'education',
  published: true,
}

export function AdminArticles() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [editingSlug, setEditingSlug] = useState(null)
  const [msg, setMsg] = useState(null)
  const [msgIsError, setMsgIsError] = useState(false)

  const load = () =>
    api.get('/api/admin/articles').then((r) => setItems(r.data.items || []))

  useEffect(() => {
    load().catch(() => {})
  }, [])

  function startEdit(a) {
    setEditingId(a._id)
    setEditingSlug(a.slug || null)
    setForm({
      title: a.title || '',
      excerpt: a.excerpt || '',
      content: a.content || '',
      category: a.category || 'education',
      published: Boolean(a.published),
    })
    setMsg(null)
    setMsgIsError(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingSlug(null)
    setForm(emptyForm)
    setMsg(null)
    setMsgIsError(false)
  }

  async function submit(e) {
    e.preventDefault()
    setMsg(null)
    setMsgIsError(false)
    if (stripHtml(form.content).length < 10) {
      setMsgIsError(true)
      setMsg('Le contenu doit contenir au moins 10 caractères de texte.')
      return
    }
    await fetchCsrf()
    if (editingId) {
      await api.patch(`/api/admin/articles/${editingId}`, {
        title: form.title,
        excerpt: form.excerpt,
        content: form.content,
        category: form.category,
        published: form.published,
      })
      setEditingId(null)
      setEditingSlug(null)
      setForm(emptyForm)
      setMsgIsError(false)
      setMsg('Article mis à jour.')
    } else {
      await api.post('/api/admin/articles', form)
      setForm(emptyForm)
      setMsg('Article créé.')
    }
    load()
  }

  async function remove(id) {
    if (!isAdmin || !window.confirm('Supprimer cet article ?')) return
    await fetchCsrf()
    await api.delete(`/api/admin/articles/${id}`)
    if (editingId === id) cancelEdit()
    load()
  }

  return (
    <>
      <h1 className="h3 mb-3">Articles (espace éducatif)</h1>
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h5">{editingId ? 'Modifier l’article' : 'Nouvel article'}</h2>
          {editingSlug && (
            <p className="small text-muted mb-2">
              URL publique (inchangée) : <code>/article/{editingSlug}</code>
            </p>
          )}
          <form onSubmit={submit} className="row g-2">
            <div className="col-md-6">
              <label className="form-label" htmlFor="t">
                Titre
              </label>
              <input id="t" className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label" htmlFor="c">
                Catégorie
              </label>
              <input id="c" className="form-control" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="ex">
                Chapô
              </label>
              <input id="ex" className="form-control" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="co">
                Contenu
              </label>
              <RichTextEditor
                key={editingId || 'new-article'}
                id="co"
                value={form.content}
                onChange={(html) => setForm({ ...form, content: html })}
                placeholder="Texte, images (bouton image), vidéos en ligne (bouton YouTube), ou fichier audio/vidéo…"
              />
              <p className="form-text small text-muted mb-0">
                Utilisez la barre d’outils : lien, image (envoi vers le serveur), YouTube, ou Média pour un fichier audio ou vidéo.
              </p>
            </div>
            <div className="col-12 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="pub"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="pub">
                Publié
              </label>
            </div>
            <div className="col-12 d-flex flex-wrap gap-2 align-items-center">
              <button type="submit" className="btn btn-primary btn-sm">
                {editingId ? 'Enregistrer les modifications' : 'Enregistrer'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={cancelEdit}>
                  Annuler
                </button>
              )}
              {msg && (
                <span className={`small ${msgIsError ? 'text-danger' : 'text-success'}`}>{msg}</span>
              )}
            </div>
          </form>
        </div>
      </div>
      <ul className="list-group">
        {items.map((a) => (
          <li key={a._id} className="list-group-item d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <strong>{a.title}</strong>
              <span className="small text-muted ms-2">{a.published ? 'Publié' : 'Brouillon'}</span>
            </div>
            <div className="d-flex gap-1 flex-shrink-0">
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => startEdit(a)}>
                Modifier
              </button>
              {isAdmin && (
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(a._id)}>
                  Supprimer
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
