import { Seo } from '../components/Seo'
import { useState } from 'react'
import { PageHeader } from '../components/PageHeader'
import { api, fetchCsrf } from '../api/client'

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [msg, setMsg] = useState(null)
  const [err, setErr] = useState(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)
    setErr(null)
    try {
      await fetchCsrf()
      const { data } = await api.post('/api/contact', form)
      setMsg(data.message)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (ex) {
      setErr(ex.response?.data?.errors?.[0]?.msg || ex.response?.data?.error || 'Envoi impossible.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Seo
        title="Contact — Civisme numérique RDC"
        description="Coordonnées institutionnelles du portail CINUM, formulaire de contact et réponses aux questions fréquentes."
      />
      <PageHeader title="Contact" lead="Coordonnées institutionnelles, formulaire et questions fréquentes." />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <div className="row g-4">
          <div className="col-lg-5">
            <h2 className="h5 text-primary">Coordonnées (à adapter en production)</h2>
            <address className="small not-italic">
              <p className="mb-1">
                <strong>Service de communication</strong>
              </p>
              <p className="mb-1">Kinshasa, République démocratique du Congo</p>
              <p className="mb-1">
                Courriel : <a href="mailto:contact@cinum-rdc.local">contact@cinum-rdc.local</a>
              </p>
              <p className="mb-0 text-muted">Téléphone : à compléter selon l&apos;entité porteuse.</p>
            </address>
            <hr />
            <h3 className="h6">FAQ</h3>
            <dl className="small">
              <dt className="fw-semibold">Le site remplace-t-il une plainte pénale ?</dt>
              <dd className="mb-2">Non. Il informe et oriente ; les procédures judiciaires suivent les règles du droit congolais.</dd>
              <dt className="fw-semibold">Comment signaler une infraction grave ?</dt>
              <dd>Saisissez les autorités compétentes (forces de l&apos;ordre, parquet) et utilisez le formulaire de signalement si utile.</dd>
            </dl>
          </div>
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h5 mb-3">Formulaire</h2>
                <form onSubmit={onSubmit} noValidate>
                  <div className="row g-2">
                    <div className="col-md-6 mb-2">
                      <label className="form-label" htmlFor="name">
                        Nom
                      </label>
                      <input
                        id="name"
                        className="form-control"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        minLength={2}
                      />
                    </div>
                    <div className="col-md-6 mb-2">
                      <label className="form-label" htmlFor="email">
                        Courriel
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="form-control"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-2">
                    <label className="form-label" htmlFor="subject">
                      Sujet
                    </label>
                    <input
                      id="subject"
                      className="form-control"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      required
                      minLength={3}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="message">
                      Message
                    </label>
                    <textarea
                      id="message"
                      className="form-control"
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                      minLength={10}
                    />
                  </div>
                  {msg && (
                    <div className="alert alert-success" role="status">
                      {msg}
                    </div>
                  )}
                  {err && (
                    <div className="alert alert-danger" role="alert">
                      {err}
                    </div>
                  )}
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Envoi…' : 'Envoyer'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
