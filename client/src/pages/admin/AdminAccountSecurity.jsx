import { useState } from 'react'
import { changeStaffPassword } from '../../api/authApi'

const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{10,}$/

function getPasswordCriteria(password) {
  return {
    minLength: password.length >= 10,
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    digit: /\d/.test(password),
    special: /[^A-Za-z\d]/.test(password),
  }
}

export function AdminAccountSecurity() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [sendingPassword, setSendingPassword] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState('')
  const [passwordErr, setPasswordErr] = useState('')

  const criteria = getPasswordCriteria(newPassword)
  const score = Object.values(criteria).filter(Boolean).length
  const strengthPct = score * 20
  const strengthClass = score <= 2 ? 'bg-danger' : score <= 4 ? 'bg-warning' : 'bg-success'

  async function submitPasswordChange(e) {
    e.preventDefault()
    setPasswordMsg('')
    setPasswordErr('')

    if (!STRONG_PASSWORD_REGEX.test(newPassword)) {
      setPasswordErr(
        'Le nouveau mot de passe doit contenir au moins 10 caractères, avec majuscule, minuscule, chiffre et caractère spécial.'
      )
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordErr('La confirmation du nouveau mot de passe ne correspond pas.')
      return
    }
    if (newPassword === currentPassword) {
      setPasswordErr("Le nouveau mot de passe doit être différent de l'ancien.")
      return
    }

    try {
      setSendingPassword(true)
      await changeStaffPassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPasswordMsg('Mot de passe mis à jour avec succès.')
    } catch (err) {
      const apiErrors = err?.response?.data?.errors
      if (Array.isArray(apiErrors) && apiErrors.length) {
        setPasswordErr(String(apiErrors[0]?.msg || 'Saisie invalide.'))
      } else {
        setPasswordErr(String(err?.response?.data?.error || 'Impossible de changer le mot de passe.'))
      }
    } finally {
      setSendingPassword(false)
    }
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h1 className="h5 mb-3">Sécurité du compte</h1>
        <form className="d-flex flex-column gap-3" style={{ maxWidth: 520 }} onSubmit={submitPasswordChange}>
          <div>
            <label className="form-label mb-1" htmlFor="admin-current-password">
              Mot de passe actuel
            </label>
            <input
              id="admin-current-password"
              type="password"
              className="form-control"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <div>
            <label className="form-label mb-1" htmlFor="admin-new-password">
              Nouveau mot de passe
            </label>
            <input
              id="admin-new-password"
              type="password"
              className="form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              minLength={10}
              required
            />
            <div className="progress mt-2" style={{ height: 6 }}>
              <div
                className={`progress-bar ${strengthClass}`}
                role="progressbar"
                style={{ width: `${strengthPct}%` }}
                aria-valuenow={strengthPct}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
            <div className="small text-muted mt-1">
              Complexité : {score <= 2 ? 'faible' : score <= 4 ? 'moyenne' : 'forte'}
            </div>
          </div>
          <div>
            <label className="form-label mb-1" htmlFor="admin-confirm-password">
              Confirmer
            </label>
            <input
              id="admin-confirm-password"
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              minLength={10}
              required
            />
          </div>
          <div>
            <button className="btn btn-primary" type="submit" disabled={sendingPassword}>
              {sendingPassword ? 'Mise à jour...' : 'Modifier'}
            </button>
          </div>
        </form>

        <ul className="small text-muted mt-3 mb-0 ps-3">
          <li className={criteria.minLength ? 'text-success' : ''}>Au moins 10 caractères</li>
          <li className={criteria.lower ? 'text-success' : ''}>Une lettre minuscule</li>
          <li className={criteria.upper ? 'text-success' : ''}>Une lettre majuscule</li>
          <li className={criteria.digit ? 'text-success' : ''}>Un chiffre</li>
          <li className={criteria.special ? 'text-success' : ''}>Un caractère spécial</li>
        </ul>

        {passwordErr ? (
          <div className="alert alert-danger mt-3 mb-0 py-2" role="alert">
            {passwordErr}
          </div>
        ) : null}
        {passwordMsg ? (
          <div className="alert alert-success mt-3 mb-0 py-2" role="status">
            {passwordMsg}
          </div>
        ) : null}
      </div>
    </div>
  )
}
