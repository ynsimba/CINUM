import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'

export function Offenses() {
  return (
    <>
      <Seo
        title="Infractions — Civisme numérique RDC"
        description="Vue d’ensemble des infractions liées au numérique en RDC : cyberharcèlement, désinformation, fraude — information pédagogique, qualification par les juridictions compétentes."
      />
      <PageHeader
        title="Infractions et comportements interdits"
        lead="Vue d’ensemble pédagogique ; qualification juridique définitive relevant des juridictions compétentes."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <div className="alert alert-light border mb-4" role="note">
          Dans le contexte actuel, les infractions numériques ne concernent pas uniquement les victimes directes : elles
          peuvent fragiliser la cohésion sociale, la confiance publique et la stabilité des institutions. La prévention
          demeure un axe prioritaire de sécurité collective.
        </div>
        <div className="accordion" id="accOffenses">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#o1">
                Cyberharcèlement
              </button>
            </h2>
            <div id="o1" className="accordion-collapse collapse show" data-bs-parent="#accOffenses">
              <div className="accordion-body small">
                Propos ou comportements répétés visant à intimider, humilier ou menacer via le numérique. Peut engager la
                responsabilité pénale et civile selon les faits constatés (harcèlement moral, menaces, injures, atteinte à
                la vie privée, etc.).
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#o2">
                Désinformation
              </button>
            </h2>
            <div id="o2" className="accordion-collapse collapse" data-bs-parent="#accOffenses">
              <div className="accordion-body small">
                Diffusion volontaire d&apos;informations fausses de nature à troubler l&apos;ordre public ou porter
                atteinte aux personnes peut être sanctionnée lorsque les éléments constitutifs d&apos;infractions prévues
                par le droit national sont réunis.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#o3">
                Fraudes numériques
              </button>
            </h2>
            <div id="o3" className="accordion-collapse collapse" data-bs-parent="#accOffenses">
              <div className="accordion-body small">
                Arnaques en ligne, hameçonnage, usurpation de coordonnées bancaires ou d&apos;identité pour obtenir un
                avantage illicite : sanctions pénales et civiles possibles selon les cas.
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#o4">
                Usurpation d&apos;identité
              </button>
            </h2>
            <div id="o4" className="accordion-collapse collapse" data-bs-parent="#accOffenses">
              <div className="accordion-body small">
                Se faire passer pour une personne ou une institution afin de tromper des tiers peut constituer plusieurs
                infractions selon les circonstances (faux, escroquerie, atteinte à l&apos;image, etc.).
              </div>
            </div>
          </div>
        </div>
        <p className="small text-muted mt-4 mb-0">
          Approche recommandée : <strong>former pour prévenir</strong>, <strong>encadrer pour orienter</strong> et{' '}
          <strong>protéger pour sécuriser</strong>, afin de réduire l&apos;exposition des citoyens et des organisations
          aux menaces numériques.
        </p>
      </div>
    </>
  )
}
