import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'
import { getQuizById } from '../data/quizzes'
import { orderQuestionsByIds, pickSessionQuestions } from '../utils/quizSession'
import { clearQuizAttempt, loadQuizState, saveQuizState, scoreOutOf20 } from '../utils/quizStorage'

function formatMmSs(totalSeconds) {
  const s = Math.max(0, totalSeconds)
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`
}

export function QuizPlayer() {
  const { quizId } = useParams()
  const quiz = useMemo(() => (quizId ? getQuizById(quizId) : null), [quizId])

  const [sessionKey, setSessionKey] = useState(0)
  const [sessionQuestions, setSessionQuestions] = useState([])
  const [deadlineAt, setDeadlineAt] = useState(null)
  const [remainingSeconds, setRemainingSeconds] = useState(0)

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [phase, setPhase] = useState('play')
  const [result, setResult] = useState(null)

  const answersRef = useRef({})
  const sessionQuestionsRef = useRef([])
  const finishingRef = useRef(false)
  useEffect(() => {
    answersRef.current = answers
  }, [answers])
  useEffect(() => {
    sessionQuestionsRef.current = sessionQuestions
  }, [sessionQuestions])

  /** Initialise ou reprend une session (tirage aléatoire + minuteur). */
  useEffect(() => {
    finishingRef.current = false
    if (!quiz) return

    const saved = loadQuizState(quiz.id)
    const perSession = quiz.questionsPerSession ?? quiz.questions.length
    const limitMin = quiz.timeLimitMinutes ?? 10

    if (saved?.finishedAt && saved.lastScore != null && saved.lastMax != null) {
      setPhase('results')
      setResult({
        correct: saved.lastScore,
        total: saved.lastMax,
        cote: scoreOutOf20(saved.lastScore, saved.lastMax),
        timeUp: false,
      })
      setAnswers(saved.answers || {})
      setSessionQuestions([])
      setDeadlineAt(null)
      return
    }

    if (saved?.questionOrder?.length && !saved.finishedAt) {
      const restored = orderQuestionsByIds(quiz.questions, saved.questionOrder)
      if (restored.length === saved.questionOrder.length) {
        setSessionQuestions(restored)
        let deadline = saved.deadlineAt
        if (typeof deadline !== 'number' || Number.isNaN(deadline)) {
          deadline = Date.now() + limitMin * 60 * 1000
          saveQuizState(quiz.id, { deadlineAt: deadline })
        }
        setDeadlineAt(deadline)
        setStep(Math.min(saved.step || 0, Math.max(0, restored.length - 1)))
        setAnswers(saved.answers || {})
        setPhase('play')
        return
      }
    }

    const picked = pickSessionQuestions(quiz.questions, perSession)
    const order = picked.map((q) => q.id)
    const deadline = Date.now() + limitMin * 60 * 1000
    setSessionQuestions(picked)
    setDeadlineAt(deadline)
    setStep(0)
    setAnswers({})
    setPhase('play')
    saveQuizState(quiz.id, {
      questionOrder: order,
      deadlineAt: deadline,
      answers: {},
      step: 0,
      finishedAt: null,
      lastScore: null,
      lastMax: null,
    })
  }, [quiz, sessionKey])

  /** Compte à rebours du minuteur. */
  useEffect(() => {
    if (phase !== 'play' || !deadlineAt) return

    const tick = () => {
      const left = Math.max(0, Math.ceil((deadlineAt - Date.now()) / 1000))
      setRemainingSeconds(left)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [phase, deadlineAt])

  const total = sessionQuestions.length
  const current = sessionQuestions[step]

  const finishQuiz = useCallback(
    (opts = { timeUp: false }) => {
      if (finishingRef.current) return
      const qs = sessionQuestionsRef.current
      if (!quiz || qs.length === 0) return
      finishingRef.current = true
      const finalAnswers = answersRef.current
      let correct = 0
      qs.forEach((q) => {
        if (finalAnswers[q.id] === q.correctOptionId) correct += 1
      })
      const max = qs.length
      const cote = scoreOutOf20(correct, max)
      setResult({ correct, total: max, cote, timeUp: opts.timeUp })
      setPhase('results')
      saveQuizState(quiz.id, {
        answers: finalAnswers,
        step: Math.max(0, qs.length - 1),
        finishedAt: new Date().toISOString(),
        lastScore: correct,
        lastMax: max,
      })
    },
    [quiz]
  )

  /** Fin automatique quand le temps est écoulé. */
  useEffect(() => {
    if (phase !== 'play' || !deadlineAt || total === 0) return
    if (Date.now() < deadlineAt) return
    finishQuiz({ timeUp: true })
  }, [phase, deadlineAt, total, finishQuiz, remainingSeconds])

  const answeredForProgress = useMemo(() => {
    if (!sessionQuestions.length) return 0
    return sessionQuestions.filter((q) => answers[q.id]).length
  }, [sessionQuestions, answers])

  const progressPercent = total ? Math.round((answeredForProgress / total) * 100) : 0

  const selectOption = useCallback(
    (optionId) => {
      if (!current || phase !== 'play') return
      const next = { ...answers, [current.id]: optionId }
      setAnswers(next)
      saveQuizState(quiz.id, { answers: next, step })
    },
    [current, answers, quiz, step, phase]
  )

  const goNext = useCallback(() => {
    if (!quiz || !current || sessionQuestionsRef.current.length === 0) return
    if (!answers[current.id]) return
    const qs = sessionQuestionsRef.current
    if (step >= qs.length - 1) {
      finishQuiz({ timeUp: false })
      return
    }
    const nextStep = step + 1
    setStep(nextStep)
    saveQuizState(quiz.id, { answers: answersRef.current, step: nextStep })
  }, [quiz, current, step, answers, finishQuiz])

  const restart = useCallback(() => {
    if (!quiz) return
    clearQuizAttempt(quiz.id)
    setSessionKey((k) => k + 1)
    setStep(0)
    setAnswers({})
    setPhase('play')
    setResult(null)
    setSessionQuestions([])
    setDeadlineAt(null)
  }, [quiz])

  if (!quizId || !quiz) {
    return <Navigate to="/espace-educatif" replace />
  }

  const timerUrgent = remainingSeconds > 0 && remainingSeconds <= 120

  return (
    <>
      <Seo
        title={`${quiz.title} — Quiz — Civisme numérique RDC`}
        description={quiz.description}
      />
      <PageHeader title={quiz.title} lead={quiz.description} />

      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <nav aria-label="Fil d’Ariane" className="mb-3">
          <ol className="breadcrumb small mb-0">
            <li className="breadcrumb-item">
              <Link to="/espace-educatif">Espace éducatif</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Quiz
            </li>
          </ol>
        </nav>

        {phase === 'play' && total === 0 && (
          <p className="text-center text-muted py-5">Préparation du quiz…</p>
        )}

        {phase === 'play' && current && total > 0 && (
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                    <div
                      className={`d-flex align-items-center gap-2 px-3 py-2 rounded border ${
                        timerUrgent ? 'border-danger bg-danger bg-opacity-10' : 'border-primary bg-primary bg-opacity-10'
                      }`}
                      role="timer"
                      aria-live="polite"
                      aria-atomic="true"
                    >
                      <span className="small text-muted">Temps restant</span>
                      <span
                        className={`font-monospace fw-bold fs-5 mb-0 ${timerUrgent ? 'text-danger' : 'text-primary'}`}
                      >
                        {formatMmSs(remainingSeconds)}
                      </span>
                    </div>
                    <span className="small text-muted text-md-end">
                      {quiz.questionsPerSession != null && quiz.questions.length > total
                        ? `${total} questions tirées au hasard (sur ${quiz.questions.length})`
                        : `${total} questions`}
                    </span>
                  </div>

                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                    <span className="small text-muted" id="quiz-progress-label">
                      Progression : question {step + 1} sur {total}
                    </span>
                    <span className="small fw-semibold text-primary" aria-hidden="true">
                      {progressPercent} %
                    </span>
                  </div>
                  <div
                    className="progress mb-4"
                    style={{ height: '0.6rem' }}
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={progressPercent}
                    aria-labelledby="quiz-progress-label"
                  >
                    <div className="progress-bar bg-primary" style={{ width: `${progressPercent}%` }} />
                  </div>

                  <h2 className="h5 mb-3">{current.prompt}</h2>
                  <fieldset>
                    <legend className="visually-hidden">Choix de réponse</legend>
                    <div className="d-flex flex-column gap-2">
                      {current.options.map((opt) => (
                        <label
                          key={opt.id}
                          className={`d-flex align-items-start gap-2 p-3 rounded border cursor-pointer ${
                            answers[current.id] === opt.id ? 'border-primary bg-primary bg-opacity-10' : 'border-light'
                          }`}
                          style={{ cursor: 'pointer' }}
                        >
                          <input
                            type="radio"
                            className="form-check-input mt-1 flex-shrink-0"
                            name={`q-${current.id}`}
                            checked={answers[current.id] === opt.id}
                            onChange={() => selectOption(opt.id)}
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="d-flex flex-wrap gap-2 justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      disabled={step === 0}
                      onClick={() => {
                        const prev = step - 1
                        setStep(prev)
                        saveQuizState(quiz.id, { answers, step: prev })
                      }}
                    >
                      Précédent
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={!answers[current.id]}
                      onClick={goNext}
                    >
                      {step >= total - 1 ? 'Terminer et voir la cote' : 'Question suivante'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === 'results' && result && (
          <div className="row justify-content-center">
            <div className="col-lg-7">
              <div className="card border-success border-2 shadow-sm">
                <div className="card-body text-center py-4">
                  <h2 className="h4 text-success mb-3">Résultat du quiz</h2>
                  {result.timeUp && (
                    <p className="small text-warning-emphasis bg-warning-subtle border border-warning rounded py-2 px-3 mb-3">
                      Le temps imparti est écoulé. Les questions sans réponse sont comptées comme incorrectes.
                    </p>
                  )}
                  <p className="display-6 fw-bold text-primary mb-1">{result.cote} / 20</p>
                  <p className="text-muted mb-2">Cote sur 20</p>
                  <p className="mb-1">
                    <strong>{result.correct}</strong> bonnes réponses sur <strong>{result.total}</strong>
                  </p>
                  <p className="small text-muted mb-4">
                    Soit {Math.round((result.correct / result.total) * 100)} % de réussite.
                  </p>
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                    <button type="button" className="btn btn-primary" onClick={restart}>
                      Nouvelle session (nouvelles questions)
                    </button>
                    <Link to="/espace-educatif" className="btn btn-outline-secondary">
                      Retour à l&apos;espace éducatif
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
