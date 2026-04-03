import { useEffect, useMemo, useState } from 'react'
import { api, fetchCsrf } from '../../api/client'
import { useAuth } from '../../context/AuthContext'
import { useAdminRefreshTick } from '../../context/AdminRefreshContext'

function attachmentHref(path) {
  if (!path) return '#'
  return `/uploads/${encodeURIComponent(path)}`
}

const STATUSES = [
  { value: 'pending', label: 'En attente' },
  { value: 'reviewed', label: 'Examiné' },
  { value: 'forwarded_arptc', label: 'Transmis ARPTC' },
  { value: 'closed', label: 'Clos' },
]

const STATUS_ORDER_MAP = Object.fromEntries(STATUSES.map((s, i) => [s.value, i]))

const SORT_OPTIONS = [
  { value: 'created_desc', label: 'Date de dépôt (récent d’abord)' },
  { value: 'created_asc', label: 'Date de dépôt (plus ancien)' },
  { value: 'updated_desc', label: 'Dernière mise à jour (récent)' },
  { value: 'updated_asc', label: 'Dernière mise à jour (ancien)' },
  { value: 'reference_asc', label: 'Référence (A → Z)' },
  { value: 'plaignant_asc', label: 'Plaignant (A → Z)' },
  { value: 'status', label: 'Statut (ordre du workflow)' },
]

const ABUSE_LABELS = {
  cyberharcelement: 'Cyberharcèlement',
  desinformation: 'Désinformation',
  fraude: 'Fraude numérique',
  usurpation: 'Usurpation d’identité',
  autre: 'Autre',
}

const IDENTITY_TYPE_LABELS = {
  carte_electeur: 'Carte d’électeur',
  passeport: 'Passeport',
  permis_conduire: 'Permis de conduire',
}

function plaignantSummary(r) {
  const nom = [r.lastName, r.postName, r.firstName].filter(Boolean).join(' ').trim()
  if (nom) return nom
  return '—'
}

