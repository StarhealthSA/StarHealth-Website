'use client';

import { useTranslation } from 'react-i18next';
import Reveal, { staggerDelay } from '@/components/reveal';
import heroImage from '@/assets/home/insurance-bg.png';
import { getLocalizedText } from '@/lib/content/localized';
import { toPublicInsurancePartner } from '@/lib/content/insurance-public';

function PartnerCard({ partner }) {
  const content = (
    <>
      <div className="insurance-partner-card__logo-wrap">
        {partner.logoUrl ? (
          <img
            src={partner.logoUrl}
            alt=""
            className="insurance-partner-card__logo"
          />
        ) : (
          <span className="insurance-partner-card__logo-fallback">
            {partner.name?.charAt(0) || '?'}
          </span>
        )}
      </div>
      <h3 className="insurance-partner-card__name">{partner.name}</h3>
    </>
  );

  if (partner.websiteUrl) {
    return (
      <a
        href={partner.websiteUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="insurance-partner-card"
      >
        {content}
      </a>
    );
  }

  return <article className="insurance-partner-card">{content}</article>;
}

export default function InsuranceListing({ partners = [], settings = null }) {
  const { t, i18n } = useTranslation();
  const items = partners
    .map((partner) => toPublicInsurancePartner(partner, i18n.language))
    .filter(Boolean);

  const heroTitle =
    getLocalizedText(settings?.heroTitle, i18n.language)
    || t('insurancePage.hero.title');
  const heroSubtitle =
    getLocalizedText(settings?.heroSubtitle, i18n.language)
    || t('insurancePage.hero.description');

  return (
    <div className="insurance-page">
      <section className="insurance-page__hero">
        <div className="insurance-page__hero-media" aria-hidden>
          <img
            src={typeof heroImage === 'string' ? heroImage : heroImage.src}
            alt=""
            className="insurance-page__hero-image"
          />
          <div className="insurance-page__hero-shade" />
        </div>
        <div className="insurance-page__hero-copy">
          <Reveal>
            <h1 className="insurance-page__hero-title">{heroTitle}</h1>
            <p className="insurance-page__hero-lead">{heroSubtitle}</p>
          </Reveal>
        </div>
      </section>

      <section className="insurance-page__partners">
        <Reveal>
          <h2 className="insurance-page__partners-title">
            {t('insurancePage.partnersTitle')}
          </h2>
        </Reveal>

        {!items.length ? (
          <Reveal delay={80}>
            <p className="insurance-page__empty">{t('insurancePage.empty')}</p>
          </Reveal>
        ) : (
          <div className="insurance-page__grid">
            {items.map((partner, index) => (
              <Reveal key={partner.id} delay={staggerDelay(index, 50)} className="h-full">
                <PartnerCard partner={partner} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
