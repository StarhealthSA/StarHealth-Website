'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Reveal, { staggerDelay } from '@/components/reveal';
import NavLink from '@/components/nav_link';
import OfferAppointmentModal from '@/components/offers/offer-appointment-modal';
import GiveawayOfferCard from '@/components/giveaway/giveaway-offer-card';
import { toPublicOffer } from '@/lib/content/offer-public';

export default function GiveawayOffersSection({ offers = [] }) {
  const { t, i18n } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState('');

  const items = offers
    .map((offer) => toPublicOffer(offer, i18n.language))
    .filter(Boolean)
    .slice(0, 2);

  const openBooking = (offerId = '') => {
    setSelectedOfferId(offerId);
    setShowModal(true);
  };

  return (
    <section className="giveaway-offers" id="packages">
      <Reveal className="giveaway-offers__intro">
        <h2 className="giveaway-offers__title">{t('giveawayPage.packages.title')}</h2>
        <p className="giveaway-offers__lead">{t('giveawayPage.packages.lead')}</p>
      </Reveal>

      {!items.length ? (
        <Reveal delay={80}>
          <div className="giveaway-offers__empty">
            <p>{t('giveawayPage.packages.empty')}</p>
          </div>
        </Reveal>
      ) : (
        <div className="giveaway-offers__grid">
          {items.map((offer, index) => (
            <Reveal key={offer.id} delay={staggerDelay(index, 80)} className="h-full">
              <GiveawayOfferCard
                offer={offer}
                bookLabel={t('offersPage.bookAppointment')}
                featuredLabel={t('offersPage.featured')}
                language={i18n.language}
                onBook={() => openBooking(offer.id)}
              />
            </Reveal>
          ))}
        </div>
      )}

      <Reveal className="giveaway-offers__footer">
        <NavLink href="/offers" className="giveaway-cta giveaway-cta--offers">
          {t('giveawayPage.packages.viewOffers')}
        </NavLink>
      </Reveal>

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
