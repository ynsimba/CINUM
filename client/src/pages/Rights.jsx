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
        <p className="small text-muted mt-4">{t(`${p}.disclaimer`)}</p>
      </div>
    </>
  )
}
