'use client';

export default function HeroBannerVideo({ playback }) {
  if (!playback?.src) return null;

  if (playback.type === 'video') {
    return (
      <div className="hero-banner-video" aria-hidden>
        <video
          className="hero-banner-video__media"
          src={playback.src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          controlsList="nodownload noplaybackrate noremoteplayback"
        />
      </div>
    );
  }

  return (
    <div className="hero-banner-video" aria-hidden>
      <iframe
        className="hero-banner-video__iframe"
        src={playback.src}
        title="Homepage banner video"
        allow="autoplay"
        referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={-1}
      />
    </div>
  );
}
