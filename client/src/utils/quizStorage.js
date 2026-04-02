const PREFIX = 'cinum.quiz.v1.'

function key(quizId) {
  return `${PREFIX}${quizId}`
}

/**
 * @returns {{
 *   answers: Record<string, string>,
 *   step: number,
 *   finishedAt: string | null,
 *   lastScore: number | null,
 *   lastMax: number | null,
 *   questionOrder: string[] | null,
 *   deadlineAt: number | null,
 * } | null}
 */
export function loadQuizState(quizId) {
  try {
    const raw = localStorage.getItem(key(quizId))
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data || typeof data !== 'object') return null
    return {
      answers: data.answers && typeof data.answers === 'object' ? data.answers : {},
      step: typeof data.step === 'number' ? data.step : 0,
      finishedAt: data.finishedAt || null,
      lastScore: typeof data.lastScore === 'number' ? data.lastScore : null,
      lastMax: typeof data.lastMax === 'number' ? data.lastMax : null,
      questionOrder: Array.isArray(data.questionOrder) ? data.questionOrder : null,
      deadlineAt: typeof data.deadlineAt === 'number' ? data.deadlineAt : null,
    }
  } catch {
    return null
  }
}

export function saveQuizState(quizId, partial) {
  const prev = loadQuizState(quizId) || {
    answers: {},
    step: 0,
    finishedAt: null,
    lastScore: null,
    lastMax: null,
  }
  const next = { ...prev, ...partial }
  try {
    localStorage.setItem(key(quizId), JSON.stringify(next))
  } catch {
    /* quota ou mode privé */
  }
}

export function clearQuizAttempt(quizId) {
  try {
    localStorage.removeItem(key(quizId))
  } catch {
    /* ignore */
  }
}

/** Cote sur 20 à partir du nombre de bonnes réponses. */
export function scoreOutOf20(correct, total) {
  if (!total) return 0
  return Math.round((correct / total) * 200) / 10
}
