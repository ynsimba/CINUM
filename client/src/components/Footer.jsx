import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ScrollReveal } from './ScrollReveal'
import { CONTACT_EMAIL, CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL } from '../config/contact'

const year = new Date().getFullYear()

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="cinum-footer mt-auto" role="contentinfo">
      <div className="cinum-footer-accent" aria-hidden="true" />

      <div className="cinum-footer-main">
        <ScrollReveal className="container px-3 px-sm-4 py-4 py-lg-5" variant="fade-up">
          <div className="row g-4 g-lg-5">
            <div className="col-12 col-lg-4 col-md-6">
              <div className="pe-lg-3">
                <p className="cinum-footer-brand-title mb-2">CINUM</p>
                <p className="text-secondary small mb-3 mb-lg-4 lh-base">{t('footer.brand_intro')}</p>
                <p className="small text-muted mb-0 fst-italic">{t('footer.brand_disclaimer')}</p>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3 col-lg-2">
              <nav aria-labelledby="footer-landmark-portail">
                <p id="footer-landmark-portail" className="cinum-footer-heading">
                  {t('footer.col_portal')}
                </p>
                <ul className="list-unstyled small mb-0 cinum-footer-links">
                  <li>
                    <Link to="/a-propos">{t('nav.about')}</Link>
                  </li>
                  <li>
                    <Link to="/contact">{t('nav.contact')}</Link>
                  </li>
                  <li>
                    <Link to="/signalement">{t('footer.report_short')}</Link>
                  </li>
                  <li>
                    <Link to="/signalement/suivi">{t('home.track_report')}</Link>
                  </li>
                  <li>
                    <Link to="/actualites">{t('nav.news')}</Link>
                  </li>
                  <li>
                    <Link to="/confidentialite">{t('home.link_privacy')}</Link>
                  </li>
                  <li>
                    <Link to="/mentions-legales">{t('home.link_legal')}</Link>
                  </li>
                  <li>
                    <Link to="/code-du-numerique">{t('nav.digital_code')}</Link>
                  </li>
                  <li>
                    <Link to="/faq">{t('nav.faq')}</Link>
                  </li>
                  <li>
                    <Link to="/glossaire">{t('nav.glossary')}</Link>
                  </li>
                  <li>
                    <Link to="/presse">{t('nav.press')}</Link>
                  </li>
                  <li>
                    <Link to="/rapports-activite">{t('nav.activity_reports')}</Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="col-12 col-sm-6 col-md-3 col-lg-2">
              <nav aria-labelledby="footer-landmark-rubriques">
                <p id="footer-landmark-rubriques" className="cinum-footer-heading">
                  {t('footer.col_topics')}
                </p>
                <ul className="list-unstyled small mb-0 cinum-footer-links">
                  <li>
                    <Link to="/droits">{t('nav.rights')}</Link>
                  </li>
                  <li>
                    <Link to="/devoirs">{t('nav.duties')}</Link>
                  </li>
                  <li>
                    <Link to="/infractions">{t('nav.offenses')}</Link>
                  </li>
                  <li>
                    <Link to="/bonnes-pratiques">{t('nav.practices')}</Link>
                  </li>
                  <li>
                    <Link to="/espace-educatif">{t('nav.education')}</Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="col-12 col-lg-4">
              <p className="cinum-footer-heading">{t('footer.authorities_heading')}</p>
              <p className="small text-secondary mb-3 lh-base">
                {t('footer.authorities_before')}
                <strong>{t('footer.authority_arptc')}</strong>
                {t('footer.authorities_after')}
              </p>
              <p className="small text-muted mb-0">
                <span className="d-block mb-1">
                  <strong className="text-body">{t('footer.contact_general')}</strong>
                </span>
                <a href={`mailto:${CONTACT_EMAIL}`} className="cinum-footer-inline-link text-break d-inline-block">
                  {CONTACT_EMAIL}
                </a>
                <span className="d-block mt-2">
                  <a href={`tel:${CONTACT_PHONE_TEL}`} className="cinum-footer-inline-link">
                    {CONTACT_PHONE_DISPLAY}
                  </a>
                </span>
                <span className="d-block mt-2">{t('footer.country_year', { year })}</span>
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="cinum-footer-bottom">
        <ScrollReveal className="container" variant="fade">
          <div className="cinum-footer-bottom-bar px-1 px-sm-0 py-3 py-md-4 text-center">
            <p className="cinum-footer-bottom-text mb-0">{t('footer.bottom_copyright', { year })}</p>
          </div>
        </ScrollReveal>
      </div>
    </footer>
  )
}
