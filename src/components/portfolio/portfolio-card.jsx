'use client';

export default function PortfolioCard({ entry, compact = false }) {
  if (!entry) return null;

  return (
    <article className={`portfolio-card${compact ? ' portfolio-card--compact' : ''}`}>
      {entry.mediaUrl ? (
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
        {entry.serviceName ? (
          <p className="portfolio-card__meta">{entry.serviceName}</p>
        ) : null}
        {!compact && entry.description ? (
          <p className="portfolio-card__description">{entry.description}</p>
        ) : null}
      </div>
    </article>
  );
}
