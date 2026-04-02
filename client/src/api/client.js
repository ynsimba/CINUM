import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
})

let csrfToken = null

export async function fetchCsrf() {
  const { data } = await api.get('/api/auth/csrf')
  csrfToken = data.csrfToken
  return csrfToken
}

api.interceptors.request.use(async (config) => {
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

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    if (error.response?.status === 403 && error.config && !error.config._retry) {
      error.config._retry = true
      csrfToken = null
      await fetchCsrf()
      error.config.headers['X-CSRF-Token'] = csrfToken
      return api.request(error.config)
    }
    return Promise.reject(error)
  }
)

export { api }
