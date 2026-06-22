import IntroSection from '@/components/services/intro_section';
import ServiceCardsGrid from '@/components/services/service_cards_grid';
import PremiumQualitySection from '@/components/services/premium_quality_section';
import Whatnext from '@/components/what_next';
import Reveal from '@/components/reveal';
import FaqPageSection from '@/components/shared/faq-page-section';
import { staggerDelay } from '@/lib/stagger_delay';

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
      title: 'Why Patients Search for Star Health Services',
      text: 'Patients looking for trusted medical services in Riyadh often need one center that handles preventive, acute, and long-term care. Star Health addresses this with multidisciplinary clinics, evidence-based decisions, and clear communication at each stage of treatment.',
    },
    {
      title: 'Designed for Family Healthcare Journeys',
      text: 'Families need convenience without compromising medical quality. Our service model supports parents, children, and seniors with coordinated appointments, shared health context, and practical follow-up plans that reduce repeat visits and confusion.',
    },
    {
      title: 'Clinical Quality with Operational Clarity',
      text: 'Our team balances medical depth with service efficiency. From consultation to test results and review, we provide transparent next steps, documented care plans, and active support so patients can make informed decisions confidently.',
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

      <section className="px-[20px] md:px-[30px] lg:px-[120px] py-14 lg:py-20">
        <div className="grid gap-4 sm:grid-cols-2 sm:items-stretch lg:grid-cols-4">
          {highlights.map((item, index) => (
            <Reveal key={item.label} delay={staggerDelay(index)} className="h-full">
              <article className="flex h-full flex-col rounded-2xl border border-[#d7e6e2] bg-white p-6">
                <p className="text-[13px] font-semibold tracking-[0.09em] uppercase text-[#5d737b]">{item.label}</p>
                <p className="mt-auto pt-2 text-[34px] font-semibold leading-[40px] text-[#002f3b]">{item.value}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

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
          <h2 className="text-[28px] font-semibold text-[#002333]">SEO-Focused Healthcare Information</h2>
        </Reveal>
        <div className="mt-6 grid gap-4 lg:grid-cols-3 lg:items-stretch">
          {seoContentBlocks.map((item, index) => (
            <Reveal key={item.title} delay={staggerDelay(index)} className="h-full">
              <article className="flex h-full flex-col rounded-2xl border border-[#d7e5e1] bg-white p-6">
                <h3 className="text-[20px] font-semibold leading-[28px] text-[#0a3944]">{item.title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-[25px] text-[#5e6f77]">{item.text}</p>
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
