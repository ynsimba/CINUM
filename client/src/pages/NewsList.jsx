import { Seo } from '../components/Seo'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { api } from '../api/client'
import { NewsCard } from '../components/NewsCard'

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
        <div className="row g-4">
          {items.length === 0 && <p className="text-muted">Aucune actualité pour le moment.</p>}
          {items.map((n) => (
            <div key={n._id} className="col-md-6 col-lg-4">
              <NewsCard item={n} className="h-100" />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
