import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'

export function Press() {
  return (
    <>
      <Seo
        title="Espace presse — Civisme numérique RDC"
        description="Contacts presse et accès aux communiqués et publications officielles du portail."
      />
      <PageHeader
        title="Espace presse"
        lead="Communiqués et publications : consultez les actualités du portail. Les coordonnées presse sont à adapter."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h2 className="h5">Communiqués et dossiers</h2>
                <p className="small text-muted">
                  Les communiqués officiels et brèves institutionnelles sont publiés dans la rubrique actualités.
                </p>
                <Link className="btn btn-primary btn-sm" to="/actualites">
                  Voir les actualités
                </Link>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h2 className="h5">Contact presse (à adapter)</h2>
                <address className="small not-italic mb-0">
                  <p className="mb-2">
                    <strong>Service de communication</strong>
                  </p>
                  <p className="mb-1">
                    Courriel :{' '}
                    <a href="mailto:presse@cinum-rdc.local">presse@cinum-rdc.local</a>
                  </p>
                  <p className="text-muted mb-0">Remplacez par l’adresse officielle de l’entité porteuse.</p>
                </address>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
