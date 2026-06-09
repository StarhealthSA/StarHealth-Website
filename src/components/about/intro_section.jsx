'use client';

import aboutBanner from '@/assets/home/drpt.png';
import Reveal from '@/components/reveal';

function IntroSection() {
  return (
    <section
      className="relative min-h-[60vh] overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${aboutBanner})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[#002333]/70 via-[#002333]/55 to-[#002333]/65" />

      <Reveal className="relative flex min-h-[inherit] flex-col items-center justify-center px-[30px] py-14 text-center md:py-18 lg:px-[120px] lg:py-22">
        <p className="inline-flex rounded-full border border-white/30 bg-white/15 px-4 py-2 text-[12px] font-semibold tracking-[0.12em] text-white backdrop-blur-sm md:text-[13px]">
          STAR HEALTH MEDICAL CENTRE
        </p>
        <h1 className="mt-4 max-w-4xl text-[30px] font-semibold leading-[38px] text-white md:text-[44px] md:leading-[56px]">
          Premium Family Healthcare Designed Around Your Everyday Life
        </h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-[24px] text-white/90 md:text-[17px] md:leading-[28px]">
          Star Health combines trusted doctors, modern diagnostics, and patient-first service in one seamless experience. This page is structured with clear sections and keyword-rich content to support your SEO strategy for healthcare services in Riyadh.
        </p>
      </Reveal>
    </section>
  );
}

export default IntroSection;
