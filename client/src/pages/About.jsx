import { PageHeader } from '../components/PageHeader'
import { Seo } from '../components/Seo'

export function About() {
  return (
    <>
      <Seo
        title="À propos — Civisme numérique RDC"
        description="Mission et objectifs du portail CINUM : informer sur les droits et devoirs numériques en RDC, sensibiliser aux bonnes pratiques et orienter vers les autorités compétentes."
      />
      <PageHeader
        title="À propos du portail"
        lead="Vision stratégique, mission et orientation institutionnelle du civisme numérique en République démocratique du Congo."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <div className="row">
          <div className="col-lg-8">
            <h2 className="h4">Contexte stratégique</h2>
            <p>
              La République Démocratique du Congo fait aujourd&apos;hui face à une mutation profonde des menaces qui
              pèsent sur sa stabilité sociale, économique et sécuritaire. Certaines de ces menaces sont visibles et
              tangibles ; d&apos;autres, plus insidieuses, évoluent dans un espace immatériel mais tout aussi dangereux :
              le cyberespace.
            </p>
            <p>
              Dans cet environnement numérique en constante expansion, les enfants, la jeunesse, les institutions et les
              structures économiques sont exposés quotidiennement à des risques multiples : manipulation de
              l&apos;information, criminalité numérique, atteintes à la dignité humaine et fragilisation du tissu social.
            </p>
            <h2 className="h4 mt-4">Approche adoptée</h2>
            <p>
              Face à cette réalité, une réponse uniquement répressive ne saurait suffire. Le portail promeut une
              approche globale, anticipative et durable, articulée autour de trois axes fondamentaux :
            </p>
            <ul>
              <li>Former pour prévenir ;</li>
              <li>Encadrer pour orienter ;</li>
              <li>Protéger pour sécuriser.</li>
            </ul>
            <p>
              L&apos;éducation au civisme numérique doit ainsi être considérée non comme une option, mais comme un levier
              stratégique de souveraineté nationale.
            </p>
            <h2 className="h4 mt-4">Pourquoi le civisme numérique est décisif</h2>
            <p>Un citoyen numériquement éduqué est un citoyen :</p>
            <ul>
              <li>plus conscient des enjeux informationnels et technologiques ;</li>
              <li>plus responsable dans ses interactions numériques ;</li>
              <li>plus résilient face aux tentatives de manipulation et de fraude ;</li>
              <li>moins vulnérable aux menaces cybercriminelles ;</li>
              <li>plus engagé dans la préservation des valeurs républicaines.</li>
            </ul>
            <p>
              À l&apos;inverse, l&apos;absence de culture numérique structurée constitue une faille stratégique susceptible
              d&apos;être exploitée par des acteurs malveillants, internes comme externes.
            </p>
            <p>
              Il ne s&apos;agit donc plus seulement d&apos;un enjeu éducatif. Il s&apos;agit d&apos;un enjeu de sécurité nationale, de
              cohésion sociale et de développement durable.
            </p>
            <h2 className="h4 mt-4">Institution responsable</h2>
            <p>
              Le présent site est présenté comme une initiative institutionnelle de référence (État, autorité de
              régulation ou partenaires habilités). L&apos;entité porteuse précise son identité et ses coordonnées sur la
              page <a href="/contact">Contact</a>. En démonstration, les mentions peuvent être adaptées avant mise en
              production.
            </p>
            <h2 className="h4 mt-4">Orientation de politique publique</h2>
            <p>
              Investir dans le civisme numérique aujourd&apos;hui, c&apos;est garantir une société plus stable demain.
              Éduquer la jeunesse au numérique, c&apos;est protéger l&apos;avenir de la Nation.
            </p>
            <p className="mb-0">
              En définitive, le civisme numérique doit être érigé en pilier fondamental des politiques publiques, au
              même titre que l&apos;éducation civique traditionnelle, afin de bâtir une société congolaise plus éclairée,
              plus responsable, plus sécurisée et pleinement adaptée aux défis du XXIe siècle.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
