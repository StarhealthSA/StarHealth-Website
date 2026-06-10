'use client';

import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';

export default function ServiceSidebar({ service, lang, onBookClick }) {
  const { t } = useTranslation();
  const duration = getLocalizedText(service.treatmentDuration, lang);

  return (
    <aside className="service-sidebar lg:sticky lg:top-36">
      <div className="doctor-credential-card">
        <p className="font-inter text-xs font-semibold uppercase tracking-[0.2em] text-[#037B76]">
          {t('serviceDetail.quickInfo')}
        </p>
        <h3 className="doctor-display-title mt-2 text-xl font-semibold text-[#002333]">
          {service.displayTitle}
        </h3>

        <dl className="mt-5 space-y-4">
          {service.displayCategory && (
            <div>
              <dt className="font-inter text-xs font-medium text-[#687276]">{t('serviceDetail.category')}</dt>
              <dd className="mt-1 font-inter text-sm font-medium text-[#002333]">{service.displayCategory}</dd>
            </div>
          )}
          {duration && (
            <div>
              <dt className="font-inter text-xs font-medium text-[#687276]">{t('serviceDetail.treatmentDuration')}</dt>
              <dd className="mt-1 font-inter text-sm font-medium text-[#002333]">{duration}</dd>
            </div>
          )}
        </dl>

        <button
          type="button"
          onClick={onBookClick}
          className="doctor-cta-button mt-6 w-full rounded-xl px-4 py-3 font-inter text-sm font-semibold text-white"
        >
          {t('serviceDetail.bookNow')}
        </button>
      </div>
    </aside>
  );
}
