import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'

const PDF_PATH = '/Code-du-numerique-I-RD-Congo.pdf'
const PDF_NAME = 'Code-du-numerique-I-RD-Congo.pdf'

function Section({ title, children }) {
  const sectionTitleId = useId()
  return (
    <section
      className="mb-4 pb-4 border-bottom border-secondary-subtle cinum-digital-code__section"
      aria-labelledby={sectionTitleId}
    >
      <h2 id={sectionTitleId} className="h5 text-primary text-break">
        {title}
      </h2>
      {children}
    </section>
  )
}

export function DigitalCode() {
  const { t } = useTranslation()
  const p = 'pages.digitalCode'
  const pageTitleId = useId()

  return (
    <>
      <Seo title={t(`${p}.seo_title`)} description={t(`${p}.seo_description`)} />
      <PageHeader titleId={pageTitleId} title={t(`${p}.title`)} lead={t(`${p}.lead`)} />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5 cinum-digital-code">
        <article aria-labelledby={pageTitleId}>
          <div className="row justify-content-center">
            <div className="col-12 col-lg-9 min-w-0">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body cinum-dc-pdf-card">
                <div className="min-w-0">
                  <p className="mb-1 fw-semibold text-break">{t(`${p}.pdf_cta`)}</p>
                  <p className="small text-muted mb-0 text-break">{t(`${p}.pdf_hint`)}</p>
                </div>
                <a
                  className="btn btn-primary cinum-dc-pdf-btn"
                  href={PDF_PATH}
                  download={PDF_NAME}
                  type="application/pdf"
                  aria-label={t('a11y.pdf_download_aria', { filename: PDF_NAME })}
                >
                  {t(`${p}.pdf_button`)}
                </a>
              </div>
            </div>

            <Section title={t(`${p}.s1_title`)}>
              <p className="mb-2">{t(`${p}.s1_lead`)}</p>
              <ul className="small mb-2">
                <li>{t(`${p}.s1_i1`)}</li>
                <li>{t(`${p}.s1_i2`)}</li>
                <li>{t(`${p}.s1_i3`)}</li>
                <li>{t(`${p}.s1_i4`)}</li>
              </ul>
              <p className="small text-muted mb-0">{t(`${p}.s1_summary`)}</p>
            </Section>

            <Section title={t(`${p}.s2_title`)}>
              <p className="mb-2">{t(`${p}.s2_lead`)}</p>
              <ul className="small mb-0">
                <li>{t(`${p}.s2_i1`)}</li>
                <li>{t(`${p}.s2_i2`)}</li>
                <li>{t(`${p}.s2_i3`)}</li>
                <li>{t(`${p}.s2_i4`)}</li>
                <li>{t(`${p}.s2_i5`)}</li>
              </ul>
            </Section>

            <Section title={t(`${p}.s3_title`)}>
              <dl className="small mb-0 cinum-digital-code__definitions">
                <div className="cinum-digital-code__def-pair">
                  <dt>{t(`${p}.s3_t1`)}</dt>
                  <dd>{t(`${p}.s3_d1`)}</dd>
                </div>
                <div className="cinum-digital-code__def-pair">
                  <dt>{t(`${p}.s3_t2`)}</dt>
                  <dd>{t(`${p}.s3_d2`)}</dd>
                </div>
                <div className="cinum-digital-code__def-pair">
                  <dt>{t(`${p}.s3_t3`)}</dt>
                  <dd>{t(`${p}.s3_d3`)}</dd>
                </div>
                <div className="cinum-digital-code__def-pair">
                  <dt>{t(`${p}.s3_t4`)}</dt>
                  <dd>{t(`${p}.s3_d4`)}</dd>
                </div>
                <div className="cinum-digital-code__def-pair">
                  <dt>{t(`${p}.s3_t5`)}</dt>
                  <dd>{t(`${p}.s3_d5`)}</dd>
                </div>
              </dl>
            </Section>

            <Section title={t(`${p}.s4_title`)}>
              <p className="mb-2">{t(`${p}.s4_lead`)}</p>
              <ul className="small mb-0">
                <li>{t(`${p}.s4_i1`)}</li>
                <li>{t(`${p}.s4_i2`)}</li>
                <li>{t(`${p}.s4_i3`)}</li>
                <li>{t(`${p}.s4_i4`)}</li>
                <li>{t(`${p}.s4_i5`)}</li>
              </ul>
            </Section>

            <Section title={t(`${p}.s5_title`)}>
              <p className="mb-2 fw-semibold small">{t(`${p}.s5_must_heading`)}</p>
              <ul className="small mb-3">
                <li>{t(`${p}.s5_m1`)}</li>
                <li>{t(`${p}.s5_m2`)}</li>
                <li>{t(`${p}.s5_m3`)}</li>
                <li>{t(`${p}.s5_m4`)}</li>
                <li>{t(`${p}.s5_m5`)}</li>
              </ul>
              <p className="mb-2 fw-semibold small">{t(`${p}.s5_forbid_heading`)}</p>
              <ul className="small mb-0">
                <li>{t(`${p}.s5_f1`)}</li>
                <li>{t(`${p}.s5_f2`)}</li>
                <li>{t(`${p}.s5_f3`)}</li>
              </ul>
            </Section>

            <Section title={t(`${p}.s6_title`)}>
              <p className="mb-2">{t(`${p}.s6_lead`)}</p>
              <ul className="small mb-3">
                <li>{t(`${p}.s6_i1`)}</li>
                <li>{t(`${p}.s6_i2`)}</li>
                <li>{t(`${p}.s6_i3`)}</li>
                <li>{t(`${p}.s6_i4`)}</li>
              </ul>
              <p className="small mb-0">{t(`${p}.s6_seller`)}</p>
            </Section>

            <Section title={t(`${p}.s7_title`)}>
              <p className="mb-2">{t(`${p}.s7_lead`)}</p>
              <ul className="small mb-3">
                <li>{t(`${p}.s7_o1`)}</li>
                <li>{t(`${p}.s7_o2`)}</li>
                <li>{t(`${p}.s7_o3`)}</li>
              </ul>
              <p className="mb-2 fw-semibold small">{t(`${p}.s7_mission_heading`)}</p>
              <ul className="small mb-0">
                <li>{t(`${p}.s7_m1`)}</li>
                <li>{t(`${p}.s7_m2`)}</li>
                <li>{t(`${p}.s7_m3`)}</li>
              </ul>
            </Section>

            <Section title={t(`${p}.s8_title`)}>
              <p className="mb-2">{t(`${p}.s8_lead`)}</p>
              <ul className="small mb-0">
                <li>{t(`${p}.s8_i1`)}</li>
                <li>{t(`${p}.s8_i2`)}</li>
                <li>{t(`${p}.s8_i3`)}</li>
                <li>{t(`${p}.s8_i4`)}</li>
              </ul>
            </Section>

            <Section title={t(`${p}.s9_title`)}>
              <p className="mb-2">{t(`${p}.s9_lead`)}</p>
              <ul className="small mb-3">
                <li>{t(`${p}.s9_i1`)}</li>
                <li>{t(`${p}.s9_i2`)}</li>
                <li>{t(`${p}.s9_i3`)}</li>
              </ul>
              <p className="small text-muted mb-0">{t(`${p}.s9_goal`)}</p>
            </Section>

            <Section title={t(`${p}.s10_title`)}>
              <p className="mb-2">{t(`${p}.s10_lead`)}</p>
              <ul className="small mb-0">
                <li>{t(`${p}.s10_i1`)}</li>
                <li>{t(`${p}.s10_i2`)}</li>
                <li>{t(`${p}.s10_i3`)}</li>
              </ul>
            </Section>

            <Section title={t(`${p}.s11_title`)}>
              <p className="mb-2">{t(`${p}.s11_lead`)}</p>
              <ul className="small mb-3">
                <li>{t(`${p}.s11_i1`)}</li>
                <li>{t(`${p}.s11_i2`)}</li>
                <li>{t(`${p}.s11_i3`)}</li>
              </ul>
              <p className="small mb-0">{t(`${p}.s11_note`)}</p>
            </Section>

            <div className="mt-4 p-3 bg-light rounded border border-light">
              <p className="small mb-2">{t(`${p}.outro_1`)}</p>
              <p className="small mb-2">{t(`${p}.outro_2`)}</p>
              <p className="small mb-0">{t(`${p}.outro_3`)}</p>
            </div>

            <p className="small text-muted mt-4 mb-0">{t(`${p}.disclaimer`)}</p>
            </div>
          </div>
        </article>
      </div>
    </>
  )
}
