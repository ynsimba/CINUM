import { Seo } from '../components/Seo'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { api } from '../api/client'

export function NewsList() {
  const [items, setItems] = useState([])

  useEffect(() => {
    api
      .get('/api/public/news')
      .then((r) => setItems(r.data.items || []))
      .catch(() => setItems([]))
  }, [])

  return (
    <>
      <Seo
        title="Actualités — Civisme numérique RDC"
        description="Publications officielles, alertes numériques et campagnes de sensibilisation du portail civisme numérique en République démocratique du Congo."
      />
      <PageHeader
        title="Actualités"
        lead="Publications officielles, alertes numériques et campagnes de sensibilisation."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <div className="row g-3">
          {items.length === 0 && <p className="text-muted">Aucune actualité pour le moment.</p>}
          {items.map((n) => (
            <div key={n._id} className="col-md-6">
              <article className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <div className="mb-2">
                    {n.alert && <span className="badge bg-danger me-1">Alerte</span>}
                    {n.campaign && <span className="badge bg-warning text-dark">Campagne</span>}
                  </div>
                  <h2 className="h5">{n.title}</h2>
                  <p className="small text-muted">{n.excerpt || n.content?.slice(0, 160)}…</p>
                  <Link to={`/actualites/${n._id}`} className="stretched-link">
                    Lire la publication
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
