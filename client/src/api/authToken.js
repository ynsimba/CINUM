/** Jeton JWT pour en-tête `Authorization: Bearer` (complète le cookie httpOnly si le navigateur ne l’envoie pas). */

const STORAGE_KEY = 'cinum_access_token'

let memoryToken = null

export function hydrateAccessTokenFromStorage() {
  try {
    const t = sessionStorage.getItem(STORAGE_KEY)
    if (t) memoryToken = t
  } catch {
    memoryToken = null
  }
}

export function getAuthAccessToken() {
  return memoryToken
}

export function setAuthAccessToken(token) {
  memoryToken = token || null
  try {
    if (token) sessionStorage.setItem(STORAGE_KEY, token)
    else sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* private mode, etc. */
  }
}

export function clearAuthAccessToken() {
  setAuthAccessToken(null)
}
