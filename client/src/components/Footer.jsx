import { Link } from 'react-router-dom'
import { ScrollReveal } from './ScrollReveal'

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="cinum-footer mt-auto" role="contentinfo">
      <div className="cinum-footer-accent" aria-hidden="true" />

      <div className="cinum-footer-main">
        <ScrollReveal className="container px-3 px-sm-4 py-4 py-lg-5" variant="fade-up">
          <div className="row g-4 g-lg-5">
            <div className="col-12 col-lg-4 col-md-6">
              <div className="pe-lg-3">
                <p className="cinum-footer-brand-title mb-2">CINUM</p>
                <p className="text-secondary small mb-3 mb-lg-4 lh-base">
                  Portail national de sensibilisation au civisme numérique en République démocratique du Congo.
                  Information publique, références au cadre légal (loi n° 20/017, droit pénal) et orientation vers les
                  autorités compétentes.
                </p>
                <p className="small text-muted mb-0 fst-italic">
                  Contenu à vocation pédagogique — ne remplace pas un avis juridique personnalisé.
                </p>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3 col-lg-2">
              <nav aria-labelledby="footer-landmark-portail">
                <p id="footer-landmark-portail" className="cinum-footer-heading">
                  Le portail
                </p>
                <ul className="list-unstyled small mb-0 cinum-footer-links">
                  <li>
                    <Link to="/a-propos">À propos</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact</Link>
                  </li>
                  <li>
                    <Link to="/signalement">Signalement</Link>
                  </li>
                  <li>
                    <Link to="/signalement/suivi">Suivi d’un signalement</Link>
                  </li>
                  <li>
                    <Link to="/actualites">Actualités</Link>
                  </li>
                  <li>
                    <Link to="/confidentialite">Confidentialité</Link>
                  </li>
                  <li>
                    <Link to="/mentions-legales">Mentions légales</Link>
                  </li>
                  <li>
                    <Link to="/faq">FAQ</Link>
                  </li>
                  <li>
                    <Link to="/glossaire">Glossaire</Link>
                  </li>
                  <li>
                    <Link to="/presse">Espace presse</Link>
                  </li>
                  <li>
                    <Link to="/rapports-activite">Rapports d’activité</Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="col-12 col-sm-6 col-md-3 col-lg-2">
              <nav aria-labelledby="footer-landmark-rubriques">
                <p id="footer-landmark-rubriques" className="cinum-footer-heading">
                  Rubriques
                </p>
                <ul className="list-unstyled small mb-0 cinum-footer-links">
                  <li>
                    <Link to="/droits">Droits numériques</Link>
                  </li>
                  <li>
                    <Link to="/devoirs">Devoirs numériques</Link>
                  </li>
                  <li>
                    <Link to="/infractions">Infractions</Link>
                  </li>
                  <li>
                    <Link to="/bonnes-pratiques">Bonnes pratiques</Link>
                  </li>
                  <li>
                    <Link to="/espace-educatif">Espace éducatif</Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="col-12 col-lg-4">
              <p className="cinum-footer-heading">Autorités & recours</p>
              <p className="small text-secondary mb-3 lh-base">
                Pour les missions de régulation des télécommunications et des TIC, les usagers peuvent s&apos;informer
                auprès de l&apos;
                <strong>Autorité de Régulation de la Poste et des Télécommunications du Congo (ARPTC)</strong> selon les
                canaux officiels publiés par cette institution.
              </p>
              <p className="small text-muted mb-0">
                <span className="d-block mb-1">
                  <strong className="text-body">Contact général (à adapter)</strong>
                </span>
                <a
                  href="mailto:contact@cinum-rdc.local"
                  className="cinum-footer-inline-link text-break d-inline-block"
                >
                  contact@cinum-rdc.local
                </a>
                <span className="d-block mt-2">
                  République démocratique du Congo — {year}
                </span>
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="cinum-footer-bottom">
        <ScrollReveal className="container" variant="fade">
          <div className="cinum-footer-bottom-bar px-1 px-sm-0 py-3 py-md-4 text-center">
            <p className="cinum-footer-bottom-text mb-0">
              © {year} CINUM — Portail du civisme numérique (RDC). Tous droits réservés sur les contenus éditoriaux du
              portail.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  )
}
