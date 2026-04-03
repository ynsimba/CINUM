import axios from 'axios'
import { getAuthAccessToken } from './authToken'

if (import.meta.env.DEV && import.meta.env.VITE_API_URL) {
  console.warn(
    '[CINUM] VITE_API_URL est défini : en développement, préférez le proxy Vite (laissez VITE_API_URL vide) pour que les cookies JWT/CSRF fonctionnent. Sinon, l’API doit autoriser explicitement l’origine du navigateur (CORS + cookies).'
  )
}

const defaults = {
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  timeout: 30_000,
}

/** Instance sans intercepteur de réponse — évite une boucle infinie si GET /api/auth/csrf renvoie 403 */
const apiPlain = axios.create(defaults)

const api = axios.create({
  ...defaults,
  headers: { 'Content-Type': 'application/json' },
})

let csrfToken = null

export async function fetchCsrf() {
  const { data } = await apiPlain.get('/api/auth/csrf')
  csrfToken = data.csrfToken
  return csrfToken
}

api.interceptors.request.use(async (config) => {
  const bearer = getAuthAccessToken()
  if (bearer) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${bearer}`
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  const needsCsrf =
    config.method &&
    !['get', 'head', 'options'].includes(config.method.toLowerCase()) &&
    !config.url?.includes('/api/auth/csrf')
  if (needsCsrf) {
    if (!csrfToken) await fetchCsrf()
    config.headers['X-CSRF-Token'] = csrfToken
  }
  return config
})

function isCsrfRequest(config) {
  const u = config?.url || ''
  return u.includes('/api/auth/csrf')
}

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const status = error.response?.status
    const cfg = error.config
    // Ne jamais boucler sur l’échec du CSRF (403 ici → pas de nouvel appel fetchCsrf via cet intercepteur)
    if (status === 403 && cfg && !cfg._retry && !isCsrfRequest(cfg)) {
      cfg._retry = true
      csrfToken = null
      try {
        await fetchCsrf()
        cfg.headers = cfg.headers || {}
        cfg.headers['X-CSRF-Token'] = csrfToken
        return api.request(cfg)
      } catch {
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export { api }
