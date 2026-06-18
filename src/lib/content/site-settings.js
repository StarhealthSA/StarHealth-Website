import { getAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import {
  detectBannerVideoPlatform,
  resolveBannerVideo,
} from '@/lib/video/banner-video';
import {
  migrateHeroSlidesFromLegacy,
  normalizeHeroSlide,
  normalizeHeroSlidesList,
  validateHeroSlideInput,
} from '@/lib/content/hero-slides';

const COLLECTION = 'siteSettings';
const HOME_DOC_ID = 'home';

const emptyLocalized = () => ({ en: '', ar: '' });

export const DEFAULT_HOME_SETTINGS = {
  heroTitle: emptyLocalized(),
  heroSubtitle: emptyLocalized(),
  heroSlides: [],
  heroVideo: {
    enabled: false,
    url: '',
    platform: '',
  },
};

function normalizeLocalizedField(raw) {
  return {
    en: raw?.en?.trim() || '',
    ar: raw?.ar?.trim() || '',
  };
}

function normalizeHeroVideo(raw = {}) {
  const url = (raw.url || '').trim();
  const platform = raw.platform || detectBannerVideoPlatform(url);
  const enabled = Boolean(raw.enabled) && Boolean(url);
  const playback = enabled ? resolveBannerVideo(url) : null;

  return {
    enabled: enabled && Boolean(playback),
    url,
    platform,
    playback,
  };
}

function serializeHeroSlides(slides = []) {
  return slides.map((slide) => ({
    id: slide.id,
    type: slide.type,
    url: slide.url,
    order: slide.order,
    enabled: slide.enabled,
    durationSeconds: slide.durationSeconds,
  }));
}

export function normalizeHomeSettings(raw = {}) {
  const migratedSlides = migrateHeroSlidesFromLegacy(raw);
  const carouselMode = migratedSlides.filter((slide) => slide.enabled !== false && slide.url?.trim()).length > 1;
  const heroSlides = normalizeHeroSlidesList(migratedSlides, { carouselMode });

  return {
    id: HOME_DOC_ID,
    heroTitle: normalizeLocalizedField(raw.heroTitle),
    heroSubtitle: normalizeLocalizedField(raw.heroSubtitle),
    heroSlides,
    heroVideo: normalizeHeroVideo(raw.heroVideo),
    updatedAt: raw.updatedAt || null,
  };
}

export async function getHomeSettings() {
  const db = getAdminDb();
  if (!db) {
    return normalizeHomeSettings(DEFAULT_HOME_SETTINGS);
  }

  const doc = await db.collection(COLLECTION).doc(HOME_DOC_ID).get();
  if (!doc.exists) {
    return normalizeHomeSettings(DEFAULT_HOME_SETTINGS);
  }

  return normalizeHomeSettings(doc.data());
}

export async function updateHomeSettings(payload = {}) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const existing = await getHomeSettings();
  const rawSlides = payload.heroSlides ?? migrateHeroSlidesFromLegacy(existing);
  const slideList = Array.isArray(rawSlides) ? rawSlides : [];

  slideList.forEach((slide, index) => {
    const message = validateHeroSlideInput(slide);
    if (message && slide.url?.trim()) {
      throw new Error(`Slide ${index + 1}: ${message}`);
    }
  });

  const carouselMode = slideList.filter((slide) => slide.enabled !== false && slide.url?.trim()).length > 1;
  const normalizedSlides = slideList
    .map((slide, index) => normalizeHeroSlide(
      { ...slide, order: slide.order ?? index + 1 },
      { carouselMode }
    ))
    .sort((a, b) => a.order - b.order);

  const heroTitle = normalizeLocalizedField(payload.heroTitle ?? existing.heroTitle);
  const heroSubtitle = normalizeLocalizedField(payload.heroSubtitle ?? existing.heroSubtitle);

  const now = new Date().toISOString();
  const data = {
    id: HOME_DOC_ID,
    heroTitle,
    heroSubtitle,
    heroSlides: serializeHeroSlides(normalizedSlides),
    updatedAt: now,
  };

  await db.collection(COLLECTION).doc(HOME_DOC_ID).set(data, { merge: true });
  return normalizeHomeSettings(data);
}

export function isSiteSettingsConfigured() {
  return isFirebaseAdminConfigured();
}
