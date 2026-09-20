import IntroSection from '@/components/about/intro_section';
import AboutPillarsSection from '@/components/about/about_pillars_section';
import AboutExperienceSection from '@/components/about/about_experience_section';
import AboutSpecialtiesSection from '@/components/about/about_specialties_section';
import AboutCareProcessSection from '@/components/about/about_care_process_section';
import WhyChooseStarHealth from '@/components/shared/why-choose-star-health';
import Whatnext from '@/components/what_next';
import FaqPageSection from '@/components/shared/faq-page-section';

export const revalidate = 60;

export const metadata = {
  title: 'About Star Health | Premium Medical Care in Riyadh',
  description:
    'Learn about Star Health Medical Centre in Riyadh: our mission, specialties, patient process, quality standards, and trusted care model for families.',
  keywords:
    'about star health, medical centre riyadh, family medicine, pediatrics, dentistry, women health, trusted clinic',
  openGraph: {
    title: 'About Star Health | Premium Medical Care in Riyadh',
    description:
      'Discover Star Health values, services, quality approach, and patient-first care in Riyadh.',
  },
};

export default async function AboutPage() {
  const content =
    'Book your consultation, explore our specialties, or speak to our team. We are here to guide every step of your healthcare journey.';
  return (
    <div className="bg-[#f8fbfa]">
      <IntroSection />

      <WhyChooseStarHealth />

      <AboutPillarsSection />

      <AboutExperienceSection />

      <AboutSpecialtiesSection />

      <AboutCareProcessSection />

      <FaqPageSection titleKey="aboutPage.faq.title" faqPrefix="aboutPage.faq" />

      <Whatnext text={content} />
    </div>
  );
}
