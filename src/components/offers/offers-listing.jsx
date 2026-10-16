'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Reveal, { staggerDelay } from '@/components/reveal';
import OfferAppointmentModal from '@/components/offers/offer-appointment-modal';
import OfferCouponCard from '@/components/offers/offer-coupon-card';
import { toPublicOffer } from '@/lib/content/offer-public';

export default function OffersListing({ offers = [] }) {
  const { t, i18n } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const items = offers
    .map((offer) => toPublicOffer(offer, i18n.language))
    .filter(Boolean);

  const openBooking = (offerId = '') => {
    setSelectedOfferId(offerId);
    setShowModal(true);
  };

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
                onBook={() => openBooking(offer.id)}
              />
            </Reveal>
          ))}
        </div>
      )}

      <OfferAppointmentModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedOfferId('');
        }}
        offers={items}
        preselectedOfferId={selectedOfferId}
      />
    </section>
  );
}
