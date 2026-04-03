import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AdminRefreshContext = createContext(0)

const REFRESH_MS = 15_000

export function AdminRefreshProvider({ children }) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return
      setTick((t) => t + 1)
    }, REFRESH_MS)
    return () => window.clearInterval(id)
  }, [])

  const value = useMemo(() => tick, [tick])
  return <AdminRefreshContext.Provider value={value}>{children}</AdminRefreshContext.Provider>
}

export function useAdminRefreshTick() {
  return useContext(AdminRefreshContext)
}
