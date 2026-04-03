import { useEffect, useState } from 'react'
import { api } from '../../api/client'
import { useAdminRefreshTick } from '../../context/AdminRefreshContext'

function extractErrorMessage(err) {
  const status = err?.response?.status
  const d = err?.response?.data
  if (d && typeof d === 'object' && typeof d.error === 'string') return d.error
  if (status === 403) {
    return [
      '403 : souvent le proxy pointe vers le mauvais port.',
      'Sur macOS, le port 5000 est souvent utilisé par AirPlay (pas Node) → mettez PORT=5001 dans server/.env et VITE_DEV_API_TARGET=http://127.0.0.1:5001 dans client/.env, puis redémarrez API et Vite.',
      ' Sinon : droits insuffisants (JWT) ou jeton CSRF — lisez le message JSON de l’API dans l’onglet Réseau.',
    ].join(' ')
  }
  if (err?.code === 'ECONNABORTED') {
    return 'Délai dépassé (30 s). L’API ou PostgreSQL ne répond pas — vérifiez que `npm run dev:server` tourne et que la base est joignable (DATABASE_URL).'
  }
  if (err?.message === 'Network Error') {
    return 'Impossible de joindre l’API. Vérifiez le proxy Vite : `VITE_DEV_API_TARGET` doit correspondre au PORT du serveur (ex. http://127.0.0.1:5001).'
  }
  return err?.message || 'Impossible de charger les statistiques.'
}

export function AdminDashboard() {
  const refreshTick = useAdminRefreshTick()
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    let cancelled = false

    api
      .get('/api/admin/dashboard')
      .then((r) => {
        const payload = r?.data
        if (payload == null || typeof payload !== 'object' || typeof payload.counts !== 'object') {
          throw new Error('Réponse API invalide : statistiques manquantes.')
        }
        if (!cancelled) {
          setData(payload)
          setErr(null)
        }
      })
      .catch((e) => {
        if (!cancelled) setErr(extractErrorMessage(e))
      })

    return () => {
      cancelled = true
    }
  }, [refreshTick])

  if (err && !data) {
    return (
      <div className="alert alert-danger" role="alert">
        <strong>Tableau de bord</strong> — {err}
      </div>
    )
  }
  if (!data) {
    return (
      <div className="d-flex align-items-center gap-2">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement…</span>
        </div>
        <span className="text-muted small">Chargement des statistiques…</span>
      </div>
    )
  }

  return (
    <>
      <h1 className="h3 mb-4">Tableau de bord</h1>
      <div className="row g-3 mb-1">
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="small text-muted mb-1">Signalements (total)</p>
              <p className="display-6 fw-bold text-primary mb-0">{data.counts.reportsTotal ?? 0}</p>
              <p className="small mb-0 text-warning">En attente : {data.counts.reportsPending ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="small text-muted mb-1">Messages contact</p>
              <p className="display-6 fw-bold text-primary mb-0">{data.counts.contactMessages ?? 0}</p>
              <p className="small mb-0 text-muted">30 jours : {data.trends30d?.contacts ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="small text-muted mb-1">Newsletter</p>
              <p className="display-6 fw-bold text-primary mb-0">{data.counts.newsletterSubscriptions ?? 0}</p>
              <p className="small mb-0 text-muted">30 jours : {data.trends30d?.newsletter ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="small text-muted mb-1">Contenus publiés</p>
              <p className="display-6 fw-bold text-success mb-0">
                {(data.publishing?.articles?.published ?? 0) + (data.publishing?.news?.published ?? 0)}
              </p>
              <p className="small mb-0 text-muted">
                Brouillons : {(data.publishing?.articles?.draft ?? 0) + (data.publishing?.news?.draft ?? 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mt-2">
        <div className="col-12 col-xl-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h2 className="h6 mb-3">Volume des contenus</h2>
              <div className="d-flex justify-content-between border rounded-3 p-2 mb-2">
                <span>Articles</span>
                <strong>{data.counts.articles ?? 0}</strong>
              </div>
              <div className="d-flex justify-content-between border rounded-3 p-2 mb-2">
                <span>Actualités</span>
                <strong>{data.counts.news ?? 0}</strong>
              </div>
              <div className="d-flex justify-content-between border rounded-3 p-2 mb-2">
                <span>Ressources</span>
                <strong>{data.counts.resources ?? 0}</strong>
              </div>
              <div className="d-flex justify-content-between border rounded-3 p-2">
                <span>Références légales</span>
                <strong>{data.counts.laws ?? 0}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h2 className="h6 mb-3">Signalements par statut</h2>
              {[
                ['En attente', 'pending', 'bg-warning'],
                ['Analysés', 'reviewed', 'bg-info'],
                ['Transmis ARPTC', 'forwarded_arptc', 'bg-primary'],
                ['Clôturés', 'closed', 'bg-success'],
              ].map(([label, key, bar]) => {
                const value = data.reportsByStatus?.[key] ?? 0
                const total = data.counts.reportsTotal || 1
                const pct = Math.round((value / total) * 100)
                return (
                  <div className="mb-3" key={key}>
                    <div className="d-flex justify-content-between small mb-1">
                      <span>{label}</span>
                      <span>
                        {value} ({pct}%)
                      </span>
                    </div>
                    <div className="progress" style={{ height: 8 }}>
                      <div className={`progress-bar ${bar}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mt-2">
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h2 className="h6 mb-3">Activité des 30 derniers jours</h2>
              <div className="d-flex justify-content-between border rounded-3 p-2 mb-2">
                <span>Nouveaux signalements</span>
                <strong>{data.trends30d?.reports ?? 0}</strong>
              </div>
              <div className="d-flex justify-content-between border rounded-3 p-2 mb-2">
                <span>Nouveaux messages contact</span>
                <strong>{data.trends30d?.contacts ?? 0}</strong>
              </div>
              <div className="d-flex justify-content-between border rounded-3 p-2 mb-2">
                <span>Nouveaux abonnements newsletter</span>
                <strong>{data.trends30d?.newsletter ?? 0}</strong>
              </div>
              <div className="d-flex justify-content-between border rounded-3 p-2 mb-2">
                <span>Articles créés</span>
                <strong>{data.trends30d?.articles ?? 0}</strong>
              </div>
              <div className="d-flex justify-content-between border rounded-3 p-2">
                <span>Actualités créées</span>
                <strong>{data.trends30d?.news ?? 0}</strong>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h2 className="h6 mb-3">Activité récente</h2>
              <ul className="list-group list-group-flush">
                {(data.recentActivity || []).map((item) => (
                  <li key={item.id} className="list-group-item px-0 py-2">
                    <div className="d-flex justify-content-between align-items-start gap-2">
                      <div>
                        <div className="fw-semibold">{item.label}</div>
                        <div className="small text-muted">
                          {item.type}
                          {item.meta ? ` · ${item.meta}` : ''}
                        </div>
                      </div>
                      <div className="small text-muted text-nowrap">
                        {new Date(item.at).toLocaleString('fr-FR')}
                      </div>
                    </div>
                  </li>
                ))}
                {!data.recentActivity?.length ? (
                  <li className="list-group-item px-0 py-2 text-muted small">Aucune activité récente.</li>
                ) : null}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
