import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'
import { FAQ_THEMES } from '../data/faq'

export function Faq() {
  return (
    <>
      <Seo
        title="FAQ — Civisme numérique RDC"
        description="Questions fréquentes par thème : droits numériques, signalement et ARPTC."
      />
      <PageHeader
        title="Foire aux questions"
        lead="Réponses d’orientation ; elles ne remplacent pas un avis juridique personnalisé."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
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
