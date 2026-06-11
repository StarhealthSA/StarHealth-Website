'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';
import { findServiceCategoryName } from '@/lib/content/service-category-utils';
import { resolveServiceBannerImage, resolveServiceIcon } from '@/lib/content/service-icons';
import AppointmentModal from '@/components/doctors/appointment-modal';
import ServiceBanner from './service_banner';
import ServiceAbout from './service_about';
import ServiceBenefits from './service_benefits';
import ServiceProcedure from './service_procedure';
import ServiceRecovery from './service_recovery';
import ServiceFaqs from './service_faqs';
import ServiceGallery from './service_gallery';
import ServiceRelated from './service_related';
import ServiceConsultation from './service_consultation';

export default function ServiceDetailClient({
  service: rawService,
  categories = [],
  similarServices = [],
  recommendedServices = [],
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [showModal, setShowModal] = useState(false);

  const service = useMemo(() => ({
    ...rawService,
    displayTitle: getLocalizedText(rawService.title, lang),
    displayShortDescription: getLocalizedText(rawService.shortDescription || rawService.description, lang),
    displayFullDescription: getLocalizedText(rawService.fullDescription || rawService.description, lang),
    displayCategory: findServiceCategoryName(categories, rawService.categoryId, lang),
    icon: resolveServiceIcon(rawService),
    bannerImage: resolveServiceBannerImage(rawService),
  }), [rawService, lang, categories]);

  const openBooking = () => setShowModal(true);

  return (
    <div className="service-landing-page bg-[#FAFAF9]">
      <ServiceBanner service={service} onBookClick={openBooking} lang={lang} />

      <ServiceBenefits service={service} lang={lang} />
      <ServiceAbout service={service} />
      <ServiceProcedure service={service} lang={lang} />
      <ServiceRecovery service={service} lang={lang} />
      <ServiceGallery service={service} />
      <ServiceFaqs service={service} lang={lang} />
      <ServiceRelated
        similarServices={similarServices}
        recommendedServices={recommendedServices}
        lang={lang}
      />
      <ServiceConsultation service={service} onBookClick={openBooking} />

      <div className="service-landing-mobile-cta fixed inset-x-0 bottom-0 z-40 border-t border-[#E9E7E6] bg-white/95 p-4 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={openBooking}
          className="service-landing-cta-primary w-full"
        >
          {t('serviceDetail.bookNow')}
        </button>
      </div>

      <div className="h-24 lg:hidden" aria-hidden />

      <AppointmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
