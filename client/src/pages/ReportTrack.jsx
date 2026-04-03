import { Seo } from '../components/Seo'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { api, fetchCsrf } from '../api/client'

const ABUSE_LABELS = {
  cyberharcelement: 'Cyberharcèlement',
  desinformation: 'Désinformation',
  fraude: 'Fraude numérique',
  usurpation: 'Usurpation d’identité',
  autre: 'Autre',
}

function statusBadgeClass(status) {
  switch (status) {
    case 'pending':
      return 'warning text-dark'
    case 'reviewed':
      return 'info'
    case 'forwarded_arptc':
      return 'primary'
    case 'closed':
      return 'secondary'
    default:
      return 'light text-dark'
  }
}

export function ReportTrack() {
  const [reference, setReference] = useState('')
  const [secret, setSecret] = useState('')
  const [result, setResult] = useState(null)
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setErr(null)
    setResult(null)
    setLoading(true)
    try {
      await fetchCsrf()
      const ref = reference.trim().toUpperCase()
      const { data } = await api.post('/api/reports/suivi', {
        reference: ref,
        secret: secret.trim(),
      })
      setResult(data)
    } catch (ex) {
      setErr(
        ex.response?.data?.error ||
          ex.response?.data?.errors?.[0]?.msg ||
          'Consultation impossible. Vérifiez la référence et le code secret.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Seo
        title="Suivi d’un signalement — Civisme numérique RDC"
        description="Consultez l’état de votre dossier de signalement avec la référence et le code secret reçus après envoi du formulaire."
      />
      <PageHeader
        title="Suivi d’un signalement"
        lead="Consultez l’état de votre dossier avec la référence et le code secret communiqués après envoi du formulaire."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <form onSubmit={onSubmit}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="track-ref">
                      Référence du dossier
                    </label>
                    <input
                      id="track-ref"
                      name="reference"
                      className="form-control font-monospace"
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="Ex. CIN-2026-A1B2C3"
                      required
                      value={reference}
                      onChange={(e) => setReference(e.target.value)}
                      aria-describedby="track-help"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="track-secret">
                      Code secret
                    </label>
                    <input
                      id="track-secret"
                      type="password"
                      name="secret"
                      className="form-control font-monospace"
                      autoComplete="off"
                      required
                      minLength={8}
                      value={secret}
                      onChange={(e) => setSecret(e.target.value)}
                    />
                  </div>
                  <p id="track-help" className="form-text small text-muted">
                    Ces identifiants vous ont été donnés une seule fois à la validation de votre signalement. Si vous
                    les avez perdus, contactez le service via la page{' '}
                    <Link to="/contact">Contact</Link> en indiquant les éléments permettant de vous authentifier.
                  </p>
                  {err && (
                    <div className="alert alert-danger" role="alert">
                      {err}
                    </div>
                  )}
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Consultation…' : 'Afficher le dossier'}
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="card border-primary border-2">
              <div className="card-body small">
                <h2 className="h6 text-primary">Délais et traitement</h2>
                <p className="mb-2">
                  Les délais de réponse dépendent de la nature des faits, des vérifications nécessaires et des
                  sollicitations des autorités compétentes. Le statut affiché ci-contre après recherche reflète
                  l’avancement interne du dossier.
                </p>
                <p className="fw-semibold small mb-1">Repères indicatifs :</p>
                <ul className="mb-2 ps-3 small">
                  <li className="mb-1">Accusé de réception : souvent sous 2 jours ouvrés.</li>
                  <li className="mb-1">Premier examen : fréquemment 5 à 15 jours ouvrés.</li>
                  <li className="mb-0">Recours aux autorités externes : délais additionnels selon les procédures.</li>
                </ul>
                <p className="mb-0">
                  <Link to="/signalement">Nouveau signalement</Link>
                  {' · '}
                  <Link to="/confidentialite">Confidentialité</Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {result && (
          <div className="row mt-4">
            <div className="col-lg-9">
              <div className="card border-success border-2">
                <div className="card-body">
                  <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                    <h2 className="h5 text-success mb-0">Dossier {result.reference}</h2>
                    <span className={`badge ${statusBadgeClass(result.status)}`}>{result.statusLabel}</span>
                  </div>
                  <p className="small text-muted mb-3">
                    Le badge ci-dessus indique l’état de traitement de votre dossier (mis à jour par le service habilité).
                  </p>
                  <dl className="row mb-0 small">
                    <dt className="col-sm-4">Type signalé</dt>
                    <dd className="col-sm-8">{ABUSE_LABELS[result.abuseType] || result.abuseType}</dd>
                    <dt className="col-sm-4">Dépôt</dt>
                    <dd className="col-sm-8">
                      {result.createdAt && new Date(result.createdAt).toLocaleString('fr-CD')}
                    </dd>
                    <dt className="col-sm-4">Dernière mise à jour</dt>
                    <dd className="col-sm-8">
                      {result.updatedAt && new Date(result.updatedAt).toLocaleString('fr-CD')}
                    </dd>
                    {result.appointmentAt && (
                      <>
                        <dt className="col-sm-4">Rendez-vous</dt>
                        <dd className="col-sm-8">
                          <span className="fw-semibold">
                            {new Date(result.appointmentAt).toLocaleString('fr-CD', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {result.appointmentNote && String(result.appointmentNote).trim() ? (
                            <span className="d-block mt-1 text-break" style={{ whiteSpace: 'pre-wrap' }}>
                              {String(result.appointmentNote).trim()}
                            </span>
                          ) : null}
                        </dd>
                      </>
                    )}
                    <dt className="col-sm-4">Votre description (extrait)</dt>
                    <dd className="col-sm-8 text-break">{result.descriptionPreview}</dd>
                    {Array.isArray(result.attachments) && result.attachments.length > 0 && (
                      <>
                        <dt className="col-sm-4">Pièces jointes</dt>
                        <dd className="col-sm-8">
                          <ul className="list-unstyled mb-0">
                            {result.attachments.map((a, i) => {
                              const href = a.url || '#'
                              const saveName = a.originalName || `piece-jointe-${i + 1}`
                              return (
                                <li key={i} className="mb-2">
                                  <span className="small text-muted d-block mb-1">Pièce jointe {i + 1}</span>
                                  <span className="d-inline-flex flex-wrap gap-1 small">
                                    <a href={href} target="_blank" rel="noopener noreferrer">
                                      Ouvrir
                                    </a>
                                    <span className="text-muted">·</span>
                                    <a href={href} download={saveName}>
                                      Télécharger
                                    </a>
                                  </span>
                                </li>
                              )
                            })}
                          </ul>
                        </dd>
                      </>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
