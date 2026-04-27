import { Link } from 'react-router-dom'
import { JsonLdSite } from '../components/JsonLdSite'
import { Seo } from '../components/Seo'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { api, fetchCsrf } from '../api/client'
import { ScrollReveal } from '../components/ScrollReveal'
import { NewsCard } from '../components/NewsCard'

/** Logos servis depuis `client/public/partners` (ex: `/partners/mon-logo.png`). */
const PARTNER_LOGOS = [
  { src: '/partners/logo1.png', alt: 'Logo partenaire technique 1' },
  { src: '/partners/logo3.png', alt: 'Logo partenaire technique 2' },
  { src: '/partners/logo4.png', alt: 'Logo partenaire technique 3' },
  { src: '/partners/logo5.png', alt: 'Logo partenaire technique 4' },
  { src: '/partners/logo6.png', alt: 'Logo partenaire technique 5' },
  { src: '/partners/logo7.png', alt: 'Logo partenaire technique 6' },
  { src: '/partners/logo8.png', alt: 'Logo partenaire technique 7' },
]

export function Home() {
  const { t } = useTranslation()
  const [news, setNews] = useState([])
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterMsg, setNewsletterMsg] = useState('')
  const [newsletterSending, setNewsletterSending] = useState(false)

  useEffect(() => {
    api
      .get('/api/public/news')
      .then((r) => setNews(r.data.items?.slice(0, 3) || []))
      .catch(() => setNews([]))
  }, [])

  async function submitNewsletter(e) {
    e.preventDefault()
    setNewsletterMsg('')
    const email = newsletterEmail.trim()
    if (!email || !email.includes('@')) {
      setNewsletterMsg('Veuillez saisir une adresse e-mail valide.')
      return
    }
    try {
      setNewsletterSending(true)
      await fetchCsrf()
      const { data } = await api.post('/api/contact/newsletter', { email })
      setNewsletterMsg(data?.message || 'Abonnement enregistre.')
      setNewsletterEmail('')
    } catch (err) {
      const data = err?.response?.data
      const msg =
        (Array.isArray(data?.errors) && data.errors[0]?.msg) ||
        data?.error ||
        'Abonnement impossible pour le moment. Veuillez reessayer.'
      setNewsletterMsg(msg)
    } finally {
      setNewsletterSending(false)
    }
  }

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
                <Link className="btn btn-lg btn-cinum-hero-knowledge cinum-hero-actions__btn" to="/espace-educatif">
                  <i className="fa-solid fa-brain me-2" aria-hidden="true"></i>
                  {t('quick.test_knowledge')}
                </Link>
                <Link className="btn btn-lg btn-cinum-hero-report cinum-hero-actions__btn" to="/signalement">
                  <i className="fa-solid fa-triangle-exclamation me-2" aria-hidden="true"></i>
                  {t('nav.report')}
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
                  loading="eager"
                  fetchPriority="high"
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
                    width={1200}
                    height={900}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="home-pillar home-citizen-text">
                  <p className="mb-3">
                    La République Démocratique du Congo fait face à une mutation profonde des menaces qui pèsent sur sa
                    stabilité sociale, économique et sécuritaire. Une partie de ces menaces se déploie désormais dans le
                    cyberespace, où la manipulation de l&apos;information, la criminalité numérique et les atteintes à la
                    dignité humaine fragilisent le tissu social.
                  </p>
                  <p className="mb-3">
                    Face à cette réalité, l&apos;action publique ne peut pas être seulement répressive. Le portail CINUM
                    promeut une approche globale autour de trois priorités : <strong>former pour prévenir</strong>,{' '}
                    <strong>encadrer pour orienter</strong> et <strong>protéger pour sécuriser</strong>.
                  </p>
                  <p className="mb-3">
                    L&apos;éducation au civisme numérique est un levier stratégique de souveraineté nationale : elle rend
                    les citoyens plus conscients des enjeux technologiques, plus responsables dans leurs interactions en
                    ligne et plus résilients face aux tentatives de fraude et de manipulation.
                  </p>
                  <p className="mb-0">
                    Investir dans le civisme numérique aujourd&apos;hui, c&apos;est protéger l&apos;avenir de la Nation et bâtir
                    une société congolaise plus éclairée, plus responsable, plus sécurisée et adaptée aux défis du XXIe
                    siècle.
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
                <div className="home-partners-viewport" aria-label="Défilement des logos partenaires">
                  <div className="home-partners-track">
                    {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, i) => (
                      <div
                        key={`${logo.src}-${i}`}
                        className="home-partners-item"
                        aria-hidden={i >= PARTNER_LOGOS.length ? 'true' : undefined}
                      >
                        <img
                          src={logo.src}
                          alt={i >= PARTNER_LOGOS.length ? '' : logo.alt}
                          className="home-partners-logo"
                          width={220}
                          height={96}
                          loading="lazy"
                          decoding="async"
                        />
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

        <section className="home-section home-newsletter-band" aria-labelledby="home-newsletter-heading">
          <div className="container px-3 px-sm-4">
            <ScrollReveal className="mb-3 mb-lg-4" variant="fade-up">
              <header className="text-center text-lg-start">
                <h2 id="home-newsletter-heading" className="home-section-title mb-2">
                  Abonnement a la newsletter
                </h2>
                <p className="text-muted mb-0">
                  Recevez les actualites, ressources et actions de sensibilisation du portail CINUM.
                </p>
              </header>
            </ScrollReveal>

            <ScrollReveal variant="fade-up">
              <form className="home-newsletter-form" onSubmit={submitNewsletter}>
                <label htmlFor="newsletter-email" className="visually-hidden">
                  Adresse e-mail
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  className="form-control home-newsletter-input"
                  placeholder="Votre adresse e-mail"
                  autoComplete="email"
                  inputMode="email"
                  aria-describedby="newsletter-feedback"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary home-newsletter-btn" disabled={newsletterSending}>
                  {newsletterSending ? 'Envoi...' : "S'abonner"}
                </button>
              </form>
              {newsletterMsg ? (
                <p id="newsletter-feedback" className="small text-muted mt-2 mb-0" role="status" aria-live="polite">
                  {newsletterMsg}
                </p>
              ) : null}
            </ScrollReveal>
          </div>
        </section>
      </div>
    </>
  )
}
