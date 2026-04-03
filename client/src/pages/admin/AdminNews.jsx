import { useEffect, useState } from 'react'
import { api, fetchCsrf } from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import { RichTextEditor } from '../../components/RichTextEditor'
import { stripHtml } from '../../utils/seo'

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  coverImageUrl: '',
  alert: false,
  campaign: false,
  published: true,
}

export function AdminNews() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [msg, setMsg] = useState(null)
  const [saveError, setSaveError] = useState(null)

  const load = () => api.get('/api/admin/news').then((r) => setItems(r.data.items || []))

  useEffect(() => {
    load().catch(() => {})
  }, [])

  function startEdit(n) {
    setMsg(null)
    setSaveError(null)
    setEditingId(n._id)
    setForm({
      title: n.title || '',
      excerpt: n.excerpt || '',
      content: n.content || '',
      coverImageUrl: n.coverImageUrl || '',
      alert: Boolean(n.alert),
      campaign: Boolean(n.campaign),
      published: n.published !== false,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
    setMsg(null)
    setSaveError(null)
  }

  async function submit(e) {
    e.preventDefault()
    setSaveError(null)
    if (stripHtml(form.content).length < 10) {
      setSaveError('Le contenu doit contenir au moins 10 caractères de texte.')
      return
    }
    try {
      await fetchCsrf()
      if (editingId) {
        await api.patch(`/api/admin/news/${editingId}`, {
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          coverImageUrl: form.coverImageUrl ?? '',
          alert: form.alert,
          campaign: form.campaign,
          published: form.published,
        })
        setEditingId(null)
        setForm(emptyForm)
        setMsg('Publication mise à jour.')
      } else {
        await api.post('/api/admin/news', form)
        setForm(emptyForm)
        setMsg('Publication créée.')
      }
      await load()
    } catch (err) {
      const data = err.response?.data
      const fromValidator = Array.isArray(data?.errors)
        ? data.errors.map((x) => x.msg || x.message || String(x)).join(' ')
        : ''
      const message =
        (typeof data?.error === 'string' && data.error) ||
        fromValidator ||
        err.message ||
        'Enregistrement impossible. Vérifiez la connexion et réessayez.'
      setSaveError(message)
    }
  }

  async function remove(id) {
    if (!isAdmin || !window.confirm('Supprimer cette actualité ?')) return
    await fetchCsrf()
    await api.delete(`/api/admin/news/${id}`)
    if (editingId === id) cancelEdit()
    load()
  }

  return (
    <>
      <h1 className="h3 mb-3">Actualités</h1>
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h5">{editingId ? 'Modifier la publication' : 'Nouvelle publication'}</h2>
          {editingId && (
            <p className="small text-muted mb-2">
              URL publique (inchangée) : <code>/actualites/{editingId}</code>
            </p>
          )}
          <form onSubmit={submit} className="row g-2">
            <div className="col-12">
              <label className="form-label" htmlFor="news-title">
                Titre
              </label>
              <input
                id="news-title"
                className="form-control"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="news-ex">
                Chapô
              </label>
              <input id="news-ex" className="form-control" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="news-cover">
                Image de couverture (URL)
              </label>
              <input
                id="news-cover"
                type="text"
                className="form-control"
                placeholder="https://… ou chemin relatif (/uploads/…)"
                value={form.coverImageUrl}
                onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
                autoComplete="off"
              />
              <p className="form-text small text-muted mb-0">
                Affichée en tête de carte sur l’accueil et la liste. Si vide, la première image du contenu est utilisée, sinon un fond institutionnel.
              </p>
            </div>
            <div className="col-12">
              <label className="form-label" htmlFor="news-content">
                Contenu
              </label>
              <RichTextEditor
                key={editingId || 'new-news'}
                id="news-content"
                value={form.content}
                onChange={(html) => setForm({ ...form, content: html })}
                placeholder="Texte, images, médias ou liens…"
              />
              <p className="form-text small text-muted mb-0">
                Barre d’outils : lien, image, YouTube ; bouton Média pour un fichier audio ou vidéo.
              </p>
            </div>
            <div className="col-12 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="al"
                checked={form.alert}
                onChange={(e) => setForm({ ...form, alert: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="al">
                Alerte
              </label>
            </div>
            <div className="col-12 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="ca"
                checked={form.campaign}
                onChange={(e) => setForm({ ...form, campaign: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="ca">
                Campagne
              </label>
            </div>
            <div className="col-12 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="news-pub"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              <label className="form-check-label" htmlFor="news-pub">
                Publiée (visible sur le site)
              </label>
            </div>
            {saveError && (
              <div className="col-12">
                <div className="alert alert-danger py-2 small mb-0" role="alert">
                  {saveError}
                </div>
              </div>
            )}
            <div className="col-12 d-flex flex-wrap gap-2 align-items-center">
              <button type="submit" className="btn btn-primary btn-sm">
                {editingId ? 'Enregistrer les modifications' : 'Publier'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={cancelEdit}>
                  Annuler
                </button>
              )}
              {msg && <span className="small text-success">{msg}</span>}
            </div>
          </form>
        </div>
      </div>
      <ul className="list-group">
        {items.map((n) => (
          <li key={n._id} className="list-group-item d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <strong>{n.title}</strong>
              <span className="small text-muted ms-2">{n.published ? 'Publiée' : 'Brouillon'}</span>
            </div>
            <div className="d-flex gap-1 flex-shrink-0">
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => startEdit(n)}>
                Modifier
              </button>
              {isAdmin && (
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(n._id)}>
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
