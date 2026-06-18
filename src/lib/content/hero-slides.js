import {
  detectBannerVideoPlatform,
  isBannerVideoSupported,
  resolveBannerVideo,
} from '@/lib/video/banner-video';

const IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?|$)/i;

export function createEmptyHeroSlide(order = 1) {
  return {
    id: `slide-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: 'image',
    url: '',
    order,
    enabled: true,
    durationSeconds: 30,
  };
}

export function isBannerImageUrl(url = '') {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (IMAGE_EXTENSIONS.test(trimmed)) return true;
  if (detectBannerVideoPlatform(trimmed)) return false;
  return true;
}

export function normalizeHeroSlide(raw = {}, { carouselMode = false } = {}) {
  const type = raw.type === 'video' ? 'video' : 'image';
  const url = (raw.url || '').trim();
  const enabled = raw.enabled !== false && Boolean(url);

  if (!enabled || !url) {
    return {
      id: raw.id || createEmptyHeroSlide(raw.order || 1).id,
      type,
      url,
      order: Number(raw.order) || 1,
      enabled: false,
      durationSeconds: Number(raw.durationSeconds) || 30,
      mediaType: type,
      src: '',
      playback: null,
    };
  }

  if (type === 'image') {
    return {
      id: raw.id || createEmptyHeroSlide(raw.order || 1).id,
      type,
      url,
      order: Number(raw.order) || 1,
      enabled: true,
      durationSeconds: Number(raw.durationSeconds) || 6,
      mediaType: 'image',
      src: url,
      playback: null,
    };
  }

  const playback = resolveBannerVideo(url, { loop: !carouselMode });
  if (!playback) {
    return {
      id: raw.id || createEmptyHeroSlide(raw.order || 1).id,
      type,
      url,
      order: Number(raw.order) || 1,
      enabled: false,
      durationSeconds: Number(raw.durationSeconds) || 30,
      mediaType: 'video',
      src: '',
      playback: null,
    };
  }

  return {
    id: raw.id || createEmptyHeroSlide(raw.order || 1).id,
    type,
    url,
    order: Number(raw.order) || 1,
    enabled: true,
    durationSeconds: Number(raw.durationSeconds) || 30,
    mediaType: 'video',
    src: url,
    playback,
  };
}

export function normalizeHeroSlidesList(slides = [], { carouselMode = false } = {}) {
  const list = Array.isArray(slides) ? slides : [];
  return list
    .map((slide, index) => normalizeHeroSlide(
      { ...slide, order: slide.order ?? index + 1 },
      { carouselMode }
    ))
    .sort((a, b) => a.order - b.order);
}

export function normalizeHeroSlides(slides = [], { carouselMode = false } = {}) {
  return normalizeHeroSlidesList(slides, { carouselMode })
    .filter((slide) => slide.enabled);
}

export function getActiveHeroSlides(slides = []) {
  return slides.filter((slide) => slide.enabled && (slide.src || slide.playback));
}

export function migrateHeroSlidesFromLegacy(raw = {}) {
  if (Array.isArray(raw.heroSlides) && raw.heroSlides.length) {
    return raw.heroSlides;
  }

  if (raw.heroVideo?.enabled && raw.heroVideo?.url) {
    return [{
      id: 'legacy-hero-video',
      type: 'video',
      url: raw.heroVideo.url,
      order: 1,
      enabled: true,
      durationSeconds: 30,
    }];
  }

  return [];
}

export function validateHeroSlideInput(slide) {
  const url = (slide?.url || '').trim();
  if (!url) return 'Each slide needs an image or video URL.';

  if (slide.type === 'video' && !isBannerVideoSupported(url)) {
    return 'Unsupported video link. Use YouTube, Vimeo, or a direct MP4/WebM URL.';
  }

  if (slide.type === 'image' && detectBannerVideoPlatform(url)) {
    return 'This URL looks like a video. Switch the slide type to video or use an image URL.';
  }

  return '';
}
