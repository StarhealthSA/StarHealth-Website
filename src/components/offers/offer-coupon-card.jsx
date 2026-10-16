'use client';

export default function OfferCouponCard({
  offer,
  bookLabel,
  validUntilLabel,
  featuredLabel,
  language,
  onBook,
}) {
  const headline = offer.treatment || offer.name;
  const showDiscountMeta = Boolean(offer.discountLabel);

  return (
    <article className={`offer-coupon${offer.featured ? ' offer-coupon--featured' : ''}`}>
      {offer.imageUrl ? (
        <img src={offer.imageUrl} alt="" className="offer-coupon__bg" />
      ) : null}
      <div className="offer-coupon__shade" aria-hidden />

      <div className="offer-coupon__content">
        <p
          className={`offer-coupon__eyebrow${
            offer.featured ? ' offer-coupon__eyebrow--featured' : ''
          }`}
        >
          {offer.featured
            ? featuredLabel
            : (language === 'ar' ? 'عرض خاص' : 'Special offer')}
        </p>

        <h2 className="offer-coupon__headline">{headline}</h2>

        {offer.name && offer.treatment ? (
          <p className="offer-coupon__name">{offer.name}</p>
        ) : null}

        {offer.description ? (
          <p className="offer-coupon__description">{offer.description}</p>
        ) : null}

        <div className="offer-coupon__meta">
          {offer.validUntilLabel ? (
            <span className="offer-coupon__validity">
              {validUntilLabel}: {offer.validUntilLabel}
            </span>
          ) : null}
        </div>

        <div className="offer-coupon__actions">
          <button
            type="button"
            onClick={onBook}
            className="offer-coupon__cta"
          >
            {bookLabel}
          </button>

          {offer.offerPriceLabel ? (
            <div className="offer-coupon__price-line">
              {showDiscountMeta ? (
                <span className="offer-coupon__discount">{offer.discountLabel}</span>
              ) : null}
              <span className="offer-coupon__price">{offer.offerPriceLabel}</span>
              {offer.crossPriceLabel ? (
                <span className="offer-coupon__cross">{offer.crossPriceLabel}</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
