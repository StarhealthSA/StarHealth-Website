'use client';

import { useTranslation } from 'react-i18next';
import Reveal from '@/components/reveal';
import { GIVEAWAY } from '@/lib/giveaway/config';
import { GIVEAWAY_TERMS } from '@/lib/giveaway/terms';
import i18n from '@/i18n';
import locationQr from '@/assets/giveaway/location-qr.png';

function assetUrl(asset) {
  return typeof asset === 'string' ? asset : asset?.src || '';
}

export default function GiveawayTermsSection() {
  useTranslation(); // re-render on language change
  const isArabic = i18n.language?.startsWith('ar');

  const title = isArabic ? GIVEAWAY_TERMS.titleAr : GIVEAWAY_TERMS.titleEn;
  const items = isArabic ? GIVEAWAY_TERMS.itemsAr : GIVEAWAY_TERMS.itemsEn;
  const scanLabel = isArabic ? GIVEAWAY_TERMS.scanLabelAr : GIVEAWAY_TERMS.scanLabelEn;
  const permitLabel = isArabic
    ? GIVEAWAY_TERMS.permitLabelAr
    : GIVEAWAY_TERMS.permitLabelEn;
  const licenseeLabel = isArabic
    ? GIVEAWAY_TERMS.licenseeLabelAr
    : GIVEAWAY_TERMS.licenseeLabelEn;

  return (
    <section className="giveaway-terms" id="terms">
      <Reveal className="giveaway-terms__panel">
        <div className="giveaway-terms__layout">
          <a
            href={GIVEAWAY.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="giveaway-terms__qr"
            aria-label={scanLabel}
          >
            <div className="giveaway-terms__qr-frame">
              <img
                src={assetUrl(locationQr)}
                alt=""
                className="giveaway-terms__qr-image"
                width={160}
                height={160}
              />
              <span className="giveaway-terms__qr-pin" aria-hidden>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
                  <path
                    d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
                    fill="#8f1d32"
                  />
                  <circle cx="12" cy="10" r="2.5" fill="#fff" />
                </svg>
              </span>
            </div>
            <span className="giveaway-terms__qr-label">{scanLabel}</span>
          </a>

          <div
            className="giveaway-terms__block"
            dir={isArabic ? 'rtl' : 'ltr'}
            lang={isArabic ? 'ar' : 'en'}
          >
            <h2 className="giveaway-terms__heading">{title}</h2>
            <ol className="giveaway-terms__list">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>

            <div className="giveaway-terms__permit">
              <p>
                <span className="giveaway-terms__permit-label">{permitLabel}:</span>{' '}
                <span className="giveaway-terms__permit-value">
                  {GIVEAWAY_TERMS.permitNumber}
                </span>
              </p>
              <p>
                <span className="giveaway-terms__permit-label">{licenseeLabel}:</span>{' '}
                <span className="giveaway-terms__permit-value" dir="rtl" lang="ar">
                  {GIVEAWAY_TERMS.licenseeAr}
                </span>
                <span className="giveaway-terms__permit-en">
                  ({GIVEAWAY_TERMS.licenseeEn})
                </span>
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
