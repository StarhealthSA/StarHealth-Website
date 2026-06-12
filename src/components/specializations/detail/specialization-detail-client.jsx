'use client';

import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';
import { findServiceCategoryName } from '@/lib/content/service-category-utils';
import { resolveServiceBannerImage, resolveServiceIcon } from '@/lib/content/service-icons';
import { normalizeMarketing } from '@/lib/content/service-marketing';
import { specializationToServiceShape } from '@/lib/content/normalize-specialization';
import { getSpecializationMatchedDoctors } from '@/lib/content/specialization-doctors';
import AppointmentModal from '@/components/doctors/appointment-modal';
import ServiceBanner from '@/components/services/detail/service_banner';
import ServiceAbout from '@/components/services/detail/service_about';
import ServiceBenefits from '@/components/services/detail/service_benefits';
import ServiceProcedure from '@/components/services/detail/service_procedure';
import ServiceRecovery from '@/components/services/detail/service_recovery';
import ServiceFaqs from '@/components/services/detail/service_faqs';
import ServiceGallery from '@/components/services/detail/service_gallery';
import ServiceConsultation from '@/components/services/detail/service_consultation';
import ServiceDoctors from '@/components/services/detail/service-doctors';
import ServiceTestimonials from '@/components/services/detail/service-testimonials';

export default function SpecializationDetailClient({
  specialization: rawSpec,
  parentService = null,
  categories = [],
  doctors = [],
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [showModal, setShowModal] = useState(false);

  const serviceShape = useMemo(() => specializationToServiceShape(rawSpec), [rawSpec]);
  const marketing = useMemo(
    () => normalizeMarketing(serviceShape.marketing),
    [serviceShape.marketing]
  );

  const service = useMemo(() => ({
    ...serviceShape,
    marketing,
    displayTitle: getLocalizedText(serviceShape.title, lang),
    displayShortDescription: getLocalizedText(serviceShape.shortDescription, lang),
    displayFullDescription: getLocalizedText(serviceShape.fullDescription, lang),
    displayCategory: findServiceCategoryName(categories, serviceShape.categoryId, lang),
    icon: resolveServiceIcon(serviceShape),
    bannerImage: resolveServiceBannerImage(serviceShape),
  }), [serviceShape, lang, categories, marketing]);

  const matchedDoctors = useMemo(
    () => getSpecializationMatchedDoctors({
      doctors,
      specializationId: rawSpec.id,
    }),
    [doctors, rawSpec.id]
  );

  const showWhatsApp = marketing.whatsappEnabled !== false;
  const hasTestimonials =
    (marketing.testimonials || []).some(
      (item) => getLocalizedText(item.quote, lang) && getLocalizedText(item.name, lang)
    )
    || marketing.showGlobalTestimonials !== false;

  const backHref = parentService?.slug ? `/services/${parentService.slug}` : '/services';
  const backLabel = parentService
    ? t('specializationDetail.backToService', { service: getLocalizedText(parentService.title, lang) })
    : t('specializationDetail.backToServices');

  const openBooking = () => setShowModal(true);

  return (
    <div className="service-landing-page bg-[#FAFAF9]">
      <ServiceBanner
        service={service}
        marketing={marketing}
        onBookClick={openBooking}
        lang={lang}
        showWhatsApp={showWhatsApp}
        backHref={backHref}
        backLabel={backLabel}
      />

      <ServiceBenefits service={service} lang={lang} />
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
      />
    </div>
  );
}
