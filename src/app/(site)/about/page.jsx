import IntroSection from '@/components/about/intro_section';
import Whatnext from '@/components/what_next';
import Reveal from '@/components/reveal';
import FaqPageSection from '@/components/shared/faq-page-section';
import { staggerDelay } from '@/lib/stagger_delay';

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

export default function AboutPage() {
  const content =
    'Book your consultation, explore our specialties, or speak to our team. We are here to guide every step of your healthcare journey.';

  const specialties = [
    'General Medicine',
    'Family Medicine',
    'Internal Medicine',
    'Obstetrics & Gynecology',
    'Dentistry & Orthodontics',
    'Pediatrics',
    'Orthopedics',
    'Laboratory Services',
  ];

  const process = [
    {
      title: '1. Simple Appointment Access',
      body: 'Book online or by phone and get support selecting the right specialty based on your need.',
    },
    {
      title: '2. Thorough Clinical Review',
      body: 'Our doctors listen carefully, review your history, and explain diagnosis and options with clarity.',
    },
    {
      title: '3. Coordinated Treatment Plan',
      body: 'From tests to follow-ups, your care is organized across departments for better continuity.',
    },
    {
      title: '4. Follow-up and Prevention',
      body: 'We do not stop at treatment. Preventive guidance and long-term monitoring protect your health outcomes.',
    },
  ];

  return (
    <div className="bg-[#f8fbfa]">
      <IntroSection />

      <section className="px-[20px] md:px-[30px] lg:px-[120px] py-14 lg:py-20">
        <div className="grid gap-6 md:grid-cols-3 md:items-stretch">
          {[
            { title: 'Our Vision', body: 'To become the most trusted neighborhood healthcare destination in Riyadh by delivering clinical excellence with genuine human care.' },
            { title: 'Our Mission', body: 'Provide accessible, preventive, and personalized healthcare for families through modern diagnostics and multidisciplinary expertise.' },
            { title: 'Our Promise', body: 'Clear communication, ethical practice, and continuity of care from first consultation through recovery and long-term wellness.' },
          ].map((item, index) => (
            <Reveal key={item.title} delay={staggerDelay(index)} className="h-full">
              <article className="flex h-full flex-col rounded-2xl border border-[#dce9e5] bg-white p-6">
                <h2 className="text-[20px] font-semibold text-[#002333]">{item.title}</h2>
                <p className="mt-3 flex-1 text-[15px] leading-[25px] text-[#58696f]">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-[20px] md:px-[30px] lg:px-[120px] pb-14 lg:pb-20">
        <Reveal>
        <div className="overflow-hidden rounded-3xl bg-[#063330] text-white">
          <div className="grid gap-8 p-8 md:grid-cols-2 lg:p-12">
            <div>
              <h2 className="text-[28px] leading-[36px] font-semibold">Built for Premium Patient Experience</h2>
              <p className="mt-4 text-[15px] leading-[25px] text-[#d0e2dc]">
                From reception flow to consultation rooms, every touchpoint is designed for calm, privacy, and confidence. We focus on reducing waiting friction and improving communication across the complete care path.
              </p>
            </div>
            <div className="about-equal-cards grid grid-cols-2 gap-4 items-stretch">
              {[
                { label: 'Average Wait', value: '15-20 min' },
                { label: 'Patient Follow-ups', value: '48 hrs' },
                { label: 'Specialties', value: '8+' },
                { label: 'Care Model', value: 'Family-first' },
              ].map((stat, index) => (
                <Reveal key={stat.label} delay={staggerDelay(index, 70)} className="h-full">
                  <div className="flex h-full min-h-[108px] flex-col rounded-xl bg-white/10 p-4">
                    <p className="text-[12px] uppercase tracking-[0.12em] text-[#aed5c6]">{stat.label}</p>
                    <p className="mt-auto pt-2 text-[26px] font-semibold">{stat.value}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
        </Reveal>
      </section>

      <section className="px-[20px] md:px-[30px] lg:px-[120px] pb-14 lg:pb-20">
        <Reveal>
          <h2 className="text-[28px] font-semibold text-[#002333]">Core Medical Specialties</h2>
          <p className="mt-3 max-w-3xl text-[15px] leading-[25px] text-[#5b6a71]">
            Our multidisciplinary services support preventive care, acute treatment, chronic condition management, and long-term family wellness.
          </p>
        </Reveal>
        <div className="about-equal-cards mt-6 grid gap-3 sm:grid-cols-2 sm:items-stretch lg:grid-cols-4">
          {specialties.map((item, index) => (
            <Reveal key={item} delay={staggerDelay(index, 60)} className="h-full">
              <div className="flex h-full min-h-[52px] items-center rounded-xl border border-[#d8e6e2] bg-white px-4 py-3 text-[15px] font-medium text-[#123f49]">
                {item}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-[20px] md:px-[30px] lg:px-[120px] pb-14 lg:pb-20">
        <Reveal>
          <h2 className="text-[28px] font-semibold text-[#002333]">How Care Works at Star Health</h2>
        </Reveal>
        <div className="about-equal-cards mt-6 grid gap-4 sm:grid-cols-2 sm:items-stretch lg:grid-cols-2">
          {process.map((item, index) => (
            <Reveal key={item.title} delay={staggerDelay(index)} className="h-full">
              <article className="flex h-full flex-col rounded-2xl border border-[#dfebe7] bg-white p-6">
                <h3 className="text-[19px] font-semibold text-[#02353f]">{item.title}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-[25px] text-[#5a6b72]">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <FaqPageSection titleKey="aboutPage.faq.title" faqPrefix="aboutPage.faq" />

      <Whatnext text={content} />
    </div>
  );
}
