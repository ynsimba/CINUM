import { api, fetchCsrf } from './client'

/**
 * Connexion réservée aux comptes staff (administrateur, modérateur).
 * Session pilotée par cookie httpOnly (pas de JWT exposé au JavaScript).
 */
export async function loginStaff(identifier, password) {
  await fetchCsrf()
  const { data } = await api.post('/api/auth/login', { email: identifier, password })
  return data.user
}

export async function logoutStaff() {
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
