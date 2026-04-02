import { Seo } from '../components/Seo'
import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { api } from '../api/client'
import { QUIZZES } from '../data/quizzes'
import { loadQuizState, scoreOutOf20 } from '../utils/quizStorage'

function QuizProgressBadge({ quizId, totalQuestions }) {
  const snap = useMemo(() => loadQuizState(quizId), [quizId])
  if (snap?.finishedAt && snap.lastScore != null && snap.lastMax) {
    const cote = scoreOutOf20(snap.lastScore, snap.lastMax)
    return (
      <span className="badge bg-success-subtle text-success border border-success-subtle">
        Dernière cote : {cote} / 20
      </span>
    )
  }
  const answered = snap?.answers ? Object.keys(snap.answers).length : 0
  if (answered > 0 && !snap?.finishedAt) {
    const pct = Math.round((answered / totalQuestions) * 100)
    return (
      <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
        En cours — {pct} % complété
      </span>
    )
  }
  return (
    <span className="badge bg-light text-muted border">Pas encore commencé</span>
  )
}

export function Education() {
  const [articles, setArticles] = useState([])
  const [resources, setResources] = useState([])
  const [laws, setLaws] = useState([])

  useEffect(() => {
    Promise.all([
      api.get('/api/public/articles').then((r) => r.data.items || []).catch(() => []),
      api.get('/api/public/resources').then((r) => r.data.items || []).catch(() => []),
      api.get('/api/public/laws').then((r) => r.data.items || []).catch(() => []),
    ]).then(([a, res, l]) => {
      setArticles(a)
      setResources(res)
      setLaws(l)
    })
  }, [])

  return (
    <>
      <Seo
        title="Espace éducatif — Civisme numérique RDC"
        description="Quiz QCM, articles, guides et références juridiques pour comprendre le civisme numérique en RDC et suivre votre progression."
      />
      <PageHeader
        title="Espace éducatif"
        lead="Quiz à choix multiples, articles, guides et références juridiques à vocation pédagogique."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <section className="mb-5" aria-labelledby="edu-quiz-heading">
          <h2 id="edu-quiz-heading" className="h5 mb-2">
            Quiz (QCM)
          </h2>
          <p className="text-muted small mb-3">
            Répondez aux questions ; votre progression est enregistrée sur cet appareil. À la fin, une{' '}
            <strong>cote sur 20</strong> est calculée automatiquement.
          </p>
          <div className="row g-3">
            {QUIZZES.map((qz) => {
              const st = loadQuizState(qz.id)
              return (
                <div key={qz.id} className="col-md-6">
                  <div className="card border shadow-sm h-100">
                    <div className="card-body d-flex flex-column">
                      <h3 className="h6">{qz.title}</h3>
                      <p className="small text-muted flex-grow-1">{qz.description}</p>
                      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                        <QuizProgressBadge
                          quizId={qz.id}
                          totalQuestions={qz.questionsPerSession ?? qz.questions.length}
                        />
                      </div>
                      <Link className="btn btn-primary btn-sm align-self-start" to={`/espace-educatif/quiz/${qz.id}`}>
                        {st?.finishedAt ? 'Revoir le résultat / refaire' : 'Commencer le quiz'}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <h2 className="h5">Articles</h2>
        <div className="row g-3 mb-4">
          {articles.length === 0 && <p className="text-muted small">Aucun article publié pour le moment.</p>}
          {articles.map((a) => (
            <div key={a._id} className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h3 className="h6">{a.title}</h3>
                  <p className="small text-muted mb-2">{a.excerpt}</p>
                  <Link to={`/article/${a.slug}`}>Lire l&apos;article</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="h5">Références légales (extraits)</h2>
        <ul className="mb-4">
          {laws.length === 0 && <li className="text-muted small">Aucune référence chargée.</li>}
          {laws.map((lw) => (
            <li key={lw._id}>
              <strong>{lw.reference}</strong> — {lw.title}. {lw.summary}
              {lw.fullTextUrl && (
                <>
                  {' '}
                  <a href={lw.fullTextUrl} target="_blank" rel="noopener noreferrer">
                    Lien externe
                  </a>
                </>
              )}
            </li>
          ))}
        </ul>

        <h2 className="h5">Ressources téléchargeables</h2>
        <ul>
          {resources.length === 0 && <li className="text-muted small">Aucune ressource pour le moment.</li>}
          {resources.map((r) => (
            <li key={r._id}>
              <a href={r.fileUrl} download>
                {r.title}
              </a>
              {r.description && <span className="text-muted small"> — {r.description}</span>}
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
