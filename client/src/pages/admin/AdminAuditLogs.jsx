import { useEffect, useMemo, useState } from 'react'
import { api } from '../../api/client'
import { DEFAULT_PAGE_SIZE, downloadCsv, paginateRows } from '../../utils/adminTable'

function toDate(value) {
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('fr-FR')
}

export function AdminAuditLogs() {
  const [items, setItems] = useState([])
  const [err, setErr] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [methodFilter, setMethodFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [actorFilter, setActorFilter] = useState('all')
  const [periodFilter, setPeriodFilter] = useState('all')
  const [copyMsg, setCopyMsg] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    api
      .get('/api/admin/audit-logs?take=500')
      .then((r) => setItems(r.data.items || []))
      .catch(() => setErr('Impossible de charger les journaux d’audit.'))
  }, [])

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    const now = Date.now()
    return items.filter((row) => {
      if (methodFilter !== 'all' && row.method !== methodFilter) return false
      if (statusFilter !== 'all' && String(row.statusCode || '') !== statusFilter) return false
      if (actorFilter === 'with_actor' && !row?.actor?.email) return false
      if (actorFilter === 'without_actor' && row?.actor?.email) return false
      if (periodFilter !== 'all') {
        const ts = new Date(row.createdAt).getTime()
        const maxAgeHours =
          periodFilter === '24h' ? 24 : periodFilter === '7d' ? 24 * 7 : periodFilter === '30d' ? 24 * 30 : null
        if (maxAgeHours != null && (!Number.isFinite(ts) || now - ts > maxAgeHours * 3600 * 1000)) return false
      }
      if (!q) return true
      const blob = `${row.method || ''} ${row.path || ''} ${row.action || ''} ${row.entityType || ''} ${
        row.entityId || ''
      } ${row?.actor?.email || ''} ${row?.actor?.name || ''}`.toLowerCase()
      return q.split(/\s+/).every((t) => blob.includes(t))
    })
  }, [items, searchQuery, methodFilter, statusFilter, actorFilter, periodFilter])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, methodFilter, statusFilter, actorFilter, periodFilter])

  const pager = paginateRows(filtered, page, DEFAULT_PAGE_SIZE)

  function exportCsv() {
    downloadCsv(
      `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`,
      filtered.map((r) => ({
        id: r.id,
        createdAt: r.createdAt || '',
        actorEmail: r?.actor?.email || '',
        actorName: r?.actor?.name || '',
        method: r.method || '',
        path: r.path || '',
        action: r.action || '',
        entityType: r.entityType || '',
        entityId: r.entityId || '',
        statusCode: r.statusCode ?? '',
      }))
    )
  }

  async function copySupportQuery() {
    const query = [
      `search=${searchQuery || ''}`,
      `method=${methodFilter}`,
      `status=${statusFilter}`,
      `actor=${actorFilter}`,
      `period=${periodFilter}`,
      `total=${filtered.length}`,
    ].join(' | ')
    try {
      await navigator.clipboard.writeText(query)
      setCopyMsg('Requête support copiée.')
    } catch {
      setCopyMsg("Impossible de copier automatiquement. Copiez manuellement les filtres affichés.")
    }
    window.setTimeout(() => setCopyMsg(''), 2200)
  }

  if (err) return <p className="text-danger">{err}</p>

  return (
    <>
      <h1 className="h3 mb-3">Audit logs</h1>
      <div className="row g-2 align-items-end mb-3">
        <div className="col-12 col-lg-4">
          <label className="form-label small mb-1">Recherche</label>
          <input
            type="search"
            className="form-control form-control-sm"
            placeholder="acteur, route, action, entité…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="col-6 col-md-3 col-lg-2">
          <label className="form-label small mb-1">Méthode</label>
          <select className="form-select form-select-sm" value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}>
            <option value="all">Toutes</option>
            <option value="POST">POST</option>
            <option value="PATCH">PATCH</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>
        <div className="col-6 col-md-3 col-lg-2">
          <label className="form-label small mb-1">Statut HTTP</label>
          <select className="form-select form-select-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Tous</option>
            <option value="200">200</option>
            <option value="201">201</option>
            <option value="204">204</option>
            <option value="400">400</option>
            <option value="401">401</option>
            <option value="403">403</option>
            <option value="404">404</option>
            <option value="429">429</option>
          </select>
        </div>
        <div className="col-6 col-md-3 col-lg-2">
          <label className="form-label small mb-1">Acteur</label>
          <select className="form-select form-select-sm" value={actorFilter} onChange={(e) => setActorFilter(e.target.value)}>
            <option value="all">Tous</option>
            <option value="with_actor">Avec acteur</option>
            <option value="without_actor">Sans acteur</option>
          </select>
        </div>
        <div className="col-6 col-md-3 col-lg-2">
          <label className="form-label small mb-1">Période</label>
          <select className="form-select form-select-sm" value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)}>
            <option value="all">Tout</option>
            <option value="24h">24h</option>
            <option value="7d">7 jours</option>
            <option value="30d">30 jours</option>
          </select>
        </div>
        <div className="col-12 col-lg-2 d-grid">
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={exportCsv}>
            Export CSV
          </button>
        </div>
        <div className="col-12 col-lg-2 d-grid">
          <button type="button" className="btn btn-outline-primary btn-sm" onClick={copySupportQuery}>
            Copier requête support
          </button>
        </div>
      </div>
      {copyMsg ? <p className="small text-success mb-2">{copyMsg}</p> : null}

      <p className="small text-muted mb-2">
        {pager.total} événement{pager.total > 1 ? 's' : ''} · page {pager.page}/{pager.totalPages}
      </p>

      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>Date</th>
              <th>Acteur</th>
              <th>Méthode</th>
              <th>Route</th>
              <th>Action</th>
              <th>Entité</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {pager.items.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-muted small py-4">
                  Aucun log d’audit.
                </td>
              </tr>
            )}
            {pager.items.map((r) => (
              <tr key={r.id}>
                <td className="small text-nowrap">{toDate(r.createdAt)}</td>
                <td className="small text-break">{r?.actor?.email || '—'}</td>
                <td className="small">{r.method}</td>
                <td className="small text-break">{r.path}</td>
                <td className="small">{r.action}</td>
                <td className="small text-break">
                  {r.entityType}
                  {r.entityId ? ` (${r.entityId})` : ''}
                </td>
                <td className="small">{r.statusCode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
