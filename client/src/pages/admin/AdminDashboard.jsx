import { useEffect, useState } from 'react'
import { api } from '../../api/client'

export function AdminDashboard() {
  const [data, setData] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    api
      .get('/api/admin/dashboard')
      .then((r) => setData(r.data.counts))
      .catch(() => setErr('Impossible de charger les statistiques.'))
  }, [])

  if (err) return <p className="text-danger">{err}</p>
  if (!data) {
    return (
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Chargement…</span>
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
      </div>
    </>
  )
}
