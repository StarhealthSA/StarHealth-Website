'use client';

export default function GiveawayOfferCard({
  offer,
  bookLabel,
  featuredLabel,
  language,
  onBook,
}) {
  const headline = offer.treatment || offer.name;
  const badge = offer.featured
    ? featuredLabel
    : (language === 'ar' ? 'عرض خاص' : 'Special offer');

  return (
    <article className={`giveaway-offer-card${offer.featured ? ' is-featured' : ''}`}>
      <div className="giveaway-offer-card__media" aria-hidden>
        {offer.imageUrl ? (
          <img src={offer.imageUrl} alt="" className="giveaway-offer-card__image" />
        ) : (
          <div className="giveaway-offer-card__fallback" />
        )}
        <div className="giveaway-offer-card__media-fade" />
        <div className="giveaway-offer-card__media-tags">
          <span className={`giveaway-offer-card__badge${offer.featured ? ' is-featured' : ''}`}>
            {badge}
          </span>
          {offer.discountLabel ? (
            <span className="giveaway-offer-card__discount">{offer.discountLabel}</span>
          ) : null}
        </div>
      </div>

      <div className="giveaway-offer-card__body">
        <h3 className="giveaway-offer-card__title">{headline}</h3>

        <div className="giveaway-offer-card__pricing">
          {offer.offerPriceLabel ? (
            <span className="giveaway-offer-card__price">{offer.offerPriceLabel}</span>
          ) : null}
          {offer.crossPriceLabel ? (
            <span className="giveaway-offer-card__cross">{offer.crossPriceLabel}</span>
          ) : null}
        </div>

        <button type="button" className="giveaway-offer-card__cta" onClick={onBook}>
          {bookLabel}
        </button>
      </div>
    </article>
  );
}
