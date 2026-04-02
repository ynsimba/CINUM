import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, fetchCsrf } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      await fetchCsrf()
      const { data } = await api.get('/api/auth/me')
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = async (email, password) => {
    await fetchCsrf()
    const { data } = await api.post('/api/auth/login', { email, password })
    setUser(data.user)
    return data.user
  }

  const logout = async () => {
    await fetchCsrf()
    await api.post('/api/auth/logout')
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      refresh,
      isAdmin: user?.role === 'admin',
      isModerator: user?.role === 'moderator' || user?.role === 'admin',
    }),
    [user, loading, refresh]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth hors AuthProvider')
  return ctx
}
