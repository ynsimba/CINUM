import { useEffect, useState } from 'react'
import { api, fetchCsrf } from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import { useAdminRefreshTick } from '../../context/AdminRefreshContext'
import { confirmDangerAction, DEFAULT_PAGE_SIZE, downloadCsv, paginateRows } from '../../utils/adminTable'

export function AdminLaws() {
  const refreshTick = useAdminRefreshTick()
  const { isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    title: '',
    reference: '',
    summary: '',
    fullTextUrl: '',
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)

  const load = () => api.get('/api/admin/laws').then((r) => setItems(r.data.items || []))

  useEffect(() => {
    load().catch(() => {})
  }, [])

  useEffect(() => {
    load().catch(() => {})
  }, [refreshTick])

  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  const filtered = items.filter((lw) => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    const blob = `${lw.title || ''} ${lw.reference || ''} ${lw.summary || ''}`.toLowerCase()
    return q.split(/\s+/).every((t) => blob.includes(t))
  })
  const pager = paginateRows(filtered, page, DEFAULT_PAGE_SIZE)

  async function create(e) {
    e.preventDefault()
    if (!isAdmin) return
    await fetchCsrf()
    await api.post('/api/admin/laws', form)
    setForm({ title: '', reference: '', summary: '', fullTextUrl: '' })
    load()
  }

  async function remove(id) {
    if (!isAdmin || !confirmDangerAction('cette référence légale')) return
    await fetchCsrf()
    await api.delete(`/api/admin/laws/${id}`)
    load()
  }

  function exportCsv() {
    downloadCsv(
      `references-legales-${new Date().toISOString().slice(0, 10)}.csv`,
      filtered.map((lw) => ({
        id: lw._id,
        title: lw.title || '',
        reference: lw.reference || '',
        summary: lw.summary || '',
        fullTextUrl: lw.fullTextUrl || '',
      }))
    )
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
      <div className="row g-2 align-items-end mb-3">
        <div className="col-12 col-lg-8">
          <label className="form-label small mb-1">Recherche</label>
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder="Titre, référence, résumé…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-12 col-lg-4 d-grid">
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={exportCsv}>
            Export CSV
          </button>
        </div>
      </div>
      <p className="small text-muted mb-2">
        {pager.total} résultat{pager.total > 1 ? 's' : ''} · page {pager.page}/{pager.totalPages}
      </p>
      <ul className="list-group">
        {pager.items.map((lw) => (
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
      {pager.totalPages > 1 && (
        <div className="d-flex flex-wrap gap-2 align-items-center mt-3">
          <button type="button" className="btn btn-sm btn-outline-secondary" disabled={pager.page <= 1} onClick={() => setPage((p) => p - 1)}>
            Précédent
          </button>
          <span className="small text-muted">
            Page {pager.page} / {pager.totalPages}
          </span>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            disabled={pager.page >= pager.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </button>
        </div>
      )}
    </>
  )
}
