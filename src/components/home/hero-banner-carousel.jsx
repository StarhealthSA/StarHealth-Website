'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import HeroBannerVideo from './hero-banner-video';

export default function HeroBannerCarousel({ slides = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef(null);
  const hasMultiple = slides.length > 1;
  const activeSlide = slides[activeIndex];

  const goTo = useCallback((index) => {
    if (!slides.length) return;
    setActiveIndex(((index % slides.length) + slides.length) % slides.length);
  }, [slides.length]);

  const goNext = useCallback(() => {
    goTo(activeIndex + 1);
  }, [activeIndex, goTo]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [slides]);

  useEffect(() => {
    clearTimer();
    if (!activeSlide || !hasMultiple) return undefined;

    if (activeSlide.mediaType === 'image') {
      const durationMs = (activeSlide.durationSeconds || 6) * 1000;
      timerRef.current = setTimeout(goNext, durationMs);
      return clearTimer;
    }

    if (activeSlide.playback?.type === 'iframe') {
      const durationMs = (activeSlide.durationSeconds || 30) * 1000;
      timerRef.current = setTimeout(goNext, durationMs);
      return clearTimer;
    }

    return clearTimer;
  }, [activeIndex, activeSlide, clearTimer, goNext, hasMultiple]);

  useEffect(() => {
    if (!hasMultiple) return undefined;

    const handleMessage = (event) => {
      if (!activeSlide || activeSlide.mediaType !== 'video') return;

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data?.event === 'infoDelivery' && data?.info?.playerState === 0) {
          goNext();
        }
        if (data?.event === 'finish') {
          goNext();
        }
      } catch {
        // Ignore non-JSON postMessages from other embeds.
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeSlide, goNext, hasMultiple]);

  if (!slides.length) return null;

  return (
    <div className="hero-banner-carousel">
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={slide.id}
            className={`hero-banner-carousel__slide ${isActive ? 'is-active' : ''}`}
            aria-hidden={!isActive}
          >
            {slide.mediaType === 'image' ? (
              <img
                src={slide.src}
                alt=""
                className="hero-banner-carousel__image"
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                decoding="async"
              />
            ) : (
              <HeroBannerVideo
                playback={slide.playback}
                loop={!hasMultiple}
                active={isActive}
                onEnded={hasMultiple ? goNext : undefined}
              />
            )}
          </div>
        );
      })}

      {hasMultiple && (
        <div className="hero-banner-carousel__dots">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => goTo(index)}
              className={index === activeIndex ? 'is-active' : ''}
              aria-label={`Go to banner slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
