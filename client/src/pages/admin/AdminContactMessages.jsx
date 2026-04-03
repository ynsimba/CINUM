import { useEffect, useMemo, useState } from 'react'
import { api, fetchCsrf } from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import { useAdminRefreshTick } from '../../context/AdminRefreshContext'

const SORT_OPTIONS = [
  { value: 'created_desc', label: 'Date (récent d’abord)' },
  { value: 'created_asc', label: 'Date (plus ancien)' },
  { value: 'name_asc', label: 'Nom (A → Z)' },
  { value: 'subject_asc', label: 'Sujet (A → Z)' },
  { value: 'email_asc', label: 'Courriel (A → Z)' },
]

function matchesSearch(row, query) {
  const raw = query.trim().toLowerCase()
  if (!raw) return true
  const tokens = raw.split(/\s+/).filter(Boolean)
  const blob = [
    row.name,
    row.email,
    row.subject,
    typeof row.message === 'string' ? row.message : '',
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return tokens.every((t) => blob.includes(t))
}

function sortRows(rows, sortKey) {
  const copy = [...rows]
  switch (sortKey) {
    case 'created_desc':
      return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case 'created_asc':
      return copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    case 'name_asc':
      return copy.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'fr'))
    case 'subject_asc':
      return copy.sort((a, b) => String(a.subject || '').localeCompare(String(b.subject || ''), 'fr'))
    case 'email_asc':
      return copy.sort((a, b) => String(a.email || '').localeCompare(String(b.email || ''), 'fr'))
    default:
      return copy
  }
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
  } catch {
    return String(iso)
  }
}

export function AdminContactMessages() {
  const refreshTick = useAdminRefreshTick()
  const { isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [err, setErr] = useState(null)
  const [detail, setDetail] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState('created_desc')

  const load = () =>
    api
      .get('/api/admin/contact-messages')
      .then((r) => setItems(r.data.items || []))
      .catch(() => setErr('Impossible de charger les messages.'))

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    load()
  }, [refreshTick])

  const filteredItems = useMemo(() => {
    const list = items.filter((row) => matchesSearch(row, searchQuery))
    return sortRows(list, sortKey)
  }, [items, searchQuery, sortKey])

  async function remove(id) {
    if (!isAdmin || !window.confirm('Supprimer définitivement ce message ?')) return
    await fetchCsrf()
    await api.delete(`/api/admin/contact-messages/${id}`)
    if (detail?._id === id) setDetail(null)
    load()
  }

  if (err) return <p className="text-danger">{err}</p>

  return (
    <>
      <h1 className="h3 mb-3">Messages contact</h1>
      <p className="text-muted small mb-4">
        Messages envoyés depuis le formulaire public <strong>/contact</strong>, enregistrés en base PostgreSQL.
      </p>
      {items.length === 0 ? (
        <p className="text-muted">Aucun message pour le moment.</p>
      ) : (
        <>
          <p className="small text-muted mb-2">Cliquez sur une ligne pour lire le message complet.</p>
          <div className="row g-2 align-items-end mb-3">
            <div className="col-12 col-md-7 col-lg-6">
              <label className="form-label small mb-1" htmlFor="admin-contact-search">
                Recherche
              </label>
              <input
                id="admin-contact-search"
                type="search"
                className="form-control form-control-sm"
                placeholder="Nom, courriel, sujet, contenu du message…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div className="col-12 col-md-5 col-lg-4">
              <label className="form-label small mb-1" htmlFor="admin-contact-sort">
                Tri
              </label>
              <select
                id="admin-contact-sort"
                className="form-select form-select-sm"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <p className="small text-muted mb-2">
            {filteredItems.length === items.length
              ? `${items.length} message${items.length !== 1 ? 's' : ''}`
              : `${filteredItems.length} affiché${filteredItems.length !== 1 ? 's' : ''} sur ${items.length}`}
          </p>
          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead>
                <tr>
                  <th scope="col">Date</th>
                  <th scope="col">Nom</th>
                  <th scope="col">Courriel</th>
                  <th scope="col">Sujet</th>
                  {isAdmin && <th scope="col" className="text-end">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan={isAdmin ? 5 : 4} className="text-center text-muted small py-4">
                      Aucun résultat pour cette recherche.
                    </td>
                  </tr>
                )}
                {filteredItems.map((row) => (
                  <tr
                    key={row._id}
                    role="button"
                    tabIndex={0}
                    className="cinum-report-row"
                    onClick={() => setDetail(row)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setDetail(row)
                      }
                    }}
                  >
                    <td className="text-nowrap small">{formatDate(row.createdAt)}</td>
                    <td>{row.name}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <a href={`mailto:${encodeURIComponent(row.email)}`}>{row.email}</a>
                    </td>
                    <td>{row.subject}</td>
                    {isAdmin && (
                      <td className="text-end text-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(row._id)}>
                          Supprimer
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {detail && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-msg-detail-title"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setDetail(null)
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h2 id="contact-msg-detail-title" className="modal-title h5 mb-0">
                  {detail.subject || 'Message contact'}
                </h2>
                <button type="button" className="btn-close" aria-label="Fermer" onClick={() => setDetail(null)} />
              </div>
              <div className="modal-body">
                <dl className="row small mb-3">
                  <dt className="col-sm-3">Date</dt>
                  <dd className="col-sm-9">{formatDate(detail.createdAt)}</dd>
                  <dt className="col-sm-3">Nom</dt>
                  <dd className="col-sm-9">{detail.name}</dd>
                  <dt className="col-sm-3">Courriel</dt>
                  <dd className="col-sm-9 text-break">
                    <a href={`mailto:${encodeURIComponent(detail.email)}`}>{detail.email}</a>
                  </dd>
                  <dt className="col-sm-3">Sujet</dt>
                  <dd className="col-sm-9">{detail.subject}</dd>
                </dl>
                <h3 className="h6 border-bottom pb-2 mb-2">Message</h3>
                <p className="mb-0 text-break" style={{ whiteSpace: 'pre-wrap' }}>
                  {detail.message}
                </p>
              </div>
              <div className="modal-footer">
                {isAdmin && (
                  <button
                    type="button"
                    className="btn btn-outline-danger me-auto"
                    onClick={() => remove(detail._id)}
                  >
                    Supprimer ce message
                  </button>
                )}
                <button type="button" className="btn btn-primary" onClick={() => setDetail(null)}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
