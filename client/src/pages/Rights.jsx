import { useTranslation } from 'react-i18next'
import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'

export function Rights() {
  const { t } = useTranslation()
  const p = 'pages.rights'
  return (
    <>
      <Seo title={t(`${p}.seo_title`)} description={t(`${p}.seo_description`)} />
      <PageHeader title={t(`${p}.title`)} lead={t(`${p}.lead`)} />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <section className="mb-4" aria-label="Cadre stratégique du civisme numérique">
          <div className="alert alert-light border">
            <p className="mb-2">
              En République Démocratique du Congo, la protection des droits numériques s&apos;inscrit dans un contexte de
              menaces hybrides où la manipulation de l&apos;information, la cybercriminalité et les atteintes à la dignité
              humaine fragilisent la cohésion sociale.
            </p>
            <p className="mb-0">
              Garantir les droits des citoyens en ligne est un impératif de sécurité nationale, de stabilité sociale et
              de développement durable.
            </p>
          </div>
        </section>
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h2 className="h5 text-primary">{t(`${p}.adults_title`)}</h2>
                <ul className="small mb-0">
                  <li>{t(`${p}.adults_1`)}</li>
                  <li>{t(`${p}.adults_2`)}</li>
                  <li>{t(`${p}.adults_3`)}</li>
                  <li>{t(`${p}.adults_4`)}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100 border-warning border-2">
              <div className="card-body">
                <h2 className="h5 text-primary">{t(`${p}.minors_title`)}</h2>
                <p className="small mb-2">{t(`${p}.minors_intro`)}</p>
                <ul className="small mb-0">
                  <li>{t(`${p}.minors_1`)}</li>
                  <li>{t(`${p}.minors_2`)}</li>
                  <li>{t(`${p}.minors_3`)}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <h2 className="h5">Droits numériques et souveraineté citoyenne</h2>
          <ul className="small mb-0">
            <li>Un citoyen informé de ses droits est plus résilient face aux tentatives de manipulation ;</li>
            <li>La connaissance des recours renforce la confiance dans les institutions ;</li>
            <li>La protection des mineurs en ligne contribue à la stabilité du tissu social.</li>
          </ul>
        </div>
        <p className="small text-muted mt-4">{t(`${p}.disclaimer`)}</p>
      </div>
    </>
  )
}
