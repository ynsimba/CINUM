import { Link } from 'react-router-dom'
import { JsonLdSite } from '../components/JsonLdSite'
import { Seo } from '../components/Seo'
import { DEFAULT_DESCRIPTION } from '../config/site'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { ScrollReveal } from '../components/ScrollReveal'

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
      <Seo title="Accueil — Civisme numérique RDC" description={DEFAULT_DESCRIPTION} />
      <JsonLdSite />
      <section className="hero-institutional text-white py-4 py-md-5 mb-0" aria-labelledby="hero-title">
        <div className="container px-3 px-sm-4 py-lg-4 hero-enter">
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-lg-7">
              <p className="text-uppercase small mb-2 opacity-90">Portail institutionnel</p>
              <h1 id="hero-title" className="cinum-hero-title display-5 fw-bold">
                {t('banner.title')}
              </h1>
              <p className="lead mb-3 mb-md-4 cinum-hero-lead">{t('banner.subtitle')}</p>
              <p className="mb-3 mb-md-4 text-break lh-base">
                Message officiel : ce site informe sur les droits et devoirs liés à l&apos;usage des technologies de
                l&apos;information et de la communication, conformément au cadre légal congolais, notamment la loi n° 20/017
                relative aux télécommunications et aux TIC, et oriente vers les autorités compétentes pour les recours.
              </p>
              <div className="d-flex gap-2 cinum-hero-actions" role="group" aria-label="Accès rapide">
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
                  alt="Illustration : équilibre entre citoyenneté numérique et protection en ligne"
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
                <p className="home-eyebrow mb-1">Parcours citoyen</p>
                <h2 id="home-pillars-heading" className="home-section-title mb-0">
                  Comprendre et agir en ligne
                </h2>
                <p className="text-muted small mt-2 mb-0 col-lg-8 mx-auto mx-lg-0">
                  Trois entrées pour accéder aux contenus pédagogiques et au dispositif de signalement.
                </p>
              </header>
            </ScrollReveal>

            <div className="row g-4">
              <div className="col-md-4">
                <ScrollReveal delay={0} variant="fade-up">
                <div className="home-pillar home-pillar--rights h-100 d-flex flex-column">
                  <PillarIcon>
                    <span className="fw-bold" style={{ fontSize: '0.95rem', letterSpacing: '0.05em' }}>
                      01
                    </span>
                  </PillarIcon>
                  <h3>Droits numériques</h3>
                  <p className="flex-grow-1">
                    Accès, protection de la vie privée, liberté d&apos;expression dans les limites légales : synthèse
                    pédagogique.
                  </p>
                  <Link to="/droits" className="home-pillar-link mt-auto">
                    En savoir plus
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
                  <h3>Devoirs numériques</h3>
                  <p className="flex-grow-1">
                    Respect d&apos;autrui, vérification des informations, responsabilité lors de la publication de
                    contenus.
                  </p>
                  <Link to="/devoirs" className="home-pillar-link mt-auto">
                    En savoir plus
                  </Link>
                </div>
                </ScrollReveal>
              </div>
              <div className="col-md-4">
                <ScrollReveal delay={180} variant="fade-up">
                <div className="home-pillar home-pillar--report h-100 d-flex flex-column">
                  <PillarIcon>
                    <span className="fw-bold" style={{ fontSize: '0.95rem', letterSpacing: '0.05em' }}>
                      03
                    </span>
                  </PillarIcon>
                  <h3>Signaler un abus</h3>
                  <p className="flex-grow-1">
                    Formulaire sécurisé pour orienter les signalements vers le traitement institutionnel et l&apos;ARPTC.
                  </p>
                  <Link to="/signalement" className="home-pillar-link mt-auto">
                    Accéder au formulaire
                  </Link>
                </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        <section className="home-section home-news-band" aria-labelledby="home-news-heading">
          <div className="container px-3 px-sm-4">
            <ScrollReveal className="mb-4" variant="fade-left">
              <header className="d-flex flex-column flex-md-row align-items-md-end justify-content-md-between gap-2">
                <div>
                  <p className="home-eyebrow mb-1">Publications</p>
                  <h2 id="home-news-heading" className="home-section-title mb-0">
                    Actualités et communiqués
                  </h2>
                </div>
                <Link to="/actualites" className="small fw-semibold text-decoration-none">
                  Toutes les actualités →
                </Link>
              </header>
            </ScrollReveal>

            {news.length === 0 ? (
              <ScrollReveal variant="fade">
                <div className="home-news-empty" role="status">
                  Les publications officielles apparaîtront ici lorsque le serveur et la base de données seront configurés.
                </div>
              </ScrollReveal>
            ) : (
              <div className="row g-3">
                {news.map((n, i) => (
                  <div key={n._id} className="col-md-4">
                    <ScrollReveal className="h-100" delay={i * 80} variant="scale">
                    <Link to={`/actualites/${n._id}`} className="home-news-item h-100">
                      <div className="d-flex flex-wrap gap-1 mb-2">
                        {n.alert && <span className="badge rounded-pill bg-danger">Alerte</span>}
                        {n.campaign && (
                          <span className="badge rounded-pill bg-warning text-dark">Campagne</span>
                        )}
                      </div>
                      <h3>{n.title}</h3>
                      <p>{(n.excerpt || n.content)?.slice(0, 140)}{(n.excerpt || n.content)?.length > 140 ? '…' : ''}</p>
                    </Link>
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
