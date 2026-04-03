import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import * as authApi from '../api/authApi'
import { isAdminAuthBypass } from '../config/adminFlags'
import { STAFF_ROLES } from '../constants/staffRoles'

const AuthContext = createContext(null)

/**
 * Incrémenté après login / logout pour que les requêtes `refresh()` encore en cours
 * n’écrasent pas l’état (sinon un GET /me lancé avant le POST login terminait en 401
 * et remettait user à null après une connexion réussie — formulaire bloqué sur /connexion).
 */
function useAuthGeneration() {
  const gen = useRef(0)
  const bump = useCallback(() => {
    gen.current += 1
  }, [])
  return { gen, bump }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { gen, bump } = useAuthGeneration()

  const refresh = useCallback(async () => {
    if (isAdminAuthBypass) {
      setUser(null)
      setLoading(false)
      return
    }
    const atStart = gen.current
    try {
      const u = await authApi.fetchCurrentUser()
      if (atStart !== gen.current) return
      setUser(u)
    } catch {
      if (atStart !== gen.current) return
      setUser(null)
    } finally {
      if (atStart === gen.current) setLoading(false)
    }
  }, [gen])

  useEffect(() => {
    refresh()
  }, [refresh])

  const loginStaff = useCallback(
    async (email, password) => {
      bump()
      const u = await authApi.loginStaff(email, password)
      setUser(u)
      setLoading(false)
      return u
    },
    [bump]
  )

  const logoutStaff = useCallback(async () => {
    bump()
    await authApi.logoutStaff()
    setUser(null)
    setLoading(false)
  }, [bump])

  const value = useMemo(
    () => ({
      user,
      loading,
      /** Connexion admin / modérateur uniquement (API `/api/auth/login`). */
      loginStaff,
      /** Déconnexion (révoque le cookie côté serveur). */
      logoutStaff,
      /** Recharge l’utilisateur depuis `/api/auth/me` (utile après actions sensibles). */
      refresh,
      isAdmin: isAdminAuthBypass || user?.role === 'admin',
      isModerator: isAdminAuthBypass || user?.role === 'moderator' || user?.role === 'admin',
      /** Rôles autorisés pour les routes `/admin` (aligné sur le backend). */
      staffRoles: STAFF_ROLES,
    }),
    [user, loading, loginStaff, logoutStaff, refresh]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth hors AuthProvider')
  return ctx
}
