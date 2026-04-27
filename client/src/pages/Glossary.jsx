import { useMemo, useState } from 'react'
import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'
import { GLOSSARY_TERMS } from '../data/glossary'

function normalize(text) {
  return String(text || '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
}

export function Glossary() {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const q = normalize(query)
    const sorted = [...GLOSSARY_TERMS].sort((a, b) => a.term.localeCompare(b.term, 'fr'))
    if (!q) return sorted
    return sorted.filter((entry) => normalize(entry.term).includes(q) || normalize(entry.definition).includes(q))
  }, [query])

  return (
    <>
      <Seo
        title="Glossaire — Civisme numérique RDC"
        description="Définitions clés du civisme numérique : sécurité informationnelle, protection des données et résilience citoyenne en RDC."
      />
      <PageHeader
        title="Glossaire"
        lead="Repères pédagogiques pour comprendre les enjeux numériques ; le sens juridique exact relève des textes officiels."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <p className="text-muted small mb-4">
          Comprendre ces notions est essentiel pour bâtir une société plus éclairée, plus responsable et plus sécurisée
          face aux menaces du cyberespace.
        </p>
        <div className="mb-3">
          <label htmlFor="glossary-search" className="form-label">
            Rechercher un terme
          </label>
          <input
            id="glossary-search"
            type="search"
            className="form-control"
            placeholder="Ex. phishing, cybersécurité, données personnelles"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <p className="small text-muted mt-2 mb-0">
            {filtered.length} terme{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
          </p>
        </div>
        {filtered.length > 0 ? (
          <dl className="row g-4">
            {filtered.map((entry) => (
              <div key={entry.term} className="col-12">
                <dt className="h6 mb-2">{entry.term}</dt>
                <dd className="mb-0 text-muted border-start border-3 border-primary ps-3">{entry.definition}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="alert alert-secondary mb-0" role="status">
            Aucun terme ne correspond à votre recherche.
          </div>
        )}
      </div>
    </>
  )
}
