import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'
import { FAQ_THEMES } from '../data/faq'

export function Faq() {
  return (
    <>
      <Seo
        title="FAQ — Civisme numérique RDC"
        description="Questions fréquentes sur les droits numériques, le signalement et la prévention, dans une approche de sécurité nationale et de cohésion sociale."
      />
      <PageHeader
        title="Foire aux questions"
        lead="Réponses d’orientation dans une logique de prévention, d’encadrement et de protection ; elles ne remplacent pas un avis juridique personnalisé."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <div className="alert alert-light border mb-4" role="note">
          Le civisme numérique est traité comme un enjeu stratégique : renforcer les capacités citoyennes pour prévenir
          les risques, orienter les usages et protéger durablement la société.
        </div>
        {FAQ_THEMES.map((theme) => (
          <section key={theme.id} className="mb-5" aria-labelledby={`faq-${theme.id}`}>
            <h2 id={`faq-${theme.id}`} className="h4 text-primary mb-3">
              {theme.title}
            </h2>
            <div className="accordion" id={`accordion-${theme.id}`}>
              {theme.items.map((item, i) => {
                const collapseId = `faq-${theme.id}-${i}`
                const btnId = `faq-btn-${collapseId}`
                return (
                  <div key={collapseId} className="accordion-item">
                    <h3 className="accordion-header">
                      <button
                        id={btnId}
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${collapseId}`}
                        aria-expanded="false"
                        aria-controls={collapseId}
                      >
                        {item.q}
                      </button>
                    </h3>
                    <div
                      id={collapseId}
                      className="accordion-collapse collapse"
                      data-bs-parent={`#accordion-${theme.id}`}
                      role="region"
                      aria-labelledby={btnId}
                    >
                      <div className="accordion-body">{item.a}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
