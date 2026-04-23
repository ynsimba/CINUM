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
        <section className="mb-4" aria-label="Vision de responsabilité numérique">
          <div className="alert alert-light border">
            <p className="mb-2">
              Le civisme numérique ne relève plus uniquement d&apos;un enjeu éducatif : c&apos;est un enjeu de sécurité
              nationale, de cohésion sociale et de souveraineté informationnelle.
            </p>
            <p className="mb-0">
              La responsabilité citoyenne en ligne repose sur trois exigences : <strong>former pour prévenir</strong>,{' '}
              <strong>encadrer pour orienter</strong> et <strong>protéger pour sécuriser</strong>.
            </p>
          </div>
        </section>
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
            <h2 className="h4 mt-4">Pourquoi ces devoirs sont stratégiques</h2>
            <ul className="mb-0">
              <li>Ils réduisent l&apos;exposition collective aux fraudes et aux campagnes de manipulation ;</li>
              <li>Ils renforcent la résilience des familles, de la jeunesse et des institutions ;</li>
              <li>Ils préservent les valeurs républicaines dans l&apos;espace numérique.</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
