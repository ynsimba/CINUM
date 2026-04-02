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
                  <h2 className="h5 text-success mb-3">Dossier {result.reference}</h2>
                  <dl className="row mb-0 small">
                    <dt className="col-sm-4">Statut</dt>
                    <dd className="col-sm-8">{result.statusLabel}</dd>
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
                    <dt className="col-sm-4">Votre description (extrait)</dt>
                    <dd className="col-sm-8 text-break">{result.descriptionPreview}</dd>
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
