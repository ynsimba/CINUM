import { Seo } from '../components/Seo'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { PageHeader } from '../components/PageHeader'
import { api, fetchCsrf } from '../api/client'
import { PHONE_COUNTRIES } from '../data/phoneCountries'

const ABUSE_TYPES = [
  { value: 'cyberharcelement', label: 'Cyberharcèlement' },
  { value: 'desinformation', label: 'Désinformation' },
  { value: 'fraude', label: 'Fraude numérique' },
  { value: 'usurpation', label: "Usurpation d'identité" },
  { value: 'autre', label: 'Autre' },
]

const IDENTITY_DOC_TYPES = [
  { value: 'carte_electeur', label: "Carte d'électeur" },
  { value: 'passeport', label: 'Passeport' },
  { value: 'permis_conduire', label: 'Permis de conduire' },
]

const MARITAL_OPTIONS = [
  'Célibataire',
  'Marié(e)',
  'Divorcé(e)',
  'Veuf / Veuve',
  'Union libre',
  'Autre',
]
const MAX_EVIDENCE_FILES = 8

const emptyIdentity = () => ({
  lastName: '',
  postName: '',
  firstName: '',
  birthPlace: '',
  birthDate: '',
  maritalStatus: '',
  address: '',
  contactEmail: '',
  phoneCountryIso: 'CD',
  phoneNational: '',
  identityDocType: 'carte_electeur',
})

const emptyComplaint = () => ({
  abuseType: 'cyberharcelement',
  description: '',
})

