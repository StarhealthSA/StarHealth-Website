'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function BeforeAfterMedia({ entry }) {
  const { t } = useTranslation();
  const [showAfter, setShowAfter] = useState(true);

  return (
    <div className="portfolio-card__media portfolio-card__media--compare">
      <img
        src={showAfter ? entry.afterImageUrl : entry.beforeImageUrl}
        alt={entry.altText || entry.title}
        className="portfolio-card__image"
        loading="lazy"
      />
      <div className="portfolio-card__compare-toggle" role="group" aria-label={t('portfolioPage.compareLabel')}>
        <button
          type="button"
          className={!showAfter ? 'is-active' : undefined}
          onClick={() => setShowAfter(false)}
          aria-pressed={!showAfter}
        >
          {t('portfolioPage.before')}
        </button>
        <button
          type="button"
          className={showAfter ? 'is-active' : undefined}
          onClick={() => setShowAfter(true)}
          aria-pressed={showAfter}
        >
          {t('portfolioPage.after')}
        </button>
      </div>
    </div>
  );
}

export default function PortfolioCard({ entry, compact = false }) {
  if (!entry) return null;

  return (
    <article className={`portfolio-card${compact ? ' portfolio-card--compact' : ''}`}>
      {entry.hasBeforeAfter ? (
        <BeforeAfterMedia entry={entry} />
      ) : entry.mediaType === 'video' && entry.mediaUrl ? (
        <div className="portfolio-card__media">
          <video
            className="portfolio-card__video"
            src={entry.mediaUrl}
            controls
            playsInline
            preload="metadata"
            aria-label={entry.altText || entry.title}
          >
            <track kind="captions" />
          </video>
        </div>
      ) : entry.mediaUrl ? (
        <div className="portfolio-card__media">
          <img
            src={entry.mediaUrl}
            alt={entry.altText || entry.title}
            className="portfolio-card__image"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="portfolio-card__media portfolio-card__media--empty" aria-hidden />
      )}

      <div className="portfolio-card__body">
        {entry.categoryLabel ? (
          <p className="portfolio-card__category">{entry.categoryLabel}</p>
        ) : null}
        <h3 className="portfolio-card__title">{entry.title}</h3>
        {(entry.serviceName || entry.doctorName) && (
          <p className="portfolio-card__meta">
            {[entry.serviceName, entry.doctorName].filter(Boolean).join(' · ')}
          </p>
        )}
        {!compact && entry.description ? (
          <p className="portfolio-card__description">{entry.description}</p>
        ) : null}
      </div>
    </article>
  );
}
