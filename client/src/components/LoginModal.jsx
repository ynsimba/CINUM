import { Seo } from './Seo'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'

function loginErrorMessage(ex) {
  const res = ex.response
  if (!res) {
    if (ex.code === 'ECONNABORTED' || String(ex.message || '').toLowerCase().includes('timeout')) {
      return 'La requête a expiré. Réessayez ou vérifiez que l’API est démarrée.'
    }
    if (ex.message === 'Network Error') {
      return 'Le serveur ne répond pas. Vérifiez que l’API tourne dans un autre terminal : npm run dev:server (port dans server/.env, défaut 5001), puis réessayez.'
    }
    return `Impossible de joindre l’API (${ex.message || 'erreur réseau'}). Lancez npm run dev:server ; le port doit correspondre au proxy Vite (défaut 5001).`
  }
  const status = res.status
  const d = res.data
  if (d && typeof d === 'object') {
    if (typeof d.error === 'string' && d.error.trim()) return d.error
    const first = Array.isArray(d.errors) ? d.errors[0] : null
    if (first?.msg) return first.msg
  }
  if (typeof d === 'string' && d.trim()) {
    return 'Réponse serveur inattendue (souvent une page HTML). Vérifiez l’URL de l’API et le proxy Vite vers le bon port.'
  }
  if (status === 401) return 'Identifiants incorrects.'
  if (status === 403) return 'Accès refusé (jeton CSRF ou session). Rechargez la page et réessayez.'
  if (status === 502 || status === 503) {
    return [
      'L’API ne répond pas ou le proxy Vite ne peut pas l’atteindre (erreur 502/503).',
      '1) Démarrez MongoDB : npm run db:up (ou votre conteneur Docker).',
      '2) Dans un autre terminal, à la racine du projet : npm run dev:server.',
      '3) Vérifiez que PORT dans server/.env est le même que la cible du proxy Vite (défaut 5001 ; sinon client/.env → VITE_DEV_API_TARGET).',
      'Redémarrez le client Vite après modification de client/.env.',
    ].join(' ')
  }
  if (status === 500) return 'Erreur serveur. Réessayez plus tard.'
  return `Connexion impossible (erreur HTTP ${status}).`
}

/**
 * Modale de connexion — affichée lorsque l’URL est `/connexion` (Navbar, lien direct, redirection admin).
 */
export function LoginModal() {
  const { t } = useTranslation()
  const errRef = useRef(null)
  const { user, login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isOpen = location.pathname === '/connexion'
  const from = location.state?.from?.pathname || '/admin'

  const closeModal = useCallback(() => {
    navigate('/', { replace: true })
  }, [navigate])

  useEffect(() => {
    if (err && errRef.current) errRef.current.focus()
  }, [err])

  useEffect(() => {
    if (!isOpen) return undefined
    const prevOverflow = document.body.style.overflow
    document.body.classList.add('modal-open')
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('modal-open')
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [isOpen, closeModal])

  useEffect(() => {
    if (!isOpen) return undefined
    const id = window.setTimeout(() => {
      document.getElementById('login-modal-email')?.focus()
    }, 50)
    return () => window.clearTimeout(id)
  }, [isOpen])

  async function onSubmit(e) {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (ex) {
      setErr(loginErrorMessage(ex))
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  if (user) {
    return <Navigate to={from} replace />
  }

  return (
    <>
      <Seo
        title="Connexion — Administration CINUM"
        description="Accès réservé aux comptes autorisés pour l’administration du portail civisme numérique RDC."
        noindex
      />
      <div
        className="modal-backdrop fade show cinum-login-modal-backdrop"
        aria-hidden="true"
        onClick={closeModal}
      />
      <div
        className="modal fade show d-block cinum-login-modal"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeModal()
        }}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-dialog-scrollable px-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content shadow">
            <div className="modal-header border-0 pb-0">
              <h1 id="login-modal-title" className="modal-title h5">
                Espace réservé — connexion
              </h1>
              <button
                type="button"
                className="btn-close"
                aria-label={t('a11y.close_modal')}
                onClick={closeModal}
              />
            </div>
            <div className="modal-body pt-2">
              <p className="small text-muted mb-3">
                Accès réservé aux comptes administrateur et modérateur. Les mots de passe sont stockés de façon
                sécurisée (hachage).
              </p>
              <form onSubmit={onSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label" htmlFor="login-modal-email">
                    Courriel
                  </label>
                  <input
                    id="login-modal-email"
                    type="email"
                    autoComplete="username"
                    className="form-control"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (err) setErr(null)
                    }}
                    required
                    aria-invalid={!!err}
                    aria-describedby={err ? 'login-modal-error' : undefined}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="login-modal-password">
                    Mot de passe
                  </label>
                  <input
                    id="login-modal-password"
                    type="password"
                    autoComplete="current-password"
                    className="form-control"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (err) setErr(null)
                    }}
                    required
                    minLength={8}
                    aria-invalid={!!err}
                    aria-describedby={err ? 'login-modal-error' : undefined}
                  />
                </div>
                {err && (
                  <div
                    ref={errRef}
                    id="login-modal-error"
                    tabIndex={-1}
                    className="alert alert-danger"
                    role="alert"
                  >
                    {err}
                  </div>
                )}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? 'Connexion…' : 'Se connecter'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
