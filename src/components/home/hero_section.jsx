import HeroBanner from './hero-banner';
import HeroSectionContent from './hero-section-content';
import { getActiveHeroSlides } from '@/lib/content/hero-slides';

export default function HeroSection({ homeSettings = null }) {
  const slides = getActiveHeroSlides(homeSettings?.heroSlides || []);
  const hasCustomBanner = slides.length > 0;

  return (
    <section
      className={`home-header relative flex w-full min-h-[85vh] items-end overflow-hidden sm:items-center ${
        hasCustomBanner ? 'hero-header--media' : 'bground bg-cover'
      }`}
    >
      {hasCustomBanner && <HeroBanner slides={slides} />}
      {hasCustomBanner ? (
        <div className="hero-banner-overlay absolute inset-0" aria-hidden />
      ) : null}

      <HeroSectionContent homeSettings={homeSettings} />
    </section>
  );
}
