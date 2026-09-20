'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

function BeforeAfterPair({ entry }) {
  const { t } = useTranslation();
  const beforeSrc = entry.beforeImageUrl || '';
  const afterSrc = entry.afterImageUrl || '';

  return (
    <div className="portfolio-case__pair" role="img" aria-label={t('portfolioPage.compareLabel')}>
      <figure className="portfolio-case__half">
        <img
          src={beforeSrc}
          alt=""
          className="portfolio-case__image"
          loading="lazy"
          decoding="async"
        />
        <figcaption className="portfolio-case__badge">
          {t('portfolioPage.before')}
        </figcaption>
      </figure>
      <figure className="portfolio-case__half">
        <img
          src={afterSrc}
          alt=""
          className="portfolio-case__image"
          loading="lazy"
          decoding="async"
        />
        <figcaption className="portfolio-case__badge portfolio-case__badge--after">
          {t('portfolioPage.after')}
        </figcaption>
      </figure>
    </div>
  );
}

function CaseMedia({ entry }) {
  if (entry.hasBeforeAfter) {
    return <BeforeAfterPair entry={entry} />;
  }

  if (entry.mediaType === 'video' && entry.mediaUrl) {
    return (
      <div className="portfolio-case__single">
        <video
          className="portfolio-case__image"
          src={entry.mediaUrl}
          controls
          playsInline
          preload="metadata"
          aria-label={entry.altText || entry.title}
        >
          <track kind="captions" />
        </video>
      </div>
    );
  }

  if (entry.mediaUrl) {
    return (
      <div className="portfolio-case__single">
        <img
          src={entry.mediaUrl}
          alt={entry.altText || entry.title}
          className="portfolio-case__image"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  return <div className="portfolio-case__single portfolio-case__single--empty" aria-hidden />;
}

export default function PortfolioCase({ entry, reversed = false }) {
  const { t } = useTranslation();
  if (!entry) return null;

  return (
    <article
      className={`portfolio-case${reversed ? ' portfolio-case--reversed' : ''}`}
    >
      <div className="portfolio-case__media">
        <CaseMedia entry={entry} />
      </div>

      <div className="portfolio-case__copy">
        {entry.categoryLabel ? (
          <p className="portfolio-case__category">{entry.categoryLabel}</p>
        ) : null}
        <h3 className="portfolio-case__title">{entry.title}</h3>
        {(entry.serviceName || entry.doctorName) && (
          <p className="portfolio-case__meta">
            {[entry.serviceName, entry.doctorName].filter(Boolean).join(' · ')}
          </p>
        )}
        {entry.description ? (
          <p className="portfolio-case__description">{entry.description}</p>
        ) : null}
        {entry.serviceHref ? (
          <Link href={entry.serviceHref} className="portfolio-case__link">
            {t('portfolioPage.exploreSpecialty')}
          </Link>
        ) : null}
      </div>
    </article>
  );
}
