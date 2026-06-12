'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export default function ServiceBookingSidebar({
  service,
  marketing,
  lang,
  onBookClick,
  hideWhenId = 'book',
}) {
  const { t } = useTranslation();
  const [hidden, setHidden] = useState(false);
  const duration = getLocalizedText(service.treatmentDuration, lang);
  const showWhatsApp = marketing?.whatsappEnabled !== false;

  useEffect(() => {
    const target = document.getElementById(hideWhenId);
    if (!target) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.2 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [hideWhenId]);

  if (hidden) return null;

  const whatsappUrl = buildWhatsAppUrl(
    t('serviceDetail.whatsappMessage', { service: service.displayTitle })
  );

  return (
    <aside className="service-booking-sidebar hidden lg:block" aria-label={t('serviceDetail.quickBook')}>
      <div className="service-booking-sidebar__card">
        <p className="font-inter text-xs font-semibold uppercase tracking-[0.15em] text-[#037B76]">
          {t('serviceDetail.quickBook')}
        </p>
        <h2 className="service-display-title mt-2 text-xl font-semibold text-[#002333]">
          {service.displayTitle}
        </h2>
        <p className="mt-2 line-clamp-3 font-inter text-sm leading-relaxed text-[#586971]">
          {service.displayShortDescription}
        </p>
        {duration && (
          <p className="mt-3 font-inter text-xs text-[#037B76]">
            {t('serviceDetail.treatmentDuration')}: {duration}
          </p>
        )}
        <button type="button" onClick={onBookClick} className="service-landing-cta-primary mt-5 w-full">
          {t('serviceDetail.bookNow')}
        </button>
        {showWhatsApp && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="service-landing-cta-whatsapp mt-3 w-full text-center"
          >
            {t('serviceDetail.whatsappCta')}
          </a>
        )}
        <a href="tel:+966505730003" className="mt-3 block text-center font-inter text-sm text-[#037B76] hover:underline">
          +966 505 730 003
        </a>
      </div>
    </aside>
  );
}
