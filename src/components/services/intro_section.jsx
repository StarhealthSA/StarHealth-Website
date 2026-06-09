'use client';

function IntroSection() {
  return (
    <section className="relative overflow-hidden bg-[#062d2d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(174,213,198,0.18),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(3,123,118,0.35),transparent_40%)]" />

      <div className="relative px-[30px] lg:px-[120px] pb-16 md:pb-20 lg:pb-24 pt-4">
        <p className="inline-flex rounded-full border border-[#8ec8b5] bg-white/10 px-4 py-2 text-[12px] md:text-[13px] font-semibold tracking-[0.12em] text-[#d4eee4]">
          STAR HEALTH SERVICES
        </p>
        <h1 className="mt-5 max-w-4xl text-[30px] leading-[38px] md:text-[48px] md:leading-[58px] font-semibold">
          Comprehensive Medical Services for Modern Families in Riyadh
        </h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-[24px] md:text-[17px] md:leading-[28px] text-[#c9e2d9]">
          Explore premium outpatient services designed around speed, safety, and continuity of care. This SEO-focused services page helps users and search engines understand your treatment scope, specialties, and patient outcomes.
        </p>
      </div>
    </section>
  );
}

export default IntroSection;
