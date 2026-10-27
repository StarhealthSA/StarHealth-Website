'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function PortfolioCase({ entry }) {
  const { t } = useTranslation();
  if (!entry) return null;

  const media = (
    <div className="portfolio-case__media">
      {entry.mediaUrl ? (
        <img
          src={entry.mediaUrl}
          alt={entry.altText || entry.title}
          className="portfolio-case__image"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="portfolio-case__image portfolio-case__image--empty" aria-hidden />
      )}
    </div>
  );

  const copy = (
    <div className="portfolio-case__copy">
      {entry.categoryLabel ? (
        <p className="portfolio-case__category">{entry.categoryLabel}</p>
      ) : null}
      <h3 className="portfolio-case__title">{entry.title}</h3>
      {entry.serviceName ? (
        <p className="portfolio-case__meta">{entry.serviceName}</p>
      ) : null}
      {entry.description ? (
        <p className="portfolio-case__description">{entry.description}</p>
      ) : null}
      {entry.serviceHref ? (
        <span className="portfolio-case__cta">{t('portfolioPage.exploreSpecialty')}</span>
      ) : null}
    </div>
  );

  if (entry.serviceHref) {
    return (
      <Link
        href={entry.serviceHref}
        className="portfolio-case"
        aria-label={`${entry.title}${entry.serviceName ? ` — ${entry.serviceName}` : ''}`}
      >
        {media}
        {copy}
      </Link>
    );
  }

  return (
    <article className="portfolio-case">
      {media}
      {copy}
    </article>
  );
}
