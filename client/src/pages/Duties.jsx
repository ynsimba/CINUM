import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'

export function Duties() {
  return (
    <>
      <Seo
        title="Devoirs numériques — Civisme numérique RDC"
        description="Devoirs des citoyens en ligne : respect d’autrui, vérification des informations et responsabilité lors de la publication de contenus, selon le cadre légal congolais."
      />
      <PageHeader
        title="Devoirs numériques"
        lead="Responsabilités citoyennes et comportement en ligne, dans le respect du cadre légal congolais."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <div className="row">
          <div className="col-lg-8">
            <h2 className="h4">Responsabilités citoyennes</h2>
            <ul>
              <li>Respecter les droits des autres utilisateurs (dignité, non-discrimination) ;</li>
              <li>Ne pas diffuser de contenus illicites ou portant atteinte aux personnes ;</li>
              <li>Vérifier les informations avant de les partager pour limiter la désinformation ;</li>
              <li>Protéger ses identifiants et les équipements confiés dans un cadre professionnel ou scolaire ;</li>
              <li>Signaler de manière honnête les abus via les canaux prévus.</li>
            </ul>
            <h2 className="h4 mt-4">Comportement en ligne</h2>
            <p>
              Un usage responsable du numérique contribue à la sécurité collective : éviter l&apos;escalade des conflits,
              privilégier le dialogue, conserver des preuves en cas de litige et saisir les autorités plutôt que de faire
              justice soi-même.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
