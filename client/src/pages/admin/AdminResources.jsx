import { useEffect, useState } from 'react'
import { api, fetchCsrf } from '../../api/client'
import { useAuth } from '../../context/AuthContext'

export function AdminResources() {
  const { isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const load = () => api.get('/api/admin/resources').then((r) => setItems(r.data.items || []))

  useEffect(() => {
    load().catch(() => {})
  }, [])

  async function upload(e) {
    e.preventDefault()
    if (!file) return
    await fetchCsrf()
    const fd = new FormData()
    fd.append('file', file)
    fd.append('title', title)
    fd.append('description', description)
    await api.post('/api/admin/resources/upload', fd)
    setFile(null)
    setTitle('')
    setDescription('')
    load()
  }

  async function remove(id) {
    if (!isAdmin || !window.confirm('Supprimer cette ressource ?')) return
    await fetchCsrf()
    await api.delete(`/api/admin/resources/${id}`)
    load()
  }

  return (
    <>
      <h1 className="h3 mb-3">Ressources</h1>
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h5">Téléverser</h2>
          <form onSubmit={upload} className="row g-2">
            <div className="col-md-6">
              <label className="form-label">Titre</label>
              <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Fichier</label>
              <input type="file" className="form-control" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <input className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary btn-sm">
                Envoyer
              </button>
            </div>
          </form>
        </div>
      </div>
      <ul className="list-group">
        {items.map((r) => (
          <li key={r._id} className="list-group-item d-flex justify-content-between align-items-center">
            <a href={r.fileUrl} target="_blank" rel="noreferrer">
              {r.title}
            </a>
            {isAdmin && (
              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(r._id)}>
                Supprimer
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