function matchesSearch(r, query, abuseLabels) {
  const raw = query.trim().toLowerCase()
  if (!raw) return true
  const tokens = raw.split(/\s+/).filter(Boolean)
  const blob = [
    r.reference,
    plaignantSummary(r),
    r.contactEmail,
    r.contactPhone,
    r.abuseType,
    abuseLabels[r.abuseType] || '',
    typeof r.description === 'string' ? r.description : '',
    typeof r.internalNote === 'string' ? r.internalNote : '',
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
  return tokens.every((t) => blob.includes(t))
}

function sortReports(rows, sortKey, statusOrderMap) {
  const copy = [...rows]
  switch (sortKey) {
    case 'created_desc':
      return copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    case 'created_asc':
      return copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    case 'updated_desc':
      return copy.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    case 'updated_asc':
      return copy.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
    case 'reference_asc':
      return copy.sort((a, b) => String(a.reference || '').localeCompare(String(b.reference || ''), 'fr'))
    case 'plaignant_asc':
      return copy.sort((a, b) => plaignantSummary(a).localeCompare(plaignantSummary(b), 'fr'))
    case 'status':
      return copy.sort((a, b) => {
        const da = statusOrderMap[a.status] ?? 99
        const db = statusOrderMap[b.status] ?? 99
        if (da !== db) return da - db
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
    default:
      return copy
  }
}

function formatBirthDate(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('fr-CD')
}

function isoToDatetimeLocal(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function FileLinks({ href, saveName, label }) {
  return (
    <li className="mb-1">
      <span className="d-block small text-muted">{label}</span>
      <span className="d-inline-flex flex-wrap gap-1">
        <a href={href} target="_blank" rel="noopener noreferrer">
          Ouvrir
        </a>
        <span className="text-muted">·</span>
        <a href={href} download={saveName}>
          Télécharger
        </a>
      </span>
    </li>
  )
}

export function AdminReports() {
  const refreshTick = useAdminRefreshTick()
  const { isAdmin } = useAuth()
  const [items, setItems] = useState([])
  const [detail, setDetail] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortKey, setSortKey] = useState('created_desc')
  const [statusFilter, setStatusFilter] = useState('all')

  const load = () => api.get('/api/admin/reports').then((r) => setItems(r.data.items || []))

  useEffect(() => {
    load().catch(() => {})
  }, [])

  useEffect(() => {
    load().catch(() => {})
  }, [refreshTick])

  const filteredItems = useMemo(() => {
    let list = items.filter((r) => matchesSearch(r, searchQuery, ABUSE_LABELS))
    if (statusFilter !== 'all') list = list.filter((r) => r.status === statusFilter)
    return sortReports(list, sortKey, STATUS_ORDER_MAP)
  }, [items, searchQuery, sortKey, statusFilter])

  const [apptDraft, setApptDraft] = useState({ date: '', note: '' })

  async function update(id, patch) {
    await fetchCsrf()
    const { data } = await api.patch(`/api/admin/reports/${id}`, patch)
    load()
    setDetail((d) => (d && d._id === id ? { ...d, ...data } : d))
  }

  useEffect(() => {
    if (!detail) return
    setApptDraft({
      date: detail.appointmentAt ? isoToDatetimeLocal(detail.appointmentAt) : '',
      note: detail.appointmentNote || '',
    })
  }, [detail?._id, detail?.appointmentAt, detail?.appointmentNote])

  async function remove(id) {
    if (!isAdmin || !window.confirm('Supprimer définitivement ce signalement et ses pièces jointes ?')) return
    await fetchCsrf()
    await api.delete(`/api/admin/reports/${id}`)
    if (detail?._id === id) setDetail(null)
    load()
  }

  return (
    <>
      <h1 className="h3 mb-3">Signalements</h1>
      <p className="small text-muted mb-3">
        Cliquez sur une ligne pour ouvrir la description complète et le détail du dossier.
      </p>
      <div className="row g-2 align-items-end mb-3">
        <div className="col-12 col-lg-5">
          <label className="form-label small mb-1" htmlFor="admin-reports-search">
            Recherche
          </label>
          <input
            id="admin-reports-search"
            type="search"
            className="form-control form-control-sm"
            placeholder="Référence, plaignant, e-mail, téléphone, type, description…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <label className="form-label small mb-1" htmlFor="admin-reports-sort">
            Tri
          </label>
          <select
            id="admin-reports-sort"
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
        <div className="col-12 col-md-6 col-lg-3">
          <label className="form-label small mb-1" htmlFor="admin-reports-status-filter">
            Statut
          </label>
          <select
            id="admin-reports-status-filter"
            className="form-select form-select-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous</option>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="small text-muted mb-2">
        {filteredItems.length === items.length
          ? `${items.length} dossier${items.length !== 1 ? 's' : ''}`
          : `${filteredItems.length} affiché${filteredItems.length !== 1 ? 's' : ''} sur ${items.length}`}
      </p>
      <div className="table-responsive">
        <table className="table table-sm align-middle">
          <thead>
            <tr>
              <th>Date</th>
              <th>Réf.</th>
              <th>Plaignant</th>
              <th>Type</th>
              <th>Pièces</th>
              <th>Email</th>
              <th>Tél.</th>
              <th>Statut</th>
              {isAdmin && <th className="text-end">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 9 : 8} className="text-center text-muted small py-4">
                  {items.length === 0
                    ? 'Aucun signalement.'
                    : 'Aucun résultat pour ces critères — modifiez la recherche ou le filtre de statut.'}
                </td>
              </tr>
            )}
            {filteredItems.map((r) => (
              <tr
                key={r._id}
                role="button"
                tabIndex={0}
                className="cinum-report-row"
                onClick={() => setDetail(r)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setDetail(r)
                  }
                }}
              >
                <td className="small text-nowrap">{r.createdAt && new Date(r.createdAt).toLocaleString('fr-CD')}</td>
                <td className="small font-monospace text-nowrap">{r.reference || '—'}</td>
                <td className="small" style={{ maxWidth: 160 }}>
                  <span className="text-break">{plaignantSummary(r)}</span>
                </td>
                <td className="small">{ABUSE_LABELS[r.abuseType] || r.abuseType}</td>
                <td style={{ maxWidth: 200 }} onClick={(e) => e.stopPropagation()}>
                  {(() => {
                    const idHref = r.identityDocPath ? attachmentHref(r.identityDocPath) : null
                    const idName = r.identityDocOriginalName || r.identityDocPath || 'identite'
                    const att = Array.isArray(r.attachments) ? r.attachments : []
                    const hasAny = idHref || att.length > 0
                    if (!hasAny) return <span className="small text-muted">—</span>
                    return (
                      <ul className="list-unstyled mb-0 small">
                        {idHref && (
                          <FileLinks
                            key="id"
                            href={idHref}
                            saveName={idName}
                            label={`Pièce d’identité (${IDENTITY_TYPE_LABELS[r.identityDocType] || r.identityDocType || '?'})`}
                          />
                        )}
                        {att.map((a, i) => {
                          const href = attachmentHref(a.path)
                          const saveName = a.originalName || a.path || `piece-jointe-${i + 1}`
                          return (
                            <FileLinks
                              key={i}
                              href={href}
                              saveName={saveName}
                              label={`Pièce jointe ${i + 1}`}
                            />
                          )
                        })}
                      </ul>
                    )
                  })()}
                </td>
                <td className="small text-break">{r.contactEmail || '—'}</td>
                <td className="small text-nowrap">{r.contactPhone || '—'}</td>
                <td onClick={(e) => e.stopPropagation()}>
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
                {isAdmin && (
                  <td className="text-end text-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(r._id)}>
                      Supprimer
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {detail && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-detail-title"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setDetail(null)
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h2 id="report-detail-title" className="modal-title h5 mb-0">
                  Dossier {detail.reference}
                </h2>
                <button type="button" className="btn-close" aria-label="Fermer" onClick={() => setDetail(null)} />
              </div>
              <div className="modal-body">
                <dl className="row small mb-3">
                  <dt className="col-sm-3">Date de dépôt</dt>
                  <dd className="col-sm-9">
                    {detail.createdAt && new Date(detail.createdAt).toLocaleString('fr-CD')}
                  </dd>
                  <dt className="col-sm-3">Type signalé</dt>
                  <dd className="col-sm-9">{ABUSE_LABELS[detail.abuseType] || detail.abuseType}</dd>
                  <dt className="col-sm-3">Statut</dt>
                  <dd className="col-sm-9">{STATUSES.find((s) => s.value === detail.status)?.label || detail.status}</dd>
                </dl>
                <h3 className="h6 border-bottom pb-2 mb-2">Identité du plaignant</h3>
                <dl className="row small mb-3">
                  <dt className="col-sm-3">Nom</dt>
                  <dd className="col-sm-9 text-break">{detail.lastName || '—'}</dd>
                  <dt className="col-sm-3">Postnom</dt>
                  <dd className="col-sm-9 text-break">{detail.postName || '—'}</dd>
                  <dt className="col-sm-3">Prénom</dt>
                  <dd className="col-sm-9 text-break">{detail.firstName || '—'}</dd>
                  <dt className="col-sm-3">Lieu de naissance</dt>
                  <dd className="col-sm-9 text-break">{detail.birthPlace || '—'}</dd>
                  <dt className="col-sm-3">Date de naissance</dt>
                  <dd className="col-sm-9">{formatBirthDate(detail.birthDate)}</dd>
                  <dt className="col-sm-3">État civil</dt>
                  <dd className="col-sm-9">{detail.maritalStatus || '—'}</dd>
                  <dt className="col-sm-3">Adresse</dt>
                  <dd className="col-sm-9 text-break" style={{ whiteSpace: 'pre-wrap' }}>
                    {detail.address || '—'}
                  </dd>
                  <dt className="col-sm-3">Téléphone</dt>
                  <dd className="col-sm-9">{detail.contactPhone || '—'}</dd>
                  <dt className="col-sm-3">E-mail</dt>
                  <dd className="col-sm-9 text-break">{detail.contactEmail || '—'}</dd>
                  <dt className="col-sm-3">Type de pièce</dt>
                  <dd className="col-sm-9">
                    {detail.identityDocType
                      ? IDENTITY_TYPE_LABELS[detail.identityDocType] || detail.identityDocType
                      : '—'}
                  </dd>
                </dl>
                {detail.identityDocPath ? (
                  <>
                    <h3 className="h6 border-bottom pb-2 mb-2">Copie de la pièce d’identité</h3>
                    <ul className="list-unstyled mb-0 small">
                      <FileLinks
                        href={attachmentHref(detail.identityDocPath)}
                        saveName={detail.identityDocOriginalName || detail.identityDocPath || 'identite'}
                        label="Document téléversé"
                      />
                    </ul>
                  </>
                ) : (
                  <p className="small text-muted mb-3">Aucune copie d’identité enregistrée (dossier antérieur au formulaire actuel).</p>
                )}
                <h3 className="h6 border-bottom pb-2 mb-2 mt-4">Description</h3>
                <p className="mb-0 text-break" style={{ whiteSpace: 'pre-wrap' }}>
                  {detail.description}
                </p>
                {Array.isArray(detail.attachments) && detail.attachments.length > 0 && (
                  <>
                    <h3 className="h6 border-bottom pb-2 mb-2 mt-4">Autres pièces jointes</h3>
                    <ul className="list-unstyled mb-0 small">
                      {detail.attachments.map((a, i) => {
                        const href = attachmentHref(a.path)
                        const saveName = a.originalName || a.path || `piece-jointe-${i + 1}`
                        return (
                          <FileLinks
                            key={i}
                            href={href}
                            saveName={saveName}
                            label={`Pièce jointe ${i + 1}`}
                          />
                        )
                      })}
                    </ul>
                  </>
                )}
                <h3 className="h6 border-bottom pb-2 mb-2 mt-4">Rendez-vous avec le plaignant</h3>
                <p className="small text-muted mb-2">
                  Visible sur la page de suivi. Un e-mail est envoyé au plaignant lorsque la date est enregistrée ou
                  modifiée (pas lors d’un simple changement de précisions sans changer la date).
                </p>
                <div className="mb-2">
                  <label className="form-label small mb-1" htmlFor="report-appt-at">
                    Date et heure
                  </label>
                  <input
                    id="report-appt-at"
                    type="datetime-local"
                    className="form-control form-control-sm"
                    value={apptDraft.date}
                    onChange={(e) => setApptDraft((x) => ({ ...x, date: e.target.value }))}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label small mb-1" htmlFor="report-appt-note">
                    Précisions (lieu, consignes) — visibles par le plaignant
                  </label>
                  <textarea
                    id="report-appt-note"
                    className="form-control form-control-sm"
                    rows={2}
                    maxLength={4000}
                    placeholder="Ex. Bureau principal, 3e étage, munir d’une pièce d’identité."
                    value={apptDraft.note}
                    onChange={(e) => setApptDraft((x) => ({ ...x, note: e.target.value }))}
                  />
                </div>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  <button
                    type="button"
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      const payload = {
                        appointmentAt: apptDraft.date ? new Date(apptDraft.date).toISOString() : null,
                        appointmentNote: apptDraft.note,
                      }
                      update(detail._id, payload)
                    }}
                  >
                    Enregistrer le rendez-vous
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => {
                      setApptDraft({ date: '', note: '' })
                      update(detail._id, { appointmentAt: null, appointmentNote: '' })
                    }}
                  >
                    Effacer le rendez-vous
                  </button>
                </div>
                <h3 className="h6 border-bottom pb-2 mb-2">Note interne</h3>
                <textarea
                  key={detail._id}
                  className="form-control form-control-sm"
                  rows={3}
                  placeholder="Réservé au personnel (visible dans ce panneau uniquement)"
                  defaultValue={detail.internalNote || ''}
                  onBlur={(e) => {
                    if (e.target.value !== (detail.internalNote || '')) update(detail._id, { internalNote: e.target.value })
                  }}
                />
              </div>
              <div className="modal-footer">
                {isAdmin && (
                  <button
                    type="button"
                    className="btn btn-outline-danger me-auto"
                    onClick={() => {
                      remove(detail._id)
                    }}
                  >
                    Supprimer le dossier
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
