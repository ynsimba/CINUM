import { useEffect, useState } from 'react'
import { api } from '../../api/client'

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
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    let cancelled = false

    api
      .get('/api/admin/dashboard')
      .then((r) => {
        const counts = r?.data?.counts
        if (counts == null || typeof counts !== 'object') {
          throw new Error('Réponse API invalide : objet « counts » manquant.')
        }
        if (!cancelled) {
          setData(counts)
          setErr(null)
        }
      })
      .catch((e) => {
        if (!cancelled) setErr(extractErrorMessage(e))
      })

    return () => {
      cancelled = true
    }
  }, [])

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
      <div className="row g-3">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="small text-muted mb-0">Articles</p>
              <p className="display-6 fw-bold text-primary mb-0">{data.articles}</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="small text-muted mb-0">Actualités</p>
              <p className="display-6 fw-bold text-primary mb-0">{data.news}</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="small text-muted mb-0">Signalements en attente</p>
              <p className="display-6 fw-bold text-warning mb-0">{data.reportsPending}</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="small text-muted mb-0">Ressources</p>
              <p className="display-6 fw-bold text-primary mb-0">{data.resources}</p>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <p className="small text-muted mb-0">Messages contact</p>
              <p className="display-6 fw-bold text-primary mb-0">{data.contactMessages ?? 0}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
