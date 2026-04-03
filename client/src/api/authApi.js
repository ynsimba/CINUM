import { api, fetchCsrf } from './client'
import { clearAuthAccessToken, setAuthAccessToken } from './authToken'

/**
 * Connexion réservée aux comptes staff (administrateur, modérateur).
 * Cookie httpOnly + `accessToken` pour en-tête Bearer si le cookie n’est pas envoyé.
 */
export async function loginStaff(email, password) {
  await fetchCsrf()
  const { data } = await api.post('/api/auth/login', { email, password })
  if (data.accessToken) setAuthAccessToken(data.accessToken)
  return data.user
}

export async function logoutStaff() {
  clearAuthAccessToken()
  await fetchCsrf()
  await api.post('/api/auth/logout')
}

export async function fetchCurrentUser() {
  await fetchCsrf()
  const { data } = await api.get('/api/auth/me')
  return data.user
}

export async function changeStaffPassword(currentPassword, newPassword) {
  await fetchCsrf()
  const { data } = await api.post('/api/auth/change-password', { currentPassword, newPassword })
  return data
}
