import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'

const PRACTICE_SECTIONS = [
  {
    id: 'security',
    title: 'Sécurité',
    items: [
      "Mots de passe longs et uniques ; activation de l'authentification à deux facteurs lorsque possible ;",
      'Mises à jour régulières des systèmes et applications ;',
      'Méfiance envers les pièces jointes et liens inattendus.',
    ],
  },
  {
    id: 'personal-data',
    title: 'Données personnelles',
    items: [
      "Limiter la diffusion d'informations sensibles ;",
      'Lire les politiques de confidentialité des services utilisés ;',
      'Demander le retrait de contenus illicites par les voies prévues.',
    ],
  },
  {
    id: 'responsibility',
    title: 'Responsabilité',
    items: [
      'Recouper les sources avant de relayer une information ;',
      'Signaler les contenus graves aux plateformes et aux autorités ;',
      'Préserver un débat respectueux, y compris en cas de désaccord.',
    ],
  },
]

export function GoodPractices() {
  return (
    <>
      <Seo
        title="Bonnes pratiques — Civisme numérique RDC"
        description="Conseils pour un usage sûr d’Internet et des réseaux sociaux : mots de passe, confidentialité, vérification des sources — portail civisme numérique RDC."
      />
      <PageHeader
        title="Bonnes pratiques"
        lead="Sécurité numérique, protection des données et comportement responsable."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5" aria-label="Conseils de bonnes pratiques numériques">
        <div className="row g-4">
          {PRACTICE_SECTIONS.map((section) => (
            <section key={section.id} className="col-lg-4">
              <article className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h2 className="h5 text-primary">{section.title}</h2>
                  <ul className="small mb-0">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </section>
          ))}
        </div>
      </div>
    </>
  )
}
