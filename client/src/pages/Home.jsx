import { Link } from 'react-router-dom'
import { JsonLdSite } from '../components/JsonLdSite'
import { Seo } from '../components/Seo'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { ScrollReveal } from '../components/ScrollReveal'
import { NewsCard } from '../components/NewsCard'

function PillarIcon({ children }) {
  return (
    <div className="home-pillar-icon" aria-hidden="true">
      {children}
    </div>
  )
}

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

            <div className="row g-4">
              <div className="col-md-6 col-lg-4">
                <ScrollReveal delay={0} variant="fade-up">
                <div className="home-pillar home-pillar--rights h-100 d-flex flex-column">
                  <PillarIcon>
                    <span className="fw-bold" style={{ fontSize: '0.95rem', letterSpacing: '0.05em' }}>
                      01
                    </span>
                  </PillarIcon>
                  <h3>{t('home.pillar_rights_title')}</h3>
                  <p className="flex-grow-1">{t('home.pillar_rights_text')}</p>
                  <Link to="/droits" className="home-pillar-link mt-auto">
                    {t('home.pillar_read_more')}
                  </Link>
                </div>
                </ScrollReveal>
              </div>
              <div className="col-md-4">
                <ScrollReveal delay={90} variant="fade-up">
                <div className="home-pillar home-pillar--duties h-100 d-flex flex-column">
                  <PillarIcon>
                    <span className="fw-bold" style={{ fontSize: '0.95rem', letterSpacing: '0.05em' }}>
                      02
                    </span>
                  </PillarIcon>
                  <h3>{t('home.pillar_duties_title')}</h3>
                  <p className="flex-grow-1">{t('home.pillar_duties_text')}</p>
                  <Link to="/devoirs" className="home-pillar-link mt-auto">
                    {t('home.pillar_read_more')}
                  </Link>
                </div>
                </ScrollReveal>
              </div>
              <div className="col-md-6 col-lg-4">
                <ScrollReveal delay={180} variant="fade-up">
                <div className="home-pillar home-pillar--report h-100 d-flex flex-column">
                  <PillarIcon>
                    <span className="fw-bold" style={{ fontSize: '0.95rem', letterSpacing: '0.05em' }}>
                      03
                    </span>
                  </PillarIcon>
                  <h3>{t('home.pillar_report_title')}</h3>
                  <p className="flex-grow-1">{t('home.pillar_report_text')}</p>
                  <Link to="/signalement" className="home-pillar-link mt-auto">
                    {t('home.pillar_report_cta')}
                  </Link>
                </div>
                </ScrollReveal>
              </div>
            </div>
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
      </div>
    </>
  )
}
