'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';
import { resolveServiceBannerImage, resolveServiceIcon } from '@/lib/content/service-icons';
import { normalizeMarketing } from '@/lib/content/service-marketing';
import { getServiceMatchedDoctors } from '@/lib/content/service-doctors';
import AppointmentModal from '@/components/doctors/appointment-modal';
import ServiceBanner from './service_banner';
import ServiceAbout from './service_about';
import ServiceProcedure from './service_procedure';
import ServiceRecovery from './service_recovery';
import ServiceFaqs from './service_faqs';
import ServiceGallery from './service_gallery';
import ServiceConsultation from './service_consultation';
import ServiceDoctors from './service-doctors';
import ServiceTestimonials from './service-testimonials';
import ServiceSpecializations from './service-specializations';
import { getSpecializationsForService } from '@/lib/content/specialization-utils';

export default function ServiceDetailClient({
  service: rawService,
  doctors = [],
  specializations = [],
  childSpecializations = [],
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [showModal, setShowModal] = useState(false);

  const marketing = useMemo(
    () => normalizeMarketing(rawService.marketing),
    [rawService.marketing]
  );

  const service = useMemo(() => ({
    ...rawService,
    marketing,
    displayTitle: getLocalizedText(rawService.title, lang),
    displayShortDescription: getLocalizedText(rawService.shortDescription || rawService.description, lang),
    displayFullDescription: getLocalizedText(rawService.fullDescription || rawService.description, lang),
    icon: resolveServiceIcon(rawService),
    bannerImage: resolveServiceBannerImage(rawService),
  }), [rawService, lang, marketing]);

  const matchedDoctors = useMemo(
    () => getServiceMatchedDoctors({
      doctors,
      serviceId: rawService.id,
      specializations,
    }),
    [doctors, rawService.id, specializations]
  );

  const serviceSpecializations = useMemo(
    () => childSpecializations.length
      ? childSpecializations
      : getSpecializationsForService(specializations, rawService),
    [childSpecializations, specializations, rawService]
  );

  const showWhatsApp = marketing.whatsappEnabled !== false;

  const hasTestimonials =
    (marketing.testimonials || []).some(
      (item) => getLocalizedText(item.quote, lang) && getLocalizedText(item.name, lang)
    )
    || marketing.showGlobalTestimonials !== false;

  const openBooking = () => setShowModal(true);

  return (
    <div className="service-landing-page bg-[#FAFAF9]">
      <ServiceBanner
        service={service}
        marketing={marketing}
        onBookClick={openBooking}
        lang={lang}
        showWhatsApp={showWhatsApp}
      />

      <ServiceSpecializations items={serviceSpecializations} lang={lang} />
      <ServiceAbout service={service} />
      {matchedDoctors.length > 0 && (
        <ServiceDoctors matchedDoctors={matchedDoctors} lang={lang} />
      )}
      <ServiceProcedure service={service} lang={lang} />
      <ServiceRecovery service={service} lang={lang} />
      <ServiceGallery service={service} />
      {hasTestimonials && <ServiceTestimonials marketing={marketing} lang={lang} />}
      <ServiceFaqs service={service} lang={lang} />
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
        preselectedServiceId={rawService.id}
      />
    </div>
  );
}
