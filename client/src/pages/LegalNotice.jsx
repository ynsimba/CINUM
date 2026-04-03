import { Seo } from '../components/Seo'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { CONTACT_EMAIL } from '../config/contact'

export function LegalNotice() {
  return (
    <>
      <Seo
        title="Mentions légales — Civisme numérique RDC"
        description="Éditeur du site, directeur de publication, hébergement et propriété intellectuelle du portail civisme numérique RDC."
      />
      <PageHeader
        title="Mentions légales"
        lead="Identification de l’éditeur, hébergement et informations réglementaires du portail."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <div className="row">
          <div className="col-lg-9">
            <p className="small text-muted mb-4">
              Les mentions ci-dessous sont des <strong>modèles à compléter</strong> par l’entité porteuse avant mise en
              ligne officielle.
            </p>

            <h2 className="h5 text-primary">Éditeur du site</h2>
            <p>
              <strong>Dénomination :</strong> [Nom officiel de l’entité porteuse du portail CINUM]
              <br />
              <strong>Forme juridique :</strong> [ex. service de l’État, établissement public, institution, etc.]
              <br />
              <strong>Siège social :</strong> [Adresse complète — ville, République démocratique du Congo]
              <br />
              <strong>Représentant légal :</strong> [Titre et nom du responsable habilité]
              <br />
              <strong>Contact :</strong>{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> — voir aussi la page{' '}
              <Link to="/contact">Contact</Link>.
            </p>

            <h2 className="h5 text-primary mt-4">Directeur de la publication</h2>
            <p>[Nom, qualité — conformément aux usages de l’administration ou de l’organisme concerné.]</p>

            <h2 className="h5 text-primary mt-4">Hébergement</h2>
            <p>
              <strong>Hébergeur :</strong> [Nom de l’hébergeur]
              <br />
              <strong>Adresse :</strong> [Adresse postale de l’hébergeur]
              <br />
              <strong>Site web :</strong> [URL]
              <br />
              Le stockage des contenus éditoriaux et des données techniques relève de l’infrastructure précisée dans le
              contrat d’hébergement et du cadre de sous-traitance éventuellement applicable.
            </p>

            <h2 className="h5 text-primary mt-4">Propriété intellectuelle</h2>
            <p>
              Les contenus originaux du portail (textes, charte graphique, éléments rédactionnels) sont protégés par le
              droit d’auteur et le droit applicable en RDC. Toute reproduction ou représentation non autorisée est
              interdite sauf mention expresse ou cadre légal (citation courte, usage pédagogique, etc.).
            </p>

            <h2 className="h5 text-primary mt-4">Limitation de responsabilité</h2>
            <p>
              Les informations publiées le sont à titre pédagogique et d’orientation ; elles ne constituent pas un avis
              juridique personnalisé. L’éditeur s’efforce d’assurer l’exactitude des contenus mais ne saurait être tenu
              responsable d’une erreur ou d’une omission. Les liens externes sont fournis pour faciliter la recherche ;
              leur contenu relève de la seule responsabilité des sites tiers.
            </p>

            <h2 className="h5 text-primary mt-4">Données personnelles</h2>
            <p>
              Le traitement des données collectées via les formulaires est décrit dans la{' '}
              <Link to="/confidentialite">politique de confidentialité</Link>.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
