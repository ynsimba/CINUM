import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Seo } from '../components/Seo'
import { api } from '../api/client'
import { stripHtml, truncateMeta } from '../utils/seo'
import { SafeHtml } from '../components/SafeHtml'

export function NewsDetail() {
  const { id } = useParams()
  const [n, setN] = useState(null)
  const [err, setErr] = useState(false)

  useEffect(() => {
    api
      .get(`/api/public/news/${id}`)
      .then((r) => setN(r.data))
      .catch(() => setErr(true))
  }, [id])

  if (err) {
    return (
      <div className="container px-3 px-sm-4 py-4 py-md-5">
        <p>Publication introuvable.</p>
        <Link to="/actualites">Retour aux actualités</Link>
      </div>
    )
  }

  if (!n) {
    return (
      <div className="container px-3 px-sm-4 py-4 py-md-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement…</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <Seo
        title={`${n.title} — Civisme numérique RDC`}
        description={truncateMeta(stripHtml(n.excerpt || n.content))}
        ogType="article"
      />
      <div className="bg-light border-bottom py-3">
        <div className="container px-3 px-sm-4">
          <nav aria-label="Fil d’Ariane">
            <ol className="breadcrumb mb-0 small">
              <li className="breadcrumb-item">
                <Link to="/actualites">Actualités</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {n.title}
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <article className="container px-3 px-sm-4 py-3 py-md-4">
        <header className="mb-3">
          {n.alert && <span className="badge bg-danger me-2">Alerte</span>}
          {n.campaign && <span className="badge bg-warning text-dark">Campagne</span>}
          <h1 className="h2 mt-2">{n.title}</h1>
          <p className="text-muted small">
            {n.createdAt && new Date(n.createdAt).toLocaleDateString('fr-CD', { dateStyle: 'long' })}
          </p>
        </header>
        <SafeHtml className="article-body-safe" html={n.content} />
      </article>
    </>
  )
}
