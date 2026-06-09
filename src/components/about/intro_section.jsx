'use client';

function IntroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f4faf9] via-[#ffffff] to-[#e6f3ef]">
      <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[#037B76]/10 blur-3xl" />
      <div className="absolute bottom-0 -right-16 h-56 w-56 rounded-full bg-[#AED5C6]/40 blur-3xl" />

      <div className="relative px-[30px] lg:px-[120px] pb-14 md:pb-18 lg:pb-22 pt-4">
        <p className="inline-flex rounded-full border border-[#037B76]/25 bg-white/75 px-4 py-2 text-[12px] md:text-[13px] font-semibold tracking-[0.12em] text-[#037B76]">
          STAR HEALTH MEDICAL CENTRE
        </p>
        <h1 className="mt-4 max-w-4xl text-[30px] leading-[38px] md:text-[44px] md:leading-[56px] font-semibold text-[#002333]">
          Premium Family Healthcare Designed Around Your Everyday Life
        </h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-[24px] md:text-[17px] md:leading-[28px] text-[#4f5f66]">
          Star Health combines trusted doctors, modern diagnostics, and patient-first service in one seamless experience. This page is structured with clear sections and keyword-rich content to support your SEO strategy for healthcare services in Riyadh.
        </p>
      </div>
    </section>
  );
}

export default IntroSection;
