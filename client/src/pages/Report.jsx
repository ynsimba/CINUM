import { Seo } from '../components/Seo'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { PageHeader } from '../components/PageHeader'
import { api, fetchCsrf } from '../api/client'
import { PHONE_COUNTRIES } from '../data/phoneCountries'

const TYPES = [
  { value: 'cyberharcelement', label: 'Cyberharcèlement' },
  { value: 'desinformation', label: 'Désinformation' },
  { value: 'fraude', label: 'Fraude numérique' },
  { value: 'usurpation', label: "Usurpation d'identité" },
  { value: 'autre', label: 'Autre' },
]

export function Report() {
  const errRef = useRef(null)
  const [form, setForm] = useState({
    abuseType: 'cyberharcelement',
    description: '',
    contactEmail: '',
    phoneCountryIso: 'CD',
    phoneNational: '',
  })
  const [files, setFiles] = useState([])
  const [msg, setMsg] = useState(null)
  const [credentials, setCredentials] = useState(null)
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCsrf().catch(() => {})
  }, [])

  useEffect(() => {
    if (err && errRef.current) errRef.current.focus()
  }, [err])

  async function onSubmit(e) {
    e.preventDefault()
    setMsg(null)
    setErr(null)
    if (files.length === 0) {
      setErr('Veuillez joindre au moins un fichier.')
      return
    }
    const parsed = parsePhoneNumberFromString(
      form.phoneNational.trim(),
      form.phoneCountryIso
    )
    if (!parsed || !parsed.isValid()) {
      setErr('Numéro de téléphone invalide pour le pays sélectionné.')
      return
    }
    setLoading(true)
    try {
      await fetchCsrf()
      const fd = new FormData()
      fd.append('abuseType', form.abuseType)
      fd.append('description', form.description)
      fd.append('contactEmail', form.contactEmail)
      fd.append('contactPhone', parsed.format('E.164'))
      files.forEach((f) => fd.append('attachments', f))
      const { data } = await api.post('/api/reports', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setMsg(data.message)
      if (data.reference && data.accessSecret) {
        setCredentials({ reference: data.reference, accessSecret: data.accessSecret })
      }
      setForm({
        abuseType: 'cyberharcelement',
        description: '',
        contactEmail: '',
        phoneCountryIso: 'CD',
        phoneNational: '',
      })
      setFiles([])
    } catch (ex) {
      setErr(ex.response?.data?.error || ex.response?.data?.errors?.[0]?.msg || 'Envoi impossible.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Seo
        title="Signalement — Civisme numérique RDC"
        description="Formulaire sécurisé pour signaler un abus en ligne (description, coordonnées, pièces jointes). Traitement réservé au personnel habilité ; orientation possible vers l’ARPTC."
      />
      <PageHeader
        title="Signalement d’abus"
        lead="Formulaire sécurisé. Les signalements peuvent également être portés auprès de l’ARPTC selon ses modalités officielles."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <form onSubmit={onSubmit} noValidate>
                  <p id="report-form-desc" className="small text-muted mb-3">
                    Tous les champs sont obligatoires.
                  </p>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="abuseType">
                      Type d&apos;abus
                    </label>
                    <select
                      id="abuseType"
                      name="abuseType"
                      className="form-select"
                      value={form.abuseType}
                      onChange={(e) => setForm({ ...form, abuseType: e.target.value })}
                      required
                    >
                      {TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="description">
                      Description détaillée (20 caractères minimum, 600 maximum)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="form-control"
                      rows={6}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      required
                      minLength={20}
                      maxLength={600}
                      aria-describedby="description-help"
                    />
                    <p id="description-help" className="form-text small text-muted">
                      {form.description.length} / 600 caractères
                    </p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="contactEmail">
                      Email
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      className="form-control"
                      autoComplete="email"
                      required
                      value={form.contactEmail}
                      onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                    />
                  </div>
                  <fieldset className="mb-3">
                    <legend className="form-label mb-2">Téléphone</legend>
                    <div className="row g-2">
                      <div className="col-md-5">
                        <label className="form-label small text-muted" htmlFor="phoneCountry">
                          Indicatif pays
                        </label>
                        <select
                          id="phoneCountry"
                          name="phoneCountry"
                          className="form-select"
                          required
                          value={form.phoneCountryIso}
                          onChange={(e) =>
                            setForm({ ...form, phoneCountryIso: e.target.value })
                          }
                          aria-describedby="phone-help"
                        >
                          {PHONE_COUNTRIES.map((c) => (
                            <option key={c.iso} value={c.iso}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-7">
                        <label className="form-label small text-muted" htmlFor="phoneNational">
                          Numéro (national)
                        </label>
                        <input
                          type="tel"
                          id="phoneNational"
                          name="phoneNational"
                          className="form-control"
                          autoComplete="tel-national"
                          inputMode="tel"
                          placeholder="Ex. 81 234 5678"
                          required
                          value={form.phoneNational}
                          onChange={(e) =>
                            setForm({ ...form, phoneNational: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <p id="phone-help" className="form-text small text-muted mb-0">
                      Choisissez le pays puis saisissez votre numéro local (sans répéter l&apos;indicatif).
                    </p>
                  </fieldset>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="attachments">
                      Pièces jointes (PDF, images, max 5 fichiers, 5 Mo chacun)
                    </label>
                    <input
                      id="attachments"
                      type="file"
                      className="form-control"
                      multiple
                      required
                      accept=".pdf,image/*,.doc,.docx"
                      onChange={(e) => setFiles(Array.from(e.target.files || []))}
                    />
                  </div>
                  {msg && (
                    <div className="alert alert-success" role="status">
                      <p className="mb-2">{msg}</p>
                      {credentials && (
                        <div className="border-top border-dark border-opacity-10 pt-3 mt-2">
                          <p className="small fw-semibold mb-2">
                            Conservez ces éléments : ils ne seront plus affichés ensuite.
                          </p>
                          <dl className="row small mb-2">
                            <dt className="col-sm-3">Référence</dt>
                            <dd className="col-sm-9 font-monospace mb-1">{credentials.reference}</dd>
                            <dt className="col-sm-3">Code secret</dt>
                            <dd className="col-sm-9 font-monospace mb-0 text-break">
                              {credentials.accessSecret}
                            </dd>
                          </dl>
                          <p className="small mb-0">
                            <Link to="/signalement/suivi">Consulter l’état du dossier</Link>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {err && (
                    <div
                      ref={errRef}
                      id="report-form-error"
                      tabIndex={-1}
                      className="alert alert-danger"
                      role="alert"
                    >
                      {err}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    aria-busy={loading}
                  >
                    {loading ? 'Envoi…' : 'Envoyer le signalement'}
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm mb-3">
              <div className="card-body small">
                <h2 className="h6 text-body">Délais indicatifs (non contractuels)</h2>
                <p className="text-muted mb-2">
                  Ces repères servent à calmer les attentes ; chaque dossier peut varier selon la charge et la complexité.
                </p>
                <ul className="mb-0 ps-3">
                  <li className="mb-1">Accusé de réception par courriel : en général sous 2 jours ouvrés.</li>
                  <li className="mb-1">Premier examen interne : souvent entre 5 et 15 jours ouvrés.</li>
                  <li className="mb-0">Sollicitation d’autorités externes (y compris ARPTC) : délais supplémentaires variables.</li>
                </ul>
              </div>
            </div>
            <div className="card border-primary border-2">
              <div className="card-body small">
                <h2 className="h6 text-primary">Autorité de Régulation de la Poste et des Télécommunications du Congo (ARPTC)</h2>
                <p className="mb-2">
                  Pour les missions de régulation et les procédures officielles, rapprochez-vous des canaux publiés par
                  l&apos;ARPTC (site institutionnel, guichets, lignes d&apos;information). Ce portail ne remplace pas une
                  plainte pénale auprès des services compétents lorsque la situation l&apos;exige.
                </p>
                <p className="mb-2 text-muted">
                  Les données transmises via ce formulaire sont traitées avec des mesures de sécurité appropriées et
                  réservées au personnel habilité. Détails :{' '}
                  <Link to="/confidentialite" className="text-decoration-none">
                    politique de confidentialité
                  </Link>
                  .
                </p>
                <p className="mb-0 small">
                  <Link to="/signalement/suivi" className="text-decoration-none fw-semibold">
                    Suivi d’un signalement déjà envoyé
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
