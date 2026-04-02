/**
 * Tirage aléatoire de questions pour une session de quiz (sans remise).
 */

export function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * @template {{ id: string }} T
 * @param {T[]} allQuestions
 * @param {number} count
 * @returns {T[]}
 */
export function pickSessionQuestions(allQuestions, count) {
  const n = Math.min(Math.max(1, count), allQuestions.length)
  const copy = [...allQuestions]
  shuffleInPlace(copy)
  return copy.slice(0, n)
}

/**
 * @param {Array<{ id: string }>} allQuestions
 * @param {string[]} order
 */
export function orderQuestionsByIds(allQuestions, order) {
  const byId = new Map(allQuestions.map((q) => [q.id, q]))
  return order.map((id) => byId.get(id)).filter(Boolean)
}
