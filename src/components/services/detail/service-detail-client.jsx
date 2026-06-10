'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';
import { findServiceCategoryName } from '@/lib/content/service-category-utils';
import { resolveServiceIcon } from '@/lib/content/service-icons';
import AppointmentModal from '@/components/doctors/appointment-modal';
import ServiceBanner from './service_banner';
import ServiceStickyNav from './service-sticky-nav';
import ServiceSidebar from './service-sidebar';
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
  }), [rawService, lang, categories]);

  const sections = useMemo(() => {
    const items = [];
    if (service.displayFullDescription) items.push({ id: 'about', label: t('serviceDetail.aboutService') });
    if ((service.benefits || []).length) items.push({ id: 'benefits', label: t('serviceDetail.benefits') });
    if (
      getLocalizedText(service.procedureOverview, lang)
      || getLocalizedText(service.treatmentDuration, lang)
    ) {
      items.push({ id: 'procedure', label: t('serviceDetail.procedure') });
    }
    if (
      getLocalizedText(service.recoveryInfo, lang)
      || (service.suitableFor || []).length
    ) {
      items.push({ id: 'recovery', label: t('serviceDetail.recovery') });
    }
    if ((service.faqs || []).length) items.push({ id: 'faqs', label: t('serviceDetail.faqs') });
    if ((service.galleryImages || []).length || service.videoUrl) {
      items.push({ id: 'gallery', label: t('serviceDetail.gallery') });
    }
    if (similarServices.length || recommendedServices.length) {
      items.push({ id: 'related', label: t('serviceDetail.related') });
    }
    items.push({ id: 'consultation', label: t('serviceDetail.consultation') });
    return items;
  }, [service, lang, similarServices.length, recommendedServices.length, t]);

  const openBooking = () => setShowModal(true);

  return (
    <div className="service-detail-page bg-[#FAFAF9]">
      <ServiceBanner service={service} onBookClick={openBooking} />
      <ServiceStickyNav sections={sections} />

      <div className="service-detail-container py-10 md:py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="min-w-0 space-y-16">
            <ServiceAbout service={service} />
            <ServiceBenefits service={service} lang={lang} />
            <ServiceProcedure service={service} lang={lang} />
            <ServiceRecovery service={service} lang={lang} />
            <ServiceFaqs service={service} lang={lang} />
            <ServiceGallery service={service} />
            <ServiceRelated
              similarServices={similarServices}
              recommendedServices={recommendedServices}
              lang={lang}
            />
            <ServiceConsultation onBookClick={openBooking} />
          </main>
          <ServiceSidebar service={service} lang={lang} onBookClick={openBooking} />
        </div>
      </div>

      <div className="service-mobile-cta fixed inset-x-0 bottom-0 z-40 border-t border-[#E9E7E6] bg-white/95 p-4 backdrop-blur-md lg:hidden">
        <button
          type="button"
          onClick={openBooking}
          className="doctor-cta-button w-full rounded-xl px-6 py-3.5 font-inter text-sm font-semibold text-white"
        >
          {t('serviceDetail.bookNow')}
        </button>
      </div>

      <div className="h-20 lg:hidden" aria-hidden />

      <AppointmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
