import { useMemo, useState } from 'react'
import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'
import { FAQ_THEMES } from '../data/faq'

function normalize(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
}

export function Faq() {
  const [query, setQuery] = useState('')
  const filteredThemes = useMemo(() => {
    const q = normalize(query)
    if (!q) return FAQ_THEMES
    return FAQ_THEMES.map((theme) => ({
      ...theme,
      items: theme.items.filter((item) => normalize(item.q).includes(q) || normalize(item.a).includes(q)),
    })).filter((theme) => theme.items.length > 0)
  }, [query])

  const totalMatches = filteredThemes.reduce((n, t) => n + t.items.length, 0)

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
        <div className="mb-4">
          <label htmlFor="faq-search" className="form-label">
            Rechercher dans la FAQ
          </label>
          <input
            id="faq-search"
            type="search"
            className="form-control"
            placeholder="Ex. signalement anonyme, phishing, ARPTC, délais..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <p className="small text-muted mt-2 mb-0">
            {totalMatches} question{totalMatches > 1 ? 's' : ''} trouvée{totalMatches > 1 ? 's' : ''}
          </p>
        </div>
        {filteredThemes.length === 0 && (
          <div className="alert alert-secondary mb-4" role="status">
            Aucun résultat pour cette recherche.
          </div>
        )}
        {filteredThemes.map((theme) => (
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