export function Report() {
  const errRef = useRef(null)
  const identityFileRef = useRef(null)
  const evidenceFilesRef = useRef(null)
  const [step, setStep] = useState(1)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [identity, setIdentity] = useState(emptyIdentity)
  const [identityFile, setIdentityFile] = useState(null)
  const [complaint, setComplaint] = useState(emptyComplaint)
  const [evidenceLinks, setEvidenceLinks] = useState('')
  const [evidenceFiles, setEvidenceFiles] = useState([])
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

  function validateStep1() {
    if (isAnonymous) return null
    if (!identity.lastName.trim()) return 'Indiquez votre nom.'
    if (!identity.postName.trim()) return 'Indiquez votre postnom (ou « N/A »).'
    if (!identity.firstName.trim()) return 'Indiquez votre prénom.'
    if (!identity.birthPlace.trim()) return 'Indiquez votre lieu de naissance.'
    if (!identity.birthDate) return 'Indiquez votre date de naissance.'
    if (!identity.maritalStatus) return 'Choisissez votre état civil.'
    if (!identity.address.trim() || identity.address.trim().length < 5) return 'Indiquez votre adresse complète.'
    if (!identity.contactEmail.trim()) return 'Indiquez votre adresse e-mail.'
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identity.contactEmail.trim())
    if (!emailOk) return 'Adresse e-mail invalide.'
    const parsed = parsePhoneNumberFromString(identity.phoneNational.trim(), identity.phoneCountryIso)
    if (!parsed || !parsed.isValid()) return 'Numéro de téléphone invalide pour le pays sélectionné.'
    if (!identityFile) return 'Téléversez une copie de votre pièce d’identité.'
    return null
  }

  function goStep2(e) {
    e.preventDefault()
    setErr(null)
    const v = validateStep1()
    if (v) {
      setErr(v)
      return
    }
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setMsg(null)
    setErr(null)
    const v1 = validateStep1()
    if (v1) {
      setErr(v1)
      setStep(1)
      return
    }
    if (complaint.description.trim().length < 20) {
      setErr('La description doit contenir au moins 20 caractères.')
      return
    }
    if (complaint.description.length > 600) {
      setErr('La description ne doit pas dépasser 600 caractères.')
      return
    }
    if (evidenceFiles.length > MAX_EVIDENCE_FILES) {
      setErr(`Vous pouvez joindre au maximum ${MAX_EVIDENCE_FILES} fichiers de preuves.`)
      return
    }
    const parsed = isAnonymous
      ? parsePhoneNumberFromString(identity.phoneNational.trim(), identity.phoneCountryIso) || null
      : parsePhoneNumberFromString(identity.phoneNational.trim(), identity.phoneCountryIso)
    if (!isAnonymous && (!parsed || !parsed.isValid())) {
      setErr('Numéro de téléphone invalide pour le pays sélectionné.')
      return
    }
    setLoading(true)
    try {
      await fetchCsrf()
      const fd = new FormData()
      fd.append('isAnonymous', String(isAnonymous))
      fd.append('contactEmail', identity.contactEmail.trim())
      fd.append('contactPhone', parsed ? parsed.format('E.164') : '')
      if (!isAnonymous) {
        fd.append('lastName', identity.lastName.trim())
        fd.append('postName', identity.postName.trim())
        fd.append('firstName', identity.firstName.trim())
        fd.append('birthPlace', identity.birthPlace.trim())
        fd.append('birthDate', identity.birthDate)
        fd.append('maritalStatus', identity.maritalStatus)
        fd.append('address', identity.address.trim())
        fd.append('identityDocType', identity.identityDocType)
      }
      fd.append('abuseType', complaint.abuseType)
      fd.append('description', complaint.description.trim())
      if (!isAnonymous && identityFile) fd.append('identityDocument', identityFile)
      if (evidenceLinks.trim()) fd.append('evidenceLinks', evidenceLinks.trim())
      for (const file of evidenceFiles) fd.append('evidenceFiles', file)
      const { data } = await api.post('/api/reports', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setMsg(data.message)
      if (data.reference && data.accessSecret) {
        setCredentials({ reference: data.reference, accessSecret: data.accessSecret })
      }
      setIdentity(emptyIdentity())
      setComplaint(emptyComplaint())
      setIdentityFile(null)
      setEvidenceLinks('')
      setEvidenceFiles([])
      if (identityFileRef.current) identityFileRef.current.value = ''
      if (evidenceFilesRef.current) evidenceFilesRef.current.value = ''
    } catch (ex) {
      const raw = ex.response?.data?.errors
      if (Array.isArray(raw) && raw.length > 0) {
        setErr(raw.map((x) => x.msg || x.message).filter(Boolean).join(' ') || 'Envoi impossible.')
      } else {
        setErr(ex.response?.data?.error || 'Envoi impossible.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Seo
        title="Signalement — Civisme numérique RDC"
        description="Signalement d’abus : identité du plaignant, pièce d’identité, puis description des faits. Traitement réservé au personnel habilité."
      />
      <PageHeader
        title="Signalement d’abus"
        lead="Identité complète et copie de pièce d’identité, puis description des faits. Les signalements peuvent aussi être portés auprès de l’ARPTC selon ses modalités officielles."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <ol className="d-flex gap-3 small text-muted mb-4 list-unstyled flex-wrap">
                  <li className={step === 1 ? 'fw-semibold text-body' : ''}>
                    <span className="badge bg-primary rounded-pill me-1">1</span>
                    Identité & pièce d’identité
                  </li>
                  <li className={step === 2 ? 'fw-semibold text-body' : ''}>
                    <span className="badge bg-primary rounded-pill me-1">2</span>
                    Signalement
                  </li>
                </ol>

                {step === 1 && (
                  <form onSubmit={goStep2} noValidate>
                    <p className="small text-muted mb-3">
                      Choisissez votre situation : si vous n’êtes pas directement concerné(e), vous pouvez effectuer un
                      signalement anonyme sans pièce d’identité.
                    </p>
                    <fieldset className="mb-3">
                      <legend className="form-label">Type de signalement</legend>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="reportMode"
                          id="reportModeNamed"
                          checked={!isAnonymous}
                          onChange={() => setIsAnonymous(false)}
                        />
                        <label className="form-check-label" htmlFor="reportModeNamed">
                          Je suis directement victime / concerné(e)
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="reportMode"
                          id="reportModeAnonymous"
                          checked={isAnonymous}
                          onChange={() => setIsAnonymous(true)}
                        />
                        <label className="form-check-label" htmlFor="reportModeAnonymous">
                          Je signale en tant que témoin et je souhaite rester anonyme
                        </label>
                      </div>
                    </fieldset>
                    {isAnonymous ? (
                      <div className="alert alert-info small" role="note">
                        Mode anonyme activé : les champs d’identité et la pièce d’identité ne sont pas requis. Vous pouvez
                        laisser e-mail et téléphone vides si vous ne souhaitez pas être recontacté(e).
                      </div>
                    ) : (
                      <>
                    <div className="row g-2 mb-3">
                      <div className="col-md-4">
                        <label className="form-label" htmlFor="lastName">
                          Nom
                        </label>
                        <input
                          id="lastName"
                          className="form-control"
                          required
                          value={identity.lastName}
                          onChange={(e) => setIdentity({ ...identity, lastName: e.target.value })}
                          autoComplete="family-name"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label" htmlFor="postName">
                          Postnom
                        </label>
                        <input
                          id="postName"
                          className="form-control"
                          required
                          placeholder="N/A si sans objet"
                          value={identity.postName}
                          onChange={(e) => setIdentity({ ...identity, postName: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label" htmlFor="firstName">
                          Prénom
                        </label>
                        <input
                          id="firstName"
                          className="form-control"
                          required
                          value={identity.firstName}
                          onChange={(e) => setIdentity({ ...identity, firstName: e.target.value })}
                          autoComplete="given-name"
                        />
                      </div>
                    </div>
                    <div className="row g-2 mb-3">
                      <div className="col-md-6">
                        <label className="form-label" htmlFor="birthPlace">
                          Lieu de naissance
                        </label>
                        <input
                          id="birthPlace"
                          className="form-control"
                          required
                          value={identity.birthPlace}
                          onChange={(e) => setIdentity({ ...identity, birthPlace: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label" htmlFor="birthDate">
                          Date de naissance
                        </label>
                        <input
                          id="birthDate"
                          type="date"
                          className="form-control"
                          required
                          value={identity.birthDate}
                          onChange={(e) => setIdentity({ ...identity, birthDate: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="maritalStatus">
                        État civil
                      </label>
                      <select
                        id="maritalStatus"
                        className="form-select"
                        required
                        value={identity.maritalStatus}
                        onChange={(e) => setIdentity({ ...identity, maritalStatus: e.target.value })}
                      >
                        <option value="" disabled>
                          Choisir…
                        </option>
                        {MARITAL_OPTIONS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                      </>
                    )}
                    {!isAnonymous && (
                      <>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="address">
                            Adresse complète
                          </label>
                          <textarea
                            id="address"
                            className="form-control"
                            rows={3}
                            required
                            minLength={5}
                            value={identity.address}
                            onChange={(e) => setIdentity({ ...identity, address: e.target.value })}
                          />
                        </div>
                      </>
                    )}
                    <div className="mb-3">
                      <label className="form-label" htmlFor="contactEmail">
                        E-mail {isAnonymous ? '(optionnel)' : ''}
                      </label>
                      <input
                        type="email"
                        id="contactEmail"
                        className="form-control"
                        autoComplete="email"
                        required={!isAnonymous}
                        value={identity.contactEmail}
                        onChange={(e) => setIdentity({ ...identity, contactEmail: e.target.value })}
                      />
                    </div>
                    <fieldset className="mb-3">
                      <legend className="form-label mb-2">Téléphone {isAnonymous ? '(optionnel)' : ''}</legend>
                      <div className="row g-2">
                        <div className="col-md-5">
                          <label className="form-label small text-muted" htmlFor="phoneCountry">
                            Indicatif pays
                          </label>
                          <select
                            id="phoneCountry"
                            className="form-select"
                            required={!isAnonymous}
                            value={identity.phoneCountryIso}
                            onChange={(e) => setIdentity({ ...identity, phoneCountryIso: e.target.value })}
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
                            className="form-control"
                            autoComplete="tel-national"
                            inputMode="tel"
                            placeholder="Ex. 81 234 5678"
                            required={!isAnonymous}
                            value={identity.phoneNational}
                            onChange={(e) => setIdentity({ ...identity, phoneNational: e.target.value })}
                          />
                        </div>
                      </div>
                    </fieldset>
                    {!isAnonymous && (
                      <>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="identityDocType">
                            Type de pièce d’identité
                          </label>
                          <select
                            id="identityDocType"
                            className="form-select"
                            required
                            value={identity.identityDocType}
                            onChange={(e) => setIdentity({ ...identity, identityDocType: e.target.value })}
                          >
                            {IDENTITY_DOC_TYPES.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="identityDocument">
                            Copie de la pièce d’identité (PDF, image, max 5 Mo)
                          </label>
                          <input
                            ref={identityFileRef}
                            id="identityDocument"
                            type="file"
                            className="form-control"
                            required
                            accept=".pdf,image/*,.doc,.docx"
                            onChange={(e) => setIdentityFile(e.target.files?.[0] || null)}
                          />
                        </div>
                      </>
                    )}
                    {err && step === 1 && (
                      <div
                        ref={errRef}
                        tabIndex={-1}
                        className="alert alert-danger"
                        role="alert"
                      >
                        {err}
                      </div>
                    )}
                    <button type="submit" className="btn btn-primary">
                      Continuer vers le signalement
                    </button>
                  </form>
                )}

                {step === 2 && !msg && (
                  <form onSubmit={onSubmit} noValidate>
                    <p className="small text-muted mb-3">
                      Décrivez les faits signalés (20 à 600 caractères). Vous pouvez revenir à l’étape précédente pour
                      corriger votre identité.
                    </p>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="abuseType">
                        Type d’abus
                      </label>
                      <select
                        id="abuseType"
                        name="abuseType"
                        className="form-select"
                        value={complaint.abuseType}
                        onChange={(e) => setComplaint({ ...complaint, abuseType: e.target.value })}
                        required
                      >
                        {ABUSE_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="description">
                        Description du signalement (20 à 600 caractères)
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        className="form-control"
                        rows={6}
                        value={complaint.description}
                        onChange={(e) => setComplaint({ ...complaint, description: e.target.value })}
                        required
                        minLength={20}
                        maxLength={600}
                        aria-describedby="description-help"
                      />
                      <p id="description-help" className="form-text small text-muted">
                        {complaint.description.length} / 600 caractères
                      </p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="evidenceLinks">
                        Liens de preuves (optionnel)
                      </label>
                      <textarea
                        id="evidenceLinks"
                        className="form-control"
                        rows={3}
                        value={evidenceLinks}
                        onChange={(e) => setEvidenceLinks(e.target.value)}
                        placeholder="Un ou plusieurs liens (http/https), séparés par virgule ou retour à la ligne."
                      />
                      <p className="form-text small text-muted mb-0">
                        Exemples : lien vers une publication, une capture hébergée, une vidéo, un audio, etc.
                      </p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label" htmlFor="evidenceFiles">
                        Fichiers de preuves (optionnel)
                      </label>
                      <input
                        ref={evidenceFilesRef}
                        id="evidenceFiles"
                        type="file"
                        className="form-control"
                        multiple
                        accept=".pdf,.doc,.docx,image/*,video/*,audio/*"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || [])
                          if (files.length > MAX_EVIDENCE_FILES) {
                            setErr(`Vous pouvez joindre au maximum ${MAX_EVIDENCE_FILES} fichiers de preuves.`)
                            setEvidenceFiles(files.slice(0, MAX_EVIDENCE_FILES))
                            return
                          }
                          setErr(null)
                          setEvidenceFiles(files)
                        }}
                      />
                      <p className="form-text small text-muted mb-0">
                        Documents, photos, vidéos, audios (jusqu’à {MAX_EVIDENCE_FILES} fichiers).
                      </p>
                    </div>
                    {err && step === 2 && (
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
                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        disabled={loading}
                        onClick={() => {
                          setErr(null)
                          setStep(1)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                      >
                        ← Retour identité
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        aria-busy={loading}
                      >
                        {loading ? 'Envoi…' : 'Envoyer le signalement'}
                      </button>
                    </div>
                  </form>
                )}

                {step === 2 && msg && (
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
                          <dd className="col-sm-9 font-monospace mb-0 text-break">{credentials.accessSecret}</dd>
                        </dl>
                        <p className="small mb-0">
                          <Link to="/signalement/suivi">Consulter l’état du dossier</Link>
                        </p>
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm mt-3"
                      onClick={() => {
                        setMsg(null)
                        setCredentials(null)
                        setErr(null)
                        setIdentity(emptyIdentity())
                        setIdentityFile(null)
                        setEvidenceLinks('')
                        setEvidenceFiles([])
                        if (identityFileRef.current) identityFileRef.current.value = ''
                        if (evidenceFilesRef.current) evidenceFilesRef.current.value = ''
                        setComplaint(emptyComplaint())
                        setStep(1)
                      }}
                    >
                      Nouveau signalement
                    </button>
                  </div>
                )}
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
