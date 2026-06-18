'use client';

export default function HeroBannerVideo({
  playback,
  loop = true,
  onEnded,
  active = true,
}) {
  if (!playback?.src || !active) return null;

  if (playback.type === 'video') {
    return (
      <div className="hero-banner-video" aria-hidden>
        <video
          key={playback.src}
          className="hero-banner-video__media"
          src={playback.src}
          autoPlay
          muted
          loop={loop}
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          controlsList="nodownload noplaybackrate noremoteplayback"
          onEnded={loop ? undefined : onEnded}
        />
      </div>
    );
  }

  return (
    <div className="hero-banner-video" aria-hidden>
      <iframe
        key={playback.src}
        className="hero-banner-video__iframe"
        src={playback.src}
        title="Homepage banner video"
        allow="autoplay; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={-1}
      />
    </div>
  );
}
