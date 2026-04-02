import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'

export function GoodPractices() {
  return (
    <>
      <Seo
        title="Bonnes pratiques — Civisme numérique RDC"
        description="Conseils pour un usage sûr d’Internet et des réseaux sociaux : mots de passe, confidentialité, vérification des sources — portail civisme numérique RDC."
      />
      <PageHeader
        title="Bonnes pratiques"
        lead="Sécurité numérique, protection des données et comportement responsable."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <div className="row g-4">
          <div className="col-lg-4">
            <h2 className="h5 text-primary">Sécurité</h2>
            <ul className="small">
              <li>Mots de passe longs et uniques ; activation de l&apos;authentification à deux facteurs lorsque possible ;</li>
              <li>Mises à jour régulières des systèmes et applications ;</li>
              <li>Méfiance envers les pièces jointes et liens inattendus.</li>
            </ul>
          </div>
          <div className="col-lg-4">
            <h2 className="h5 text-primary">Données personnelles</h2>
            <ul className="small">
              <li>Limiter la diffusion d&apos;informations sensibles ;</li>
              <li>Lire les politiques de confidentialité des services utilisés ;</li>
              <li>Demander le retrait de contenus illicites par les voies prévues.</li>
            </ul>
          </div>
          <div className="col-lg-4">
            <h2 className="h5 text-primary">Responsabilité</h2>
            <ul className="small">
              <li>Recouper les sources avant de relayer une information ;</li>
              <li>Signaler les contenus graves aux plateformes et aux autorités ;</li>
              <li>Préserver un débat respectueux, y compris en cas de désaccord.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
