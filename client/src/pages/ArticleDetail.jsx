import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Seo } from '../components/Seo'
import { api } from '../api/client'
import { truncateMeta } from '../utils/seo'

export function ArticleDetail() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [err, setErr] = useState(null)

  useEffect(() => {
    api
      .get(`/api/public/articles/${slug}`)
      .then((r) => setArticle(r.data))
      .catch(() => setErr(true))
  }, [slug])

  if (err) {
    return (
      <div className="container px-3 px-sm-4 py-4 py-md-5">
        <p>Article introuvable.</p>
        <Link to="/espace-educatif">Retour</Link>
      </div>
    )
  }

  if (!article) {
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
        title={`${article.title} — Civisme numérique RDC`}
        description={truncateMeta(article.excerpt || article.content)}
        ogType="article"
      />
      <div className="bg-light border-bottom py-3">
        <div className="container px-3 px-sm-4">
          <nav aria-label="Fil d’Ariane">
            <ol className="breadcrumb mb-0 small">
              <li className="breadcrumb-item">
                <Link to="/espace-educatif">Espace éducatif</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {article.title}
              </li>
            </ol>
          </nav>
        </div>
      </div>
      <article className="container px-3 px-sm-4 py-3 py-md-4">
        <h1 className="h2">{article.title}</h1>
        <p className="text-muted small">{article.excerpt}</p>
        <div className="article-body" style={{ whiteSpace: 'pre-wrap' }}>
          {article.content}
        </div>
      </article>
    </>
  )
}
