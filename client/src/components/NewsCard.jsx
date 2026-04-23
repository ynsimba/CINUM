import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getNewsCoverSrc } from '../utils/news'

function ClockIcon({ className }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/**
 * @param {{ _id: string, title: string, content?: string, coverImageUrl?: string, alert?: boolean, campaign?: boolean, createdAt?: string }} item
 * @param {string} [className]
 */
export function NewsCard({ item, className = '' }) {
  const { t, i18n } = useTranslation()
  const [imgFailed, setImgFailed] = useState(false)
  const to = `/actualites/${item._id}`
  const cover = getNewsCoverSrc(item)
  const showImg = Boolean(cover) && !imgFailed
  const locale = i18n.language?.startsWith('en') ? 'en-GB' : i18n.language?.startsWith('ln') ? 'fr-FR' : 'fr-FR'
  const dateStr =
    item.createdAt != null
      ? new Date(item.createdAt).toLocaleDateString(locale, {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : ''

  let typeClass = 'news-card__pill--actualite'
  let typeLabel = t('news_card.badge_actualite')
  if (item.alert) {
    typeClass = 'news-card__pill--alert'
    typeLabel = t('home.badge_alert')
  } else if (item.campaign) {
    typeClass = 'news-card__pill--campaign'
    typeLabel = t('home.badge_campaign')
  }

  return (
    <Link to={to} className={`news-card ${className}`.trim()}>
      <div className="news-card__media">
        {showImg ? (
          <img
            src={cover}
            alt={`Illustration de l'actualité : ${item.title}`}
            className="news-card__img"
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="news-card__placeholder" aria-hidden="true" />
        )}
        <div className="news-card__ministry" aria-hidden="true">
          <span className="news-card__ministry-text">{t('news_card.ministry_overlay')}</span>
        </div>
      </div>
      <div className="news-card__body">
        <div className="news-card__pills">
          <span className={`news-card__pill ${typeClass}`}>{typeLabel}</span>
          {dateStr ? (
            <span className="news-card__pill news-card__pill--date">
              <ClockIcon className="news-card__clock" />
              {dateStr}
            </span>
          ) : null}
        </div>
        <h3 className="news-card__title">{item.title}</h3>
      </div>
    </Link>
  )
}
