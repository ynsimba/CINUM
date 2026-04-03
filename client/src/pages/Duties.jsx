import { useTranslation } from 'react-i18next'
import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'

export function Duties() {
  const { t } = useTranslation()
  const p = 'pages.duties'
  return (
    <>
      <Seo title={t(`${p}.seo_title`)} description={t(`${p}.seo_description`)} />
      <PageHeader title={t(`${p}.title`)} lead={t(`${p}.lead`)} />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <div className="row">
          <div className="col-lg-8">
            <h2 className="h4">{t(`${p}.h2_resp`)}</h2>
            <ul>
              <li>{t(`${p}.resp_1`)}</li>
              <li>{t(`${p}.resp_2`)}</li>
              <li>{t(`${p}.resp_3`)}</li>
              <li>{t(`${p}.resp_4`)}</li>
              <li>{t(`${p}.resp_5`)}</li>
            </ul>
            <h2 className="h4 mt-4">{t(`${p}.h2_behavior`)}</h2>
            <p>{t(`${p}.behavior_p`)}</p>
          </div>
        </div>
      </div>
    </>
  )
}
