import { useEffect, useState } from 'react'
import { api, fetchCsrf } from '../../api/client'
import { useAuth } from '../../context/AuthContext'

export function AdminArticles() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'education',
    published: true,
  })
  const [msg, setMsg] = useState(null)

  const load = () =>
    api.get('/api/admin/articles').then((r) => setItems(r.data.items || []))

  useEffect(() => {
    load().catch(() => {})
  }, [])

  async function create(e) {
    e.preventDefault()
    setMsg(null)
    await fetchCsrf()
    await api.post('/api/admin/articles', form)
    setForm({ title: '', excerpt: '', content: '', category: 'education', published: true })
    setMsg('Article créé.')
    load()
  }

  async function remove(id) {
    if (!isAdmin || !window.confirm('Supprimer cet article ?')) return
    await fetchCsrf()
    await api.delete(`/api/admin/articles/${id}`)
    load()
  }

  return (
    <>
      <h1 className="h3 mb-3">Articles (espace éducatif)</h1>
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h5">Nouvel article</h2>
          <form onSubmit={create} className="row g-2">
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
              <textarea id="co" className="form-control" rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
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
            <div className="col-12">
              <button type="submit" className="btn btn-primary btn-sm">
                Enregistrer
              </button>
              {msg && <span className="text-success ms-2 small">{msg}</span>}
            </div>
          </form>
        </div>
      </div>
      <ul className="list-group">
        {items.map((a) => (
          <li key={a._id} className="list-group-item d-flex justify-content-between align-items-start">
            <div>
              <strong>{a.title}</strong>
              <span className="small text-muted ms-2">{a.published ? 'Publié' : 'Brouillon'}</span>
            </div>
            {isAdmin && (
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(a._id)}>
                Supprimer
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
