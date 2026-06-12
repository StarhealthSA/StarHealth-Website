'use client';

import { useTranslation } from 'react-i18next';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import whatsappIcon from '@/assets/home/whatsapp.svg';

export default function ServiceFloatingActions({
  serviceTitle,
  onBookClick,
  showWhatsApp = true,
  mobileOnly = false,
}) {
  const { t } = useTranslation();
  const whatsappUrl = buildWhatsAppUrl(
    t('serviceDetail.whatsappMessage', { service: serviceTitle })
  );

  return (
    <>
      {showWhatsApp && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`service-floating-whatsapp ${mobileOnly ? 'lg:hidden' : 'hidden lg:flex'}`}
          aria-label={t('serviceDetail.whatsappCta')}
        >
          <img src={whatsappIcon} alt="" className="h-7 w-7" />
        </a>
      )}

      <div className="service-landing-mobile-cta fixed inset-x-0 bottom-0 z-40 border-t border-[#E9E7E6] bg-white/95 p-4 backdrop-blur-md lg:hidden">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onBookClick}
            className="service-landing-cta-primary flex-1"
          >
            {t('serviceDetail.bookNow')}
          </button>
          {showWhatsApp && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="service-landing-cta-whatsapp flex-1 text-center"
            >
              {t('serviceDetail.whatsappCta')}
            </a>
          )}
        </div>
      </div>
    </>
  );
}
