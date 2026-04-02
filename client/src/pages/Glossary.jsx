import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'
import { GLOSSARY_TERMS } from '../data/glossary'

export function Glossary() {
  return (
    <>
      <Seo
        title="Glossaire — Civisme numérique RDC"
        description="Définitions des principaux termes liés aux TIC, aux données personnelles et au cyberharcèlement."
      />
      <PageHeader
        title="Glossaire"
        lead="Définitions pédagogiques ; le sens juridique exact relève du droit applicable et des textes officiels."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
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
