import IntroSection from '@/components/services/intro_section';
import PremiumQualitySection from '@/components/services/premium_quality_section';
import ServicesHighlights from '@/components/services/services-highlights';
import ServicesCoreSection from '@/components/services/services_core_section';
import ServicesWhyChooseSection from '@/components/services/services_why_choose_section';
import Whatnext from '@/components/what_next';
import FaqPageSection from '@/components/shared/faq-page-section';

export const metadata = {
  title: 'Medical Services in Riyadh | Star Health',
  description:
    'Explore Star Health medical services in Riyadh including family medicine, pediatrics, dentistry, gynecology, orthopedics, internal medicine, and diagnostics.',
  keywords:
    'medical services riyadh, family clinic, pediatrics riyadh, gynecology clinic, dental clinic, orthopedics, internal medicine, diagnostics',
  openGraph: {
    title: 'Medical Services in Riyadh | Star Health',
    description:
      'Premium outpatient healthcare services for families in Riyadh with experienced doctors and modern diagnostics.',
  },
};

export default function ServicesPage() {
  const content =
    'Need guidance? Book an appointment, call our care team, or visit us for a complete consultation across specialties.';

  return (
    <div className="bg-[#f4f8f7]">
      <IntroSection />

      <ServicesHighlights />

      <ServicesCoreSection />

      <section className="px-[20px] md:px-[30px] lg:px-[120px] pb-14 lg:pb-20">
        <PremiumQualitySection />
      </section>

      <ServicesWhyChooseSection />

      <FaqPageSection titleKey="servicesPage.faq.title" faqPrefix="servicesPage.faq" />

      <Whatnext text={content} />
    </div>
  );
}
