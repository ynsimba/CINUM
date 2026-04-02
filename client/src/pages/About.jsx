import { PageHeader } from '../components/PageHeader'
import { Seo } from '../components/Seo'

export function About() {
  return (
    <>
      <Seo
        title="À propos — Civisme numérique RDC"
        description="Mission et objectifs du portail CINUM : informer sur les droits et devoirs numériques en RDC, sensibiliser aux bonnes pratiques et orienter vers les autorités compétentes."
      />
      <PageHeader
        title="À propos du portail"
        lead="Mission, objectifs et responsabilité institutionnelle (présentation type initiative publique ou para-publique)."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <div className="row">
          <div className="col-lg-8">
            <h2 className="h4">Mission</h2>
            <p>
              Ce portail a pour mission d&apos;informer les citoyens sur leurs droits et devoirs dans l&apos;espace
              numérique, de sensibiliser aux bonnes pratiques, de prévenir les abus (harcèlement, désinformation, fraudes)
              et d&apos;orienter vers les autorités compétentes, en cohérence avec le cadre légal de la République
              démocratique du Congo.
            </p>
            <h2 className="h4 mt-4">Objectifs</h2>
            <ul>
              <li>Faciliter la compréhension des règles applicables aux télécommunications et aux TIC ;</li>
              <li>Promouvoir un usage responsable des réseaux sociaux et des services en ligne ;</li>
              <li>Réduire les risques pour les publics vulnérables, notamment les mineurs ;</li>
              <li>Encourager le signalement structuré des comportements illicites.</li>
            </ul>
            <h2 className="h4 mt-4">Institution responsable</h2>
            <p>
              Le présent site est présenté comme une initiative institutionnelle de référence (État, autorité de
              régulation ou partenaires habilités). L&apos;entité porteuse précise son identité et ses coordonnées sur la
              page <a href="/contact">Contact</a>. En démonstration, les mentions peuvent être adaptées avant mise en
              production.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
