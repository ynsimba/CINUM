import { Seo } from '../components/Seo'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'

export function PrivacyPolicy() {
  return (
    <>
      <Seo
        title="Politique de confidentialité — Civisme numérique RDC"
        description="Finalités, durées de conservation, droits et sécurité des données personnelles collectées via les formulaires et signalements du portail CINUM."
      />
      <PageHeader
        title="Politique de confidentialité"
        lead="Cadre du traitement des données à caractère personnel sur ce portail (information, formulaires, signalements)."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <div className="row">
          <div className="col-lg-9">
            <p className="small text-muted mb-4">
              Document type à adapter par l’entité porteuse avant mise en production (validation juridique recommandée).
            </p>

            <h2 className="h5 text-primary">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données collectées via le présent site est{' '}
              <strong>l’entité porteuse du portail CINUM</strong> (identité et coordonnées détaillées :{' '}
              <Link to="/mentions-legales">mentions légales</Link> et <Link to="/contact">contact</Link>). Les
              traitements sont mis en œuvre pour les finalités indiquées ci-dessous, dans le respect du cadre applicable
              en République démocratique du Congo et des principes de loyauté, de transparence et de sécurité.
            </p>

            <h2 className="h5 text-primary mt-4">2. Données collectées et finalités</h2>
            <ul>
              <li>
                <strong>Navigation et mesures techniques</strong> : journaux serveur (adresse IP, horodatage, pages
                consultées) pour la sécurité du service, la lutte contre les abus et le diagnostic technique.
              </li>
              <li>
                <strong>Formulaire de contact</strong> : nom, adresse électronique, objet et message — pour répondre à
                votre demande et assurer le suivi de la relation correspondante.
              </li>
              <li>
                <strong>Formulaire de signalement d’abus</strong> : type d’abus, description du fait, adresse e-mail,
                numéro de téléphone (format international), et <strong>fichiers joints</strong> (pièces justificatives)
                — pour enregistrer le signalement, permettre son instruction par les personnes habilitées, et le cas
                échéant transmettre les éléments aux autorités compétentes (notamment dans le cadre des missions de type
                régulateur ou répression des infractions, selon les procédures en vigueur).
              </li>
              <li>
                <strong>Comptes d’administration</strong> (personnel autorisé uniquement) : identifiants et journaux de
                connexion pour la gestion des contenus et des dossiers.
              </li>
            </ul>

            <h2 className="h5 text-primary mt-4">3. Base légale et intérêt du service</h2>
            <p>
              Les traitements reposent notamment sur l’exécution de mesures précontractuelles ou contractuelles à votre
              demande (réponse aux messages), l’exécution d’une mission d’intérêt public ou relevant de l’exercice de
              l’autorité publique (information citoyenne, traitement structuré des signalements), et la sécurité du
              dispositif. Les signalements peuvent contenir des données sensibles dans le sens où ils décrivent des faits
              ; le caractère volontaire de votre dépôt et la nécessité du traitement pour traiter le dossier en
              constituent le cadre.
            </p>

            <h2 className="h5 text-primary mt-4">4. Durées de conservation (indicatif)</h2>
            <ul>
              <li>
                <strong>Messages de contact</strong> : durée nécessaire au traitement de la demande, puis archivage
                limité en fonction des obligations légales (souvent de l’ordre de quelques années pour la
                correspondance administrative, sauf obligation contraire).
              </li>
              <li>
                <strong>Signalements</strong> : conservation pendant la durée d’instruction du dossier et au-delà selon
                les obligations légales applicables aux archives publiques ou à la preuve en cas de procédure ; les
                pièces jointes sont conservées avec le dossier dans des conditions sécurisées.
              </li>
              <li>
                <strong>Journaux techniques</strong> : durée limitée (souvent quelques mois), sauf conservation
                allongée en cas d’incident de sécurité avéré.
              </li>
            </ul>
            <p className="small text-muted">
              Les durées définitives doivent être fixées par la politique d’archivage de l’entité porteuse et précisées
              dans une version finale de ce document.
            </p>

            <h2 className="h5 text-primary mt-4">5. Destinataires</h2>
            <p>
              Les données sont destinées au personnel habilité de l’entité porteuse et, le cas échéant, aux autorités
              publiques compétentes (par exemple autorité de régulation des télécommunications / TIC, forces de l’ordre,
              justice) lorsque la transmission est légalement fondée ou nécessaire au traitement du signalement. Aucune
              vente de données à des tiers à des fins commerciales n’est effectuée.
            </p>

            <h2 className="h5 text-primary mt-4">6. Vos droits</h2>
            <p>
              Conformément au cadre applicable, vous pouvez exercer vos droits d’accès, de rectification, de suppression
              ou d’opposition dans les limites prévues par la loi (certains traitements liés à des missions publiques ou
              à la constatation d’infractions pouvant faire l’objet de restrictions). Pour toute demande : adresse
              indiquée sur la page <Link to="/contact">Contact</Link>, en joignant un justificatif d’identité si nécessaire.
            </p>

            <h2 className="h5 text-primary mt-4">7. Sécurité</h2>
            <p>
              Le site met en œuvre des mesures techniques et organisationnelles appropriées : connexions sécurisées (HTTPS
              en production), contrôle d’accès aux interfaces d’administration, limitation du débit des API, protection
              contre les falsifications de requêtes (CSRF) sur les formulaires, validation des fichiers déposés. Aucun
              système n’étant infaillible, en cas d’incident affectant vos données, une notification pourra être faite
              selon les obligations en vigueur.
            </p>

            <h2 className="h5 text-primary mt-4">8. Contact pour les données personnelles</h2>
            <p>
              Pour toute question relative à la présente politique ou à vos droits : utilisez les coordonnées publiées
              sur <Link to="/contact">Contact</Link> en précisant « Données personnelles » dans l’objet.
            </p>

            <p className="small text-muted mt-4 mb-0">
              Dernière mise à jour indicative : avril 2026.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
