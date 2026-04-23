import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Seo } from '../components/Seo'
import { PageHeader } from '../components/PageHeader'
import { DIGITAL_LITERACY_SECTIONS } from '../data/digitalLiteracy'

function BodyParagraphs({ paragraphs, keyPrefix = '' }) {
  if (!paragraphs?.length) return null
  return paragraphs.map((p, j) => {
    const isNote = p.startsWith('Note :')
    const isDidYouKnow = p.startsWith('Le saviez-vous')
    return (
      <p
        key={`${keyPrefix}${j}`}
        className={`small lh-base ${
          isNote
            ? 'text-muted border-start border-3 border-primary ps-3 mt-3 mb-0'
            : isDidYouKnow
              ? 'text-body-secondary border-start border-3 border-secondary ps-3 mt-2 mb-2'
              : 'text-body-secondary'
        }`}
      >
        {p}
      </p>
    )
  })
}

function LiteracySection({ s, isLast }) {
  return (
    <section
      className={`mb-5 pb-4 cinum-digital-literacy-section${isLast ? '' : ' border-bottom'}`}
      aria-labelledby={s.id}
    >
      <h2 id={s.id} className="h4 text-primary mb-3" tabIndex={-1}>
        {s.title}
      </h2>
      <BodyParagraphs paragraphs={s.paragraphs} />
      {s.reflectiveQuestions?.items?.length > 0 && (
        <div className="mt-2 mb-3">
          <p className="small text-body-secondary fw-semibold mb-2">{s.reflectiveQuestions.lead}</p>
          <ul
            className="small text-body-secondary lh-base mb-0 ps-3"
            aria-label="Questions pour guider l’analyse des médias"
          >
            {s.reflectiveQuestions.items.map((q, qi) => (
              <li key={qi} className="mb-2">
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}
      <BodyParagraphs paragraphs={s.trailingParagraphs} />
      {s.subsections?.length > 0 &&
        s.subsections.map((sub, si) => (
          <div key={sub.heading} className="mt-4">
            <h3 className="h6 text-primary mb-2">{sub.heading}</h3>
            <BodyParagraphs paragraphs={sub.paragraphs} keyPrefix={`sub-${s.id}-${si}-`} />
            {sub.bulletGroups?.map((bg, bgi) => (
              <div key={bgi} className="mt-3">
                {bg.title && <h4 className="h6 text-body mb-2">{bg.title}</h4>}
                <BodyParagraphs paragraphs={bg.paragraphs} keyPrefix={`bgp-${s.id}-${si}-${bgi}-`} />
                {bg.lead && <p className="small text-body-secondary lh-base mb-2">{bg.lead}</p>}
                {bg.items?.length > 0 && (
                  <ul className="small text-body-secondary lh-base ps-3 mb-0">
                    {bg.items.map((item, ii) => (
                      <li key={ii} className="mb-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <BodyParagraphs paragraphs={sub.trailingParagraphs} keyPrefix={`subtail-${s.id}-${si}-`} />
          </div>
        ))}
      {s.conclusionBlock && (
        <div className="mt-4 pt-2">
          <h3 className="h6 text-primary mb-3">{s.conclusionBlock.title}</h3>
          <BodyParagraphs paragraphs={s.conclusionBlock.paragraphs} keyPrefix={`conc-${s.id}-`} />
          {s.conclusionBlock.closingLead && (
            <p className="small text-body-secondary lh-base mb-2">{s.conclusionBlock.closingLead}</p>
          )}
          {s.conclusionBlock.bullets?.length > 0 && (
            <ul className="small text-body-secondary lh-base ps-3 mb-2">
              {s.conclusionBlock.bullets.map((b, bi) => (
                <li key={bi} className="mb-2">
                  {b}
                </li>
              ))}
            </ul>
          )}
          <BodyParagraphs paragraphs={s.conclusionBlock.paragraphsAfterBullets} keyPrefix={`concaft-${s.id}-`} />
          {s.conclusionBlock.midLead && (
            <p className="small text-body-secondary lh-base mb-2">{s.conclusionBlock.midLead}</p>
          )}
          {s.conclusionBlock.moreBullets?.length > 0 && (
            <ul className="small text-body-secondary lh-base ps-3 mb-0">
              {s.conclusionBlock.moreBullets.map((b, bi) => (
                <li key={bi} className="mb-2">
                  {b}
                </li>
              ))}
            </ul>
          )}
          <BodyParagraphs paragraphs={s.conclusionBlock.trailingParagraphs} keyPrefix={`conctail-${s.id}-`} />
        </div>
      )}
      {s.practiceGroups?.length > 0 && (
        <div className="mt-2">
          {s.practiceGroups.map((g) => (
            <div key={g.title} className="mb-4">
              <h3 className="h6 text-primary mb-2">{g.title}</h3>
              <ul className="small text-body-secondary lh-base mb-0 ps-3">
                {g.items.map((line, gi) => (
                  <li key={gi} className="mb-2">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {s.reasons?.length > 0 && (
        <ol className="cinum-digital-literacy-reasons small text-body-secondary lh-base ps-3 mt-2 mb-0">
          {s.reasons.map((text, ri) => (
            <li key={ri} className="mb-3">
              {text}
            </li>
          ))}
        </ol>
      )}
      {s.pillars?.length > 0 && (
        <ul className="list-unstyled mt-3 mb-0">
          {s.pillars.map((pillar) => (
            <li key={pillar.label} className="small text-body-secondary lh-base mb-3">
              <strong className="text-body">{pillar.label}</strong>
              {' — '}
              {pillar.text}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export function DigitalLiteracy() {
  const { t } = useTranslation()
  const [focusedSectionId, setFocusedSectionId] = useState(null)
  const mainRef = useRef(null)

  const sectionsToShow = useMemo(() => {
    if (!focusedSectionId) return DIGITAL_LITERACY_SECTIONS
    return DIGITAL_LITERACY_SECTIONS.filter((x) => x.id === focusedSectionId)
  }, [focusedSectionId])

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '')
    if (hash && DIGITAL_LITERACY_SECTIONS.some((x) => x.id === hash)) {
      setFocusedSectionId(hash)
    }
  }, [])

  const selectSection = useCallback((id) => {
    setFocusedSectionId(id)
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${id}`)
    requestAnimationFrame(() => {
      mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      document.getElementById(id)?.focus?.()
    })
  }, [])

  const showFullDocument = useCallback(() => {
    setFocusedSectionId(null)
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}`
    )
    requestAnimationFrame(() => mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }, [])

  return (
    <>
      <Seo
        title="Littératie aux médias numériques — Civisme numérique RDC"
        description="L’éducation au civisme numérique comme enjeu de sécurité nationale, de cohésion sociale et de souveraineté : repères et pratiques pour comprendre et agir."
      />
      <PageHeader
        title="Littératie numérique"
        lead="Former pour prévenir, encadrer pour orienter, protéger pour sécuriser : repères pour renforcer la résilience citoyenne dans le cyberespace."
      />
      <div className="container px-3 px-sm-4 pb-4 pb-md-5">
        <div className="alert alert-light border mb-4" role="note">
          La littératie numérique soutient une stratégie publique durable : <strong>former pour prévenir</strong>,{' '}
          <strong>encadrer pour orienter</strong> et <strong>protéger pour sécuriser</strong>.
        </div>
        <div className="row g-4 g-lg-5">
          <aside className="col-lg-4">
            <nav
              className="cinum-digital-literacy-toc border rounded-3 p-3 bg-light"
              aria-label={t('digitalLiteracy.toc_aria')}
            >
              <h2 className="h6 text-uppercase text-muted mb-3">{t('digitalLiteracy.toc_title')}</h2>
              <p className="small text-muted mb-3">{t('digitalLiteracy.toc_hint')}</p>
              <ol className="small mb-0 ps-3">
                {DIGITAL_LITERACY_SECTIONS.map((s) => {
                  const active = focusedSectionId === s.id
                  return (
                    <li key={s.id} className="mb-2">
                      <button
                        type="button"
                        className={`btn btn-link text-start p-0 border-0 bg-transparent link-offset-2 ${
                          active ? 'fw-semibold text-primary' : ''
                        }`}
                        aria-current={active ? 'true' : undefined}
                        onClick={() => selectSection(s.id)}
                      >
                        {s.title}
                      </button>
                    </li>
                  )
                })}
              </ol>
              {focusedSectionId && (
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm w-100 mt-3"
                  onClick={showFullDocument}
                >
                  {t('digitalLiteracy.show_all')}
                </button>
              )}
            </nav>
          </aside>
          <div
            ref={mainRef}
            className="col-lg-8"
            id="digital-literacy-main"
            tabIndex={-1}
            aria-live="polite"
          >
            {focusedSectionId && (
              <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={showFullDocument}>
                  {t('digitalLiteracy.show_all')}
                </button>
              </div>
            )}
            {sectionsToShow.map((s, i) => (
              <LiteracySection key={s.id} s={s} isLast={i === sectionsToShow.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
