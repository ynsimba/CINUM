import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './i18n'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
)

if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    const host = window.location.hostname
    const isLocal = host === 'localhost' || host === '127.0.0.1'
    if (import.meta.env.DEV || isLocal) {
      // En développement, on supprime tout SW résiduel pour éviter les erreurs HMR/WebSocket.
      try {
        const regs = await navigator.serviceWorker.getRegistrations()
        await Promise.all(regs.map((r) => r.unregister()))
        if (typeof caches !== 'undefined') {
          const keys = await caches.keys()
          await Promise.all(keys.map((k) => caches.delete(k)))
        }
      } catch {
        // ignore
      }
      return
    }
    if (import.meta.env.PROD) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  })
}
