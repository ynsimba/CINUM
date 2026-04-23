import { Link } from 'react-router-dom'
import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'

export function Press() {
  return (
    <>
      <Seo
        title="Espace presse — Civisme numérique RDC"
        description="Communiqués, prises de parole institutionnelles et ressources presse autour du civisme numérique comme enjeu de souveraineté nationale."
      />
      <PageHeader
        title="Espace presse"
        lead="Communiqués et publications sur le civisme numérique, la cohésion sociale et la sécurité de l’espace informationnel."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <div className="alert alert-light border mb-4">
          Le portail CINUM défend une approche stratégique : <strong>former pour prévenir</strong>,{' '}
          <strong>encadrer pour orienter</strong> et <strong>protéger pour sécuriser</strong>, afin de renforcer la
          résilience nationale face aux menaces du cyberespace.
        </div>
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h2 className="h5">Communiqués et dossiers</h2>
                <p className="small text-muted">
                  Les communiqués officiels, notes d&apos;orientation et brèves institutionnelles sont publiés dans la
                  rubrique actualités.
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
                <h2 className="h5">Contact presse</h2>
                <address className="small not-italic mb-0">
                  <p className="mb-2">
                    <strong>Service de communication</strong>
                  </p>
                  <p className="mb-1">
                    Courriel :{' '}
                    <a href="mailto:presse@cinum-rdc.local">presse@cinum-rdc.local</a>
                  </p>
                  <p className="text-muted mb-0">
                    Pour toute demande média liée aux enjeux de civisme numérique, de prévention et de protection en
                    ligne.
                  </p>
                </address>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
