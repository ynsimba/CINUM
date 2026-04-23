import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'

export function Sanctions() {
  return (
    <>
      <Seo
        title="Sanctions légales — Civisme numérique RDC"
        description="Sanctions et cadre pénal applicable aux infractions numériques en République démocratique du Congo — présentation pédagogique, pas un avis juridique personnalisé."
      />
      <PageHeader
        title="Sanctions légales"
        lead="Présentation pédagogique à partir du Code pénal congolais et du droit applicable ; les juges apprécient les faits au cas par cas."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <div className="alert alert-light border-0 mb-3" role="note">
          Les sanctions participent à la protection de l&apos;ordre public numérique, mais elles s&apos;inscrivent dans
          une stratégie plus large de prévention, d&apos;orientation et de résilience citoyenne.
        </div>
        <div className="alert alert-warning border-0" role="note">
          <strong>Important.</strong> Les peines varient selon la qualification des faits, la gravité et la récidive. Seules
          les décisions de justice ou les actes d&apos;autorité font foi. Les exemples ci-dessous sont simplifiés à des fins
          d&apos;information générale.
        </div>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h6 text-primary">Atteintes aux personnes et à la réputation</h2>
                <p className="small mb-0">
                  Des infractions telles que les injures, diffamations, menaces ou atteintes à la vie privée peuvent être
                  réprimées par le Code pénal congolais lorsque les éléments légaux sont réunis, y compris lorsque les actes
                  sont commis par voie numérique.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h6 text-primary">Escroquerie et abus de confiance</h2>
                <p className="small mb-0">
                  Les fraudes commises en ligne peuvent tomber sous le coup de dispositions réprimant l&apos;escroquerie ou
                  d&apos;autres infractions patrimoniales, selon les constatations judiciaires.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h6 text-primary">Atteinte aux systèmes et données</h2>
                <p className="small mb-0">
                  L&apos;accès frauduleux, l&apos;altération ou la perturbation de systèmes informatiques peut engager des
                  sanctions pénales lorsque le droit positif est satisfait, en cohérence avec les textes sur les TIC et le
                  droit pénal général.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h2 className="h6 text-primary">Mineurs</h2>
                <p className="small mb-0">
                  Certaines conduites à l&apos;égard des mineurs font l&apos;objet d&apos;une répression renforcée ; la
                  protection de l&apos;enfance prime dans l&apos;appréciation des faits.
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="small text-muted mt-4 mb-0">
          En pratique, la réponse institutionnelle combine la sanction des faits avérés avec des actions de civisme
          numérique pour renforcer durablement la sécurité nationale et la cohésion sociale.
        </p>
      </div>
    </>
  )
}
