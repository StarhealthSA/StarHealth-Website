import IntroSection from '@/components/services/intro_section';
import ServiceCardsGrid from '@/components/services/service_cards_grid';
import PremiumQualitySection from '@/components/services/premium_quality_section';
import ServicesHighlights from '@/components/services/services-highlights';
import Whatnext from '@/components/what_next';
import Reveal from '@/components/reveal';
import FaqPageSection from '@/components/shared/faq-page-section';
import { staggerDelay } from '@/lib/stagger_delay';
import whyPatientsImage from '@/assets/home/Why Patients Search for Star Health Services.png';
import familyHealthcareImage from '@/assets/home/Designed for Family Healthcare Journeys.png';
import clinicalQualityImage from '@/assets/home/Clinical Quality with Operational Clarity.png';

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

  const highlights = [
    { label: 'Specialties Under One Roof', value: '8+' },
    { label: 'Average Appointment Flow', value: '20 min' },
    { label: 'Follow-up Response Window', value: '48 hrs' },
    { label: 'Patient-Centered Care Model', value: '100%' },
  ];

  const seoContentBlocks = [
    {
      title: 'Trusted Healthcare Services at Star Health Hospital',
      text: 'Patients across Saudi Arabia choose Star Health Hospital for reliable medical care, advanced treatments, and patient-focused services. Our hospital provides comprehensive healthcare solutions through experienced doctors, modern medical facilities, and specialized departments designed to support preventive care, diagnosis, treatment, and long-term wellness.',
      image: whyPatientsImage,
      alt: 'Why patients search for Star Health services',
    },
    {
      title: 'Comprehensive Family Healthcare Under One Roof',
      text: 'Star Health Hospital is committed to making healthcare simple and accessible for families across Saudi Arabia. From routine health check-ups and pediatric care to specialist consultations and chronic disease management, our coordinated healthcare approach ensures every patient receives personalized attention and continuous medical support.',
      image: familyHealthcareImage,
      alt: 'Designed for family healthcare journeys',
    },
    {
      title: 'Advanced Medical Care with Patient-Centered Excellence',
      text: 'At Star Health Hospital Saudi Arabia, we combine clinical expertise, advanced technology, and compassionate care to deliver high-quality healthcare experiences. Our dedicated medical team focuses on accurate diagnosis, effective treatment plans, and clear communication to help patients make confident decisions about their health.',
      image: clinicalQualityImage,
      alt: 'Clinical quality with operational clarity at Star Health',
    },
  ];

  const process = [
    {
      title: 'Book & Triage',
      body: 'We identify the most relevant specialty and urgency before your visit to improve care speed.',
    },
    {
      title: 'Consult & Diagnose',
      body: 'Doctor-led clinical review supported by targeted diagnostics when needed.',
    },
    {
      title: 'Treat & Educate',
      body: 'You receive clear treatment plans, medication guidance, and lifestyle recommendations.',
    },
    {
      title: 'Review & Prevent',
      body: 'Follow-up milestones help sustain results and prevent avoidable complications.',
    },
  ];

  return (
    <div className="bg-[#f4f8f7]">
      <IntroSection />

      <ServicesHighlights highlights={highlights} />

      <section className="px-[20px] md:px-[30px] lg:px-[120px] pb-14 lg:pb-20">
        <Reveal>
          <h2 className="text-[28px] font-semibold text-[#002333]">Our Core Medical Services</h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-[25px] text-[#586971]">
            Each service line is structured for clinical depth, practical timelines, and coordinated follow-up across your complete health journey.
          </p>
        </Reveal>
        <ServiceCardsGrid className="mt-7" />
      </section>

      <section className="px-[20px] md:px-[30px] lg:px-[120px] pb-14 lg:pb-20">
        <PremiumQualitySection process={process} />
      </section>

      <section className="px-[20px] md:px-[30px] lg:px-[120px] pb-14 lg:pb-20">
        <Reveal>
          <h2 className="text-[28px] font-semibold text-[#002333]">Why Choose Star Health Hospital for Quality Healthcare?</h2>
        </Reveal>
        <div className="mt-6 grid gap-5 lg:grid-cols-3 lg:items-stretch">
          {seoContentBlocks.map((item, index) => (
            <Reveal key={item.title} delay={staggerDelay(index)} className="h-full">
              <article className="services-why-card flex h-full flex-col overflow-hidden rounded-2xl border border-[#d7e5e1] bg-white">
                <div className="relative h-52 overflow-hidden sm:h-56">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="h-full w-full object-cover transition duration-500 hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-[20px] font-semibold leading-[28px] text-[#0a3944]">{item.title}</h3>
                  <p className="mt-3 flex-1 text-[15px] leading-[25px] text-[#5e6f77]">{item.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <FaqPageSection titleKey="servicesPage.faq.title" faqPrefix="servicesPage.faq" />

      <Whatnext text={content} />
    </div>
  );
}
