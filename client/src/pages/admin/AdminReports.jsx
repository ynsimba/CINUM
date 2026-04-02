import { useEffect, useState } from 'react'
import { api, fetchCsrf } from '../../api/client'

const STATUSES = [
  { value: 'pending', label: 'En attente' },
  { value: 'reviewed', label: 'Examiné' },
  { value: 'forwarded_arptc', label: 'Transmis ARPTC' },
  { value: 'closed', label: 'Clos' },
]

export function AdminReports() {
  const [items, setItems] = useState([])

  const load = () => api.get('/api/admin/reports').then((r) => setItems(r.data.items || []))

  useEffect(() => {
    load().catch(() => {})
  }, [])

  async function update(id, patch) {
    await fetchCsrf()
    await api.patch(`/api/admin/reports/${id}`, patch)
    load()
  }

  return (
    <>
      <h1 className="h3 mb-3">Signalements</h1>
      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>Date</th>
              <th>Réf.</th>
              <th>Type</th>
              <th>Description</th>
              <th>Email</th>
              <th>Tél.</th>
              <th>Statut</th>
              <th>Note interne</th>
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r._id}>
                <td className="small text-nowrap">{r.createdAt && new Date(r.createdAt).toLocaleString('fr-CD')}</td>
                <td className="small font-monospace text-nowrap">{r.reference || '—'}</td>
                <td className="small">{r.abuseType}</td>
                <td style={{ maxWidth: 220 }}>
                  <span className="small d-block text-break">{r.description}</span>
                  {r.attachments?.length > 0 && (
                    <span className="small text-muted">{r.attachments.length} fichier(s)</span>
                  )}
                </td>
                <td className="small text-break">{r.contactEmail || '—'}</td>
                <td className="small text-nowrap">{r.contactPhone || '—'}</td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={r.status}
                    onChange={(e) => update(r._id, { status: e.target.value })}
                  >
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ minWidth: 200 }}>
                  <textarea
                    className="form-control form-control-sm"
                    rows={2}
                    defaultValue={r.internalNote}
                    onBlur={(e) => {
                      if (e.target.value !== (r.internalNote || '')) update(r._id, { internalNote: e.target.value })
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
