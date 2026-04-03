import { Seo } from '../components/Seo'
import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '../components/PageHeader'
import { api } from '../api/client'
import { QUIZZES } from '../data/quizzes'
import { loadQuizState, scoreOutOf20 } from '../utils/quizStorage'

function QuizProgressBadge({ quizId, totalQuestions }) {
  const { t } = useTranslation()
  const snap = useMemo(() => loadQuizState(quizId), [quizId])
  if (snap?.finishedAt && snap.lastScore != null && snap.lastMax) {
    const cote = scoreOutOf20(snap.lastScore, snap.lastMax)
    return (
      <span className="badge bg-success-subtle text-success border border-success-subtle">
        {t('education.progress_last', { score: cote })}
      </span>
    )
  }
  const answered = snap?.answers ? Object.keys(snap.answers).length : 0
  if (answered > 0 && !snap?.finishedAt) {
    const pct = Math.round((answered / totalQuestions) * 100)
    return (
      <span className="badge bg-primary-subtle text-primary border border-primary-subtle">
        {t('education.progress_ongoing', { pct })}
      </span>
    )
  }
  return (
    <span className="badge bg-light text-muted border">{t('education.progress_not_started')}</span>
  )
}

export function Education() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('articles')
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
      <Seo title={t('education.seo_title')} description={t('education.seo_description')} />
      <PageHeader title={t('education.title')} lead={t('education.lead')} />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <div className="mb-5">
          <ul className="nav nav-tabs flex-nowrap border-bottom" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                type="button"
                className={`nav-link ${activeTab === 'articles' ? 'active' : ''}`}
                id="edu-tab-articles"
                role="tab"
                aria-selected={activeTab === 'articles'}
                aria-controls="edu-panel-articles"
                onClick={() => setActiveTab('articles')}
              >
                {t('education.articles_heading')}
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                type="button"
                className={`nav-link ${activeTab === 'quiz' ? 'active' : ''}`}
                id="edu-tab-quiz"
                role="tab"
                aria-selected={activeTab === 'quiz'}
                aria-controls="edu-panel-quiz"
                onClick={() => setActiveTab('quiz')}
              >
                {t('education.quiz_heading')}
              </button>
            </li>
          </ul>

          <div
            id="edu-panel-articles"
            role="tabpanel"
            aria-labelledby="edu-tab-articles"
            className="pt-4"
            hidden={activeTab !== 'articles'}
          >
            <div className="row g-3">
              {articles.length === 0 && <p className="text-muted small">{t('education.no_articles')}</p>}
              {articles.map((a) => (
                <div key={a._id} className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <h3 className="h6">{a.title}</h3>
                      <p className="small text-muted mb-2">{a.excerpt}</p>
                      <Link to={`/article/${a.slug}`}>{t('education.read_article')}</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            id="edu-panel-quiz"
            role="tabpanel"
            aria-labelledby="edu-tab-quiz"
            className="pt-4"
            hidden={activeTab !== 'quiz'}
          >
            <p className="text-muted small mb-3">
              {t('education.quiz_intro_part1')}{' '}
              <strong>{t('education.quiz_intro_strong')}</strong> {t('education.quiz_intro_part2')}
            </p>
            <div className="row g-3">
              {QUIZZES.map((qz) => {
                const st = loadQuizState(qz.id)
                const title = t(`quiz_meta.${qz.id}.title`, { defaultValue: qz.title })
                const description = t(`quiz_meta.${qz.id}.description`, { defaultValue: qz.description })
                return (
                  <div key={qz.id} className="col-md-6">
                    <div className="card border shadow-sm h-100">
                      <div className="card-body d-flex flex-column">
                        <h3 className="h6">{title}</h3>
                        <p className="small text-muted flex-grow-1">{description}</p>
                        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                          <QuizProgressBadge
                            quizId={qz.id}
                            totalQuestions={qz.questionsPerSession ?? qz.questions.length}
                          />
                        </div>
                        <Link className="btn btn-primary btn-sm align-self-start" to={`/espace-educatif/quiz/${qz.id}`}>
                          {st?.finishedAt ? t('education.quiz_again') : t('education.quiz_start')}
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <h2 className="h5">{t('education.laws_heading')}</h2>
        <ul className="mb-4">
          {laws.length === 0 && <li className="text-muted small">{t('education.no_laws')}</li>}
          {laws.map((lw) => (
            <li key={lw._id}>
              <strong>{lw.reference}</strong> — {lw.title}. {lw.summary}
              {lw.fullTextUrl && (
                <>
                  {' '}
                  <a href={lw.fullTextUrl} target="_blank" rel="noopener noreferrer">
                    {t('education.external_link')}
                  </a>
                </>
              )}
            </li>
          ))}
        </ul>

        <h2 className="h5">{t('education.resources_heading')}</h2>
        <ul>
          {resources.length === 0 && <li className="text-muted small">{t('education.no_resources')}</li>}
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
