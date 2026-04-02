import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'

export function Rights() {
  return (
    <>
      <Seo
        title="Droits numériques — Civisme numérique RDC"
        description="Synthèse des droits numériques en RDC : vie privée, liberté d’expression, accès — cadre légal dont la loi n° 20/017 sur les télécommunications et les TIC."
      />
      <PageHeader
        title="Droits numériques"
        lead="Synthèse pédagogique fondée sur le respect des lois en vigueur, dont la loi n° 20/017 relative aux télécommunications et aux TIC."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h2 className="h5 text-primary">Droits des majeurs</h2>
                <ul className="small mb-0">
                  <li>
                    <strong>Accès aux services</strong> : dans le cadre défini par les opérateurs et la réglementation, sous
                    réserve du respect des obligations légales.
                  </li>
                  <li>
                    <strong>Vie privée et données</strong> : attentes légitimes de confidentialité ; les traitements doivent
                    respecter les principes de licéité et de sécurité prévus par le droit applicable.
                  </li>
                  <li>
                    <strong>Liberté d&apos;expression</strong> : exercée dans les limites fixées par la Constitution et le
                    droit pénal (interdiction des incitations à la haine, atteinte à l&apos;honneur, etc.).
                  </li>
                  <li>
                    <strong>Recours</strong> : possibilité de saisir les autorités compétentes, dont l&apos;ARPTC pour les
                    missions de régulation qui lui sont dévolues.
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100 border-warning border-2">
              <div className="card-body">
                <h2 className="h5 text-primary">Mineurs</h2>
                <p className="small mb-2">
                  Les mineurs bénéficient d&apos;une protection renforcée. Les parents, tuteurs et établissements scolaires
                  jouent un rôle clé pour encadrer l&apos;usage d&apos;Internet et des téléphones.
                </p>
                <ul className="small mb-0">
                  <li>Information adaptée à l&apos;âge sur les risques en ligne ;</li>
                  <li>Protection contre la sollicitation, l&apos;exposition à des contenus illicites ou graves ;</li>
                  <li>Accompagnement en cas de cyberharcèlement.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <p className="small text-muted mt-4">
          Ce contenu est une vulgarisation ; il ne constitue pas un acte juridique individualisé. Pour toute situation
          concrète, consultez un professionnel du droit ou l&apos;autorité compétente.
        </p>
      </div>
    </>
  )
}
