'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Reveal from '@/components/reveal';
import DoctorSectionHeader from './doctor-section-header';
import { useTranslation } from 'react-i18next';
import { getLocalizedText } from '@/lib/content/localized';
import {
  detectReelPlatform,
  getInstagramEmbedUrl,
  getReelIframeSrc,
  getReelThumbnail,
  isEmbeddableReel,
  isInlineVideoReel,
  isInstagramReel,
  sortReels,
} from '@/lib/content/reel-utils';

function ReelSlide({
  reel,
  title,
  isActive,
}) {
  const { t } = useTranslation();
  const videoRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const platform = reel.platform || detectReelPlatform(reel.url);
  const isInstagram = isInstagramReel(reel);
  const instagramEmbed = isInstagram ? getInstagramEmbedUrl(reel.url) : '';
  const thumbnail = isInstagram ? '' : getReelThumbnail(reel);
  const isNativeVideo = isInlineVideoReel(reel);
  const isEmbeddable = isEmbeddableReel(reel);
  const iframeSrc = getReelIframeSrc(reel);
  const isPlaying = videoPlaying || isExpanded;

  useEffect(() => {
    if (!isActive && videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      setVideoPlaying(false);
    }

    if (!isActive && isExpanded) {
      setIsExpanded(false);
    }
  }, [isActive, isExpanded]);

  const handleClose = () => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
    setVideoPlaying(false);
    setIsExpanded(false);
  };

  const handlePlay = () => {
    if (isNativeVideo && reel.url) {
      videoRef.current?.play();
      return;
    }

    if (isEmbeddable) {
      setIsExpanded(true);
      return;
    }

    if (reel.url) {
      window.open(reel.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <article
      className={`doctor-reel-card doctor-reel-slide w-[260px] shrink-0 overflow-hidden sm:w-[280px] ${
        isActive ? 'doctor-reel-slide-active' : 'doctor-reel-slide-inactive'
      }`}
    >
      <div
        className={`doctor-reel-media relative aspect-[9/16] w-full bg-[#111] ${
          isInstagram ? 'doctor-reel-instagram' : ''
        }`}
      >
        {isInstagram && instagramEmbed && (
          <iframe
            src={instagramEmbed}
            title={title}
            scrolling="no"
            className="h-full w-full border-0 bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}

        {!isInstagram && isNativeVideo && reel.url && (
          <video
            ref={videoRef}
            src={reel.url}
            controls={videoPlaying}
            playsInline
            poster={thumbnail || undefined}
            className={`absolute inset-0 h-full w-full object-cover ${videoPlaying ? 'z-20' : 'pointer-events-none opacity-0'}`}
            onPlay={() => setVideoPlaying(true)}
            onPause={() => setVideoPlaying(false)}
            onEnded={() => setVideoPlaying(false)}
          />
        )}

        {!isInstagram && isEmbeddable && isExpanded && iframeSrc && (
          <iframe
            src={`${iframeSrc}&autoplay=1`}
            title={title}
            className="absolute inset-0 z-20 h-full w-full border-0 bg-black"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}

        {!isInstagram && (
          <>
            {thumbnail ? (
              <img
                src={thumbnail}
                alt=""
                className="doctor-reel-thumbnail absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#025e5a] via-[#037B76] to-[#063330]" />
            )}

            {!isPlaying && (
              <button
                type="button"
                onClick={handlePlay}
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 transition hover:bg-black/30"
                aria-label={title}
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-[#037B76] shadow-lg">
                  <svg viewBox="0 0 24 24" className="ms-1 h-7 w-7 fill-current" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            )}

            {isPlaying && (isExpanded || videoPlaying) && (
              <button
                type="button"
                onClick={handleClose}
                className="absolute end-3 top-3 z-30 rounded-full bg-black/55 px-2.5 py-1 font-inter text-xs font-medium text-white"
              >
                Close
              </button>
            )}
          </>
        )}
      </div>

      <div className="border-t border-[#E9E7E6] bg-white p-4">
        <p className="font-inter text-sm font-semibold text-[#002333]">{title}</p>
        <p className="mt-1 font-inter text-xs text-[#037B76]">
          {isInstagram
            ? t('doctorDetail.tapToWatch')
            : isPlaying
              ? 'Now playing'
              : platform === 'tiktok'
                ? 'Tap to open'
                : 'Tap to play'}
        </p>
      </div>
    </article>
  );
}

export default function DoctorReels({ doctor }) {
  const { t, i18n } = useTranslation();
  const reels = sortReels(doctor.reels || []);
  const [activeIndex, setActiveIndex] = useState(0);
  const viewportRef = useRef(null);
  const slideRefs = useRef([]);
  const isNavigatingRef = useRef(false);
  const navigateTimerRef = useRef(null);

  const getSlideScrollLeft = useCallback((index) => {
    const viewport = viewportRef.current;
    const slide = slideRefs.current[index];
    if (!viewport || !slide) return 0;

    return slide.getBoundingClientRect().left
      - viewport.getBoundingClientRect().left
      + viewport.scrollLeft;
  }, []);

  const scrollToIndex = useCallback((index) => {
    const viewport = viewportRef.current;
    const slide = slideRefs.current[index];
    if (!viewport || !slide) return;

    if (navigateTimerRef.current) {
      window.clearTimeout(navigateTimerRef.current);
    }

    isNavigatingRef.current = true;
    setActiveIndex(index);

    viewport.scrollTo({
      left: getSlideScrollLeft(index),
      behavior: 'smooth',
    });

    navigateTimerRef.current = window.setTimeout(() => {
      isNavigatingRef.current = false;
    }, 450);
  }, [getSlideScrollLeft]);

  const goTo = (index) => {
    scrollToIndex((index + reels.length) % reels.length);
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return undefined;

    let scrollTimer;

    const syncActiveIndex = () => {
      if (isNavigatingRef.current) return;

      const scrollLeft = viewport.scrollLeft;
      let closest = 0;
      let minDistance = Infinity;

      slideRefs.current.forEach((slide, index) => {
        if (!slide) return;
        const distance = Math.abs(getSlideScrollLeft(index) - scrollLeft);
        if (distance < minDistance) {
          minDistance = distance;
          closest = index;
        }
      });

      setActiveIndex(closest);
    };

    const handleScroll = () => {
      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(syncActiveIndex, 80);
    };

    viewport.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      viewport.removeEventListener('scroll', handleScroll);
      window.clearTimeout(scrollTimer);
      if (navigateTimerRef.current) {
        window.clearTimeout(navigateTimerRef.current);
      }
    };
  }, [getSlideScrollLeft, reels.length]);

  if (!reels.length) return null;

  return (
    <section id="reels" className="doctor-detail-section scroll-mt-32">
      <Reveal>
        <DoctorSectionHeader
          eyebrow={t('doctorDetail.watchAndLearn')}
          title={t('doctorDetail.reels')}
          description={t('doctorDetail.reelsDescription')}
        />
      </Reveal>

      <div className="doctor-reels-carousel mt-8">
        <div
          ref={viewportRef}
          className="doctor-reels-viewport scrollbar-hide flex gap-5 overflow-x-auto overflow-y-hidden pb-1"
        >
          {reels.map((reel, index) => {
            const title = getLocalizedText(reel.title, i18n.language) || t('doctorDetail.reelFallback');
            return (
              <div
                key={reel.id || index}
                ref={(node) => {
                  slideRefs.current[index] = node;
                }}
                className="shrink-0 snap-start"
              >
                <ReelSlide
                  reel={reel}
                  title={title}
                  isActive={index === activeIndex}
                />
              </div>
            );
          })}
        </div>

        {reels.length > 1 && (
          <div className="mt-5 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              className="doctor-reel-nav-btn"
              aria-label="Previous reel"
            >
              ‹
            </button>

            <div className="flex gap-2">
              {reels.map((reel, index) => (
                <button
                  key={reel.id || index}
                  type="button"
                  onClick={() => scrollToIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    index === activeIndex ? 'w-7 bg-[#037B76]' : 'w-2.5 bg-[#D8E7E4]'
                  }`}
                  aria-label={`Go to reel ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              className="doctor-reel-nav-btn"
              aria-label="Next reel"
            >
              ›
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
