import { useEffect, useState } from 'react'
import { api, fetchCsrf } from '../../api/client'
import { useAuth } from '../../context/AuthContext'

export function AdminNews() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    alert: false,
    campaign: false,
    published: true,
  })

  const load = () => api.get('/api/admin/news').then((r) => setItems(r.data.items || []))

  useEffect(() => {
    load().catch(() => {})
  }, [])

  async function create(e) {
    e.preventDefault()
    await fetchCsrf()
    await api.post('/api/admin/news', form)
    setForm({ title: '', excerpt: '', content: '', alert: false, campaign: false, published: true })
    load()
  }

  async function remove(id) {
    if (!isAdmin || !window.confirm('Supprimer cette actualité ?')) return
    await fetchCsrf()
    await api.delete(`/api/admin/news/${id}`)
    load()
  }

  return (
    <>
      <h1 className="h3 mb-3">Actualités</h1>
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h5">Nouvelle publication</h2>
          <form onSubmit={create} className="row g-2">
            <div className="col-12">
              <label className="form-label">Titre</label>
              <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="col-12">
              <label className="form-label">Chapô</label>
              <input className="form-control" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            </div>
            <div className="col-12">
              <label className="form-label">Contenu</label>
              <textarea className="form-control" rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
            </div>
            <div className="col-12 form-check">
              <input type="checkbox" className="form-check-input" id="al" checked={form.alert} onChange={(e) => setForm({ ...form, alert: e.target.checked })} />
              <label className="form-check-label" htmlFor="al">
                Alerte
              </label>
            </div>
            <div className="col-12 form-check">
              <input type="checkbox" className="form-check-input" id="ca" checked={form.campaign} onChange={(e) => setForm({ ...form, campaign: e.target.checked })} />
              <label className="form-check-label" htmlFor="ca">
                Campagne
              </label>
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary btn-sm">
                Publier
              </button>
            </div>
          </form>
        </div>
      </div>
      <ul className="list-group">
        {items.map((n) => (
          <li key={n._id} className="list-group-item d-flex justify-content-between align-items-start">
            <div>
              <strong>{n.title}</strong>
            </div>
            {isAdmin && (
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(n._id)}>
                Supprimer
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
