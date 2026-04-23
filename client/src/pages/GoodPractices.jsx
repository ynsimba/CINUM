import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'

const PRACTICE_SECTIONS = [
  {
    id: 'prevent',
    title: 'Former pour prévenir',
    items: [
      'Développer l’esprit critique avant de partager une information ;',
      'Sensibiliser les jeunes aux risques de manipulation, de fraude et de cyberharcèlement ;',
      'Former à l’identification des sources fiables et des contenus trompeurs.',
    ],
  },
  {
    id: 'guide',
    title: 'Encadrer pour orienter',
    items: [
      'Encourager un usage responsable et respectueux des plateformes numériques ;',
      'Promouvoir des règles claires de conduite pour les élèves, familles et communautés ;',
      'Orienter rapidement vers les mécanismes de signalement et d’accompagnement.',
    ],
  },
  {
    id: 'protect',
    title: 'Protéger pour sécuriser',
    items: [
      "Utiliser des mots de passe forts, uniques et l'authentification à deux facteurs ;",
      'Mettre à jour régulièrement appareils et applications ;',
      'Signaler sans délai les contenus graves aux plateformes et aux autorités compétentes.',
    ],
  },
]

export function GoodPractices() {
  return (
    <>
      <Seo
        title="Bonnes pratiques — Civisme numérique RDC"
        description="Bonnes pratiques du civisme numérique en RDC : former pour prévenir, encadrer pour orienter et protéger pour sécuriser."
      />
      <PageHeader
        title="Bonnes pratiques"
        lead="Mesures prioritaires pour renforcer la résilience citoyenne et protéger la Nation dans le cyberespace."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5" aria-label="Conseils de bonnes pratiques numériques">
        <p className="text-muted mb-4">
          Investir dans le civisme numérique aujourd&apos;hui, c&apos;est garantir une société congolaise plus éclairée, plus
          responsable et plus sécurisée demain.
        </p>
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
