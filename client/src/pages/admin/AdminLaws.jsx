import { useEffect, useState } from 'react'
import { api, fetchCsrf } from '../../api/client'
import { useAuth } from '../../context/AuthContext'

export function AdminLaws() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    title: '',
    reference: '',
    summary: '',
    fullTextUrl: '',
  })

  const load = () => api.get('/api/admin/laws').then((r) => setItems(r.data.items || []))

  useEffect(() => {
    load().catch(() => {})
  }, [])

  async function create(e) {
    e.preventDefault()
    if (!isAdmin) return
    await fetchCsrf()
    await api.post('/api/admin/laws', form)
    setForm({ title: '', reference: '', summary: '', fullTextUrl: '' })
    load()
  }

  async function remove(id) {
    if (!isAdmin || !window.confirm('Supprimer cette référence ?')) return
    await fetchCsrf()
    await api.delete(`/api/admin/laws/${id}`)
    load()
  }

  if (!isAdmin) {
    return <p className="text-muted">La gestion des références légales est réservée aux administrateurs.</p>
  }

  return (
    <>
      <h1 className="h3 mb-3">Références légales</h1>
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <form onSubmit={create} className="row g-2">
            <div className="col-md-6">
              <label className="form-label">Titre</label>
              <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Référence (ex. Loi n° …)</label>
              <input className="form-control" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} required />
            </div>
            <div className="col-12">
              <label className="form-label">Résumé pédagogique</label>
              <textarea className="form-control" rows={4} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} required />
            </div>
            <div className="col-12">
              <label className="form-label">Lien texte officiel (optionnel)</label>
              <input className="form-control" type="url" value={form.fullTextUrl} onChange={(e) => setForm({ ...form, fullTextUrl: e.target.value })} />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary btn-sm">
                Ajouter
              </button>
            </div>
          </form>
        </div>
      </div>
      <ul className="list-group">
        {items.map((lw) => (
          <li key={lw._id} className="list-group-item d-flex justify-content-between">
            <span>
              <strong>{lw.reference}</strong> — {lw.title}
            </span>
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(lw._id)}>
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
