import { Link } from 'react-router-dom'
import { JsonLdSite } from '../components/JsonLdSite'
import { Seo } from '../components/Seo'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { ScrollReveal } from '../components/ScrollReveal'
import { NewsCard } from '../components/NewsCard'

/** Logos servis depuis `client/public/partners` (ex: `/partners/mon-logo.png`). */
const PARTNER_LOGOS = [
  '/partners/logo1.png',
  '/partners/logo3.png',
  '/partners/logo4.png',
  '/partners/logo5.png',
  '/partners/logo6.png',
  '/partners/logo7.png',
  '/partners/logo8.png',
]

export function Home() {
  const { t } = useTranslation()
  const [news, setNews] = useState([])

  useEffect(() => {
    api
      .get('/api/public/news')
      .then((r) => setNews(r.data.items?.slice(0, 3) || []))
      .catch(() => setNews([]))
  }, [])

  return (
    <>
      <Seo title={t('home.seo_title')} description={t('home.seo_description')} />
      <JsonLdSite />
      <section className="hero-institutional text-white py-4 py-md-5 mb-0" aria-labelledby="hero-title">
        <div className="container px-3 px-sm-4 py-lg-4 hero-enter">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-lg-7">
              <p className="text-uppercase small mb-2 opacity-90">{t('home.hero_eyebrow')}</p>
              <h1 id="hero-title" className="cinum-hero-title display-5 fw-bold">
                {t('banner.title')}
              </h1>
              <p className="lead mb-3 mb-md-4 cinum-hero-lead">{t('banner.subtitle')}</p>
              <p className="mb-3 mb-md-4 text-break lh-base">{t('home.hero_official')}</p>
              <div className="d-flex gap-2 cinum-hero-actions" role="group" aria-label={t('home.hero_quick_aria')}>
                <Link className="btn btn-light btn-lg cinum-hero-actions__btn" to="/droits">
                  {t('quick.rights')}
                </Link>
                <Link className="btn btn-outline-light btn-lg cinum-hero-actions__btn" to="/devoirs">
                  {t('quick.duties')}
                </Link>
                <Link className="btn btn-lg btn-cinum-hero-knowledge cinum-hero-actions__btn" to="/espace-educatif">
                  {t('quick.test_knowledge')}
                </Link>
              </div>
            </div>
            <div className="col-lg-5 text-center text-lg-end">
              <div className="hero-institutional__visual">
                <img
                  src="/hero-img.PNG"
                  alt={t('home.hero_img_alt')}
                  className="hero-institutional__img img-fluid"
                  width={560}
                  height={420}
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="home-after-hero">
        <section className="home-section" aria-labelledby="home-pillars-heading">
          <div className="container px-3 px-sm-4">
            <ScrollReveal className="mb-4 mb-lg-5" variant="fade-up">
              <header className="text-center text-lg-start">
                <p className="home-eyebrow mb-1">{t('home.parcours_eyebrow')}</p>
                <h2 id="home-pillars-heading" className="home-section-title mb-0">
                  {t('home.pillars_heading')}
                </h2>
                <p className="text-muted small mt-2 mb-0 col-lg-8 mx-auto mx-lg-0">{t('home.pillars_lead')}</p>
              </header>
            </ScrollReveal>

            <ScrollReveal delay={0} variant="fade-up">
              <div className="home-citizen-parent">
                <div className="home-citizen-media">
                  <img
                    src="/citoyen.PNG"
                    alt="Parcours citoyen"
                    className="img-fluid home-citizen-image"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="home-pillar home-citizen-text">
                  <p className="mb-3">
                    Le Parcours Citoyen Numerique vous accompagne dans le developpement d'une conscience numerique
                    responsable et eclairee. Dans un monde ou les technologies occupent une place centrale dans nos
                    vies, il devient essentiel de comprendre comment utiliser Internet de maniere reflechie,
                    securisee et respectueuse des autres.
                  </p>
                  <p className="mb-3">
                    A travers ce parcours, vous apprendrez a identifier les informations fiables, a developper votre
                    esprit critique face aux contenus en ligne et a reconnaitre les risques lies a la desinformation.
                    Vous decouvrirez egalement comment proteger vos donnees personnelles, securiser vos comptes et
                    adopter de bonnes pratiques pour preserver votre identite numerique.
                  </p>
                  <p className="mb-3">
                    Le programme vous invite aussi a reflechir a la maniere dont nous interagissons sur les
                    plateformes numeriques. Il encourage des comportements fondes sur le respect, l'ecoute et la
                    responsabilite, afin de favoriser des echanges constructifs sur les reseaux sociaux et dans les
                    espaces de discussion en ligne.
                  </p>
                  <p className="mb-0">
                    Grace a ce programme, chaque utilisateur, qu'il soit adolescent ou adulte, decouvre ses droits et
                    ses devoirs, et apprend a agir de maniere reflechie, ethique et positive dans le monde numerique.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="home-section home-more-band" aria-labelledby="home-more-heading">
          <div className="container px-3 px-sm-4">
            <ScrollReveal className="mb-4 mb-lg-4" variant="fade-up">
              <header className="text-center text-lg-start">
                <p className="home-eyebrow mb-1">{t('home.more_eyebrow')}</p>
                <h2 id="home-more-heading" className="home-section-title mb-0">
                  {t('home.more_title')}
                </h2>
                <p className="text-muted small mt-2 mb-0 col-lg-9 mx-auto mx-lg-0">{t('home.more_lead')}</p>
              </header>
            </ScrollReveal>
            <div className="row g-3 g-lg-4">
              {[
                { to: '/litteratie-numerique', title: t('nav.digital_literacy') },
                { to: '/espace-educatif', title: t('nav.education') },
                { to: '/faq', title: t('nav.faq') },
                { to: '/contact', title: t('nav.contact') },
                { to: '/a-propos', title: t('nav.about') },
                { to: '/bonnes-pratiques', title: t('nav.practices') },
                { to: '/signalement/suivi', title: t('home.track_report') },
                { to: '/glossaire', title: t('nav.glossary') },
              ].map((item, i) => (
                <div key={item.to} className="col-12 col-sm-6 col-lg-3">
                  <ScrollReveal delay={i * 50} variant="fade-up">
                    <Link to={item.to} className="home-more-card">
                      <h3 className="home-more-card-title">{item.title}</h3>
                      <span className="home-more-card-arrow" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </ScrollReveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="home-section home-news-band" aria-labelledby="home-news-heading">
          <div className="container px-3 px-sm-4">
            <ScrollReveal className="mb-4" variant="fade-left">
              <header className="d-flex flex-column flex-md-row align-items-md-end justify-content-md-between gap-2">
                <div>
                  <p className="home-eyebrow mb-1">{t('home.news_eyebrow')}</p>
                  <h2 id="home-news-heading" className="home-section-title mb-0">
                    {t('home.news_title')}
                  </h2>
                </div>
                <Link to="/actualites" className="small fw-semibold text-decoration-none">
                  {t('home.news_all_link')}
                </Link>
              </header>
            </ScrollReveal>

            {news.length === 0 ? (
              <ScrollReveal variant="fade">
                <div className="home-news-empty" role="status">
                  {t('home.news_empty')}
                </div>
              </ScrollReveal>
            ) : (
              <div className="row g-4">
                {news.map((n, i) => (
                  <div key={n._id} className="col-md-6 col-lg-4">
                    <ScrollReveal className="h-100" delay={i * 80} variant="scale">
                      <NewsCard item={n} className="h-100" />
                    </ScrollReveal>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="home-section home-partners-band" aria-labelledby="home-partners-heading">
          <div className="container px-3 px-sm-4">
            <ScrollReveal className="mb-3 mb-lg-4" variant="fade-up">
              <header className="text-center text-lg-start">
                <h2 id="home-partners-heading" className="home-section-title mb-0">
                  Partenaires techniques
                </h2>
              </header>
            </ScrollReveal>

            <ScrollReveal variant="fade-up">
              {PARTNER_LOGOS.length > 0 ? (
                <div className="home-partners-viewport" aria-label="Defilement des logos partenaires">
                  <div className="home-partners-track">
                    {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((src, i) => (
                      <div key={`${src}-${i}`} className="home-partners-item">
                        <img src={src} alt="" className="home-partners-logo" loading="lazy" decoding="async" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-muted small mb-0">
                  Ajoutez des logos dans <code>client/public/partners</code>, puis renseignez leurs chemins dans{' '}
                  <code>PARTNER_LOGOS</code>.
                </p>
              )}
            </ScrollReveal>
          </div>
        </section>
      </div>
    </>
  )
}
