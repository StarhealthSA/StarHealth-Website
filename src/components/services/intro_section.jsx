'use client';

import servicesBanner from '@/assets/home/dr-lady.jpg';
import Reveal from '@/components/reveal';

function IntroSection() {
  return (
    <section
      className="relative min-h-[60vh] overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${servicesBanner})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#002333]/70 via-[#002333]/55 to-[#002333]/65" />

      <Reveal className="relative flex min-h-[inherit] flex-col items-center justify-center px-[30px] py-14 text-center md:py-18 lg:px-[120px] lg:py-22">
        <p className="inline-flex rounded-full border border-white/30 bg-white/15 px-4 py-2 text-[12px] font-semibold tracking-[0.12em] text-white backdrop-blur-sm md:text-[13px]">
          STAR HEALTH SERVICES
        </p>
        <h1 className="mt-4 max-w-4xl text-[30px] font-semibold leading-[38px] text-white md:text-[48px] md:leading-[58px]">
          Comprehensive Medical Services for Modern Families in Riyadh
        </h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-[24px] text-white/90 md:text-[17px] md:leading-[28px]">
          Explore premium outpatient services designed around speed, safety, and continuity of care. This SEO-focused services page helps users and search engines understand your treatment scope, specialties, and patient outcomes.
        </p>
      </Reveal>
    </section>
  );
}

export default IntroSection;
