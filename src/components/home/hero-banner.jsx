import HeroBannerCarousel from './hero-banner-carousel';

export default function HeroBanner({ slides = [] }) {
  const firstImage = slides.find((slide) => slide.mediaType === 'image' && slide.src);

  return (
    <>
      {firstImage ? (
        <div className="hero-banner-lcp-wrap" aria-hidden>
          <img
            src={firstImage.src}
            alt=""
            className="hero-banner-lcp"
            fetchPriority="high"
            loading="eager"
            decoding="async"
          />
          <div className="hero-banner-overlay" />
        </div>
      ) : null}
      <HeroBannerCarousel slides={slides} />
    </>
  );
}
