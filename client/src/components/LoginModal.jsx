import { Seo } from './Seo'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { staffLoginErrorMessage } from '../utils/authErrors'

/**
 * Modale de connexion staff — affichée lorsque l’URL est `/connexion` (Navbar, lien direct, redirection admin).
 */
export function LoginModal() {
  const { t } = useTranslation()
  const errRef = useRef(null)
  const { user, loginStaff } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isOpen = location.pathname === '/connexion'
  const fromState = location.state?.from
  const fromPathname = typeof fromState?.pathname === 'string' ? fromState.pathname : '/admin'
  const fromSearch = typeof fromState?.search === 'string' ? fromState.search : ''
  const fromHash = typeof fromState?.hash === 'string' ? fromState.hash : ''
  // Destination post-login limitée aux routes admin pour éviter toute redirection non souhaitée.
  const from = fromPathname.startsWith('/admin') ? `${fromPathname}${fromSearch}${fromHash}` : '/admin'

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
      document.getElementById('login-modal-identifier')?.focus()
    }, 50)
    return () => window.clearTimeout(id)
  }, [isOpen])

  async function onSubmit(e) {
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try {
      await loginStaff(identifier, password)
      navigate(from, { replace: true })
    } catch (ex) {
      setErr(staffLoginErrorMessage(ex))
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
                Accès réservé aux comptes <strong>administrateur</strong> et <strong>modérateur</strong>. Les mots de
                passe sont stockés de façon sécurisée (hachage bcrypt, session JWT en cookie httpOnly).
              </p>
              <form onSubmit={onSubmit} noValidate>
                <div className="mb-3">
                  <label className="form-label" htmlFor="login-modal-identifier">
                    Identifiant
                  </label>
                  <input
                    id="login-modal-identifier"
                    type="text"
                    autoComplete="username"
                    placeholder="admin"
                    className="form-control"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value)
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
                  <div className="input-group">
                    <input
                      id="login-modal-password"
                      type={showPassword ? 'text' : 'password'}
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
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      aria-pressed={showPassword}
                    >
                      {showPassword ? 'Masquer' : 'Afficher'}
                    </button>
                  </div>
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
