import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'
import { GLOSSARY_TERMS } from '../data/glossary'

export function Glossary() {
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
        <dl className="row g-4">
          {GLOSSARY_TERMS.map((entry) => (
            <div key={entry.term} className="col-12">
              <dt className="h6 mb-2">{entry.term}</dt>
              <dd className="mb-0 text-muted border-start border-3 border-primary ps-3">{entry.definition}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  )
}
