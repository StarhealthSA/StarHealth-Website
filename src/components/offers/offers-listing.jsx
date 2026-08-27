'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Reveal, { staggerDelay } from '@/components/reveal';
import AppointmentModal from '@/components/doctors/appointment-modal';
import { toPublicOffer } from '@/lib/content/offer-public';

function OfferCouponCard({
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

export default function OffersListing({ offers = [] }) {
  const { t, i18n } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const items = offers
    .map((offer) => toPublicOffer(offer, i18n.language))
    .filter(Boolean);

  return (
    <section className="offers-coupon-page">
      <Reveal>
        <div className="offers-coupon-page__intro">
          <p className="offers-coupon-page__eyebrow">{t('offersPage.eyebrow')}</p>
          <h1 className="offers-coupon-page__title">{t('offersPage.title')}</h1>
          <p className="offers-coupon-page__lead">{t('offersPage.description')}</p>
        </div>
      </Reveal>

      {!items.length ? (
        <Reveal delay={80}>
          <p className="offers-coupon-page__empty">{t('offersPage.empty')}</p>
        </Reveal>
      ) : (
        <div className="offers-coupon-page__list">
          {items.map((offer, index) => (
            <Reveal key={offer.id} delay={staggerDelay(index, 80)} className="h-full">
              <OfferCouponCard
                offer={offer}
                bookLabel={t('offersPage.bookAppointment')}
                validUntilLabel={t('offersPage.validUntil')}
                featuredLabel={t('offersPage.featured')}
                language={i18n.language}
                onBook={() => setShowModal(true)}
              />
            </Reveal>
          ))}
        </div>
      )}

      <AppointmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </section>
  );
}
