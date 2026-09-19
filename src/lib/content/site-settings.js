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
import { DEFAULT_WHY_CHOOSE_SETTINGS } from '@/lib/content/why-choose-defaults';
import { DEFAULT_OUR_WORK_SETTINGS } from '@/lib/content/our-work-defaults';

export { DEFAULT_WHY_CHOOSE_SETTINGS } from '@/lib/content/why-choose-defaults';
export { DEFAULT_OUR_WORK_SETTINGS } from '@/lib/content/our-work-defaults';

const COLLECTION = 'siteSettings';
const HOME_DOC_ID = 'home';
const INSURANCE_DOC_ID = 'insurance';
const WHY_CHOOSE_DOC_ID = 'whyChoose';
const OUR_WORK_DOC_ID = 'ourWork';

const emptyLocalized = () => ({ en: '', ar: '' });

export const DEFAULT_HOME_SETTINGS = {
  heroTitle: emptyLocalized(),
  heroSubtitle: emptyLocalized(),
  metaTitle: emptyLocalized(),
  metaDescription: emptyLocalized(),
  heroSlides: [],
  heroVideo: {
    enabled: false,
    url: '',
    platform: '',
  },
};

export const DEFAULT_INSURANCE_SETTINGS = {
  heroTitle: emptyLocalized(),
  heroSubtitle: emptyLocalized(),
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
    metaTitle: normalizeLocalizedField(raw.metaTitle),
    metaDescription: normalizeLocalizedField(raw.metaDescription),
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
  const metaTitle = normalizeLocalizedField(payload.metaTitle ?? existing.metaTitle);
  const metaDescription = normalizeLocalizedField(payload.metaDescription ?? existing.metaDescription);

  const now = new Date().toISOString();
  const data = {
    id: HOME_DOC_ID,
    heroTitle,
    heroSubtitle,
    metaTitle,
    metaDescription,
    heroSlides: serializeHeroSlides(normalizedSlides),
    updatedAt: now,
  };

  await db.collection(COLLECTION).doc(HOME_DOC_ID).set(data, { merge: true });
  return normalizeHomeSettings(data);
}

export function normalizeInsuranceSettings(raw = {}) {
  return {
    id: INSURANCE_DOC_ID,
    heroTitle: normalizeLocalizedField(raw.heroTitle),
    heroSubtitle: normalizeLocalizedField(raw.heroSubtitle),
    updatedAt: raw.updatedAt || null,
  };
}

export async function getInsuranceSettings() {
  const db = getAdminDb();
  if (!db) {
    return normalizeInsuranceSettings(DEFAULT_INSURANCE_SETTINGS);
  }

  const doc = await db.collection(COLLECTION).doc(INSURANCE_DOC_ID).get();
  if (!doc.exists) {
    return normalizeInsuranceSettings(DEFAULT_INSURANCE_SETTINGS);
  }

  return normalizeInsuranceSettings(doc.data());
}

export async function updateInsuranceSettings(payload = {}) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const existing = await getInsuranceSettings();
  const now = new Date().toISOString();
  const data = {
    id: INSURANCE_DOC_ID,
    heroTitle: normalizeLocalizedField(payload.heroTitle ?? existing.heroTitle),
    heroSubtitle: normalizeLocalizedField(payload.heroSubtitle ?? existing.heroSubtitle),
    updatedAt: now,
  };

  await db.collection(COLLECTION).doc(INSURANCE_DOC_ID).set(data, { merge: true });
  return normalizeInsuranceSettings(data);
}

function normalizeCounter(raw = {}, fallback = {}) {
  const value = Number(raw.value ?? fallback.value ?? 0);
  const decimals = Number.isFinite(Number(raw.decimals))
    ? Number(raw.decimals)
    : (fallback.decimals ?? 0);

  return {
    id: raw.id || fallback.id || `counter-${Math.random().toString(36).slice(2, 8)}`,
    value: Number.isFinite(value) ? value : 0,
    prefix: raw.prefix ?? fallback.prefix ?? '',
    suffix: raw.suffix ?? fallback.suffix ?? '',
    decimals,
    label: normalizeLocalizedField(raw.label ?? fallback.label),
    iconUrl: (raw.iconUrl || fallback.iconUrl || '').trim(),
  };
}

export function normalizeWhyChooseSettings(raw = {}) {
  const defaults = DEFAULT_WHY_CHOOSE_SETTINGS;
  const countersRaw = Array.isArray(raw.counters) && raw.counters.length
    ? raw.counters
    : defaults.counters;

  return {
    id: WHY_CHOOSE_DOC_ID,
    title: normalizeLocalizedField(raw.title ?? defaults.title),
    paragraph1: normalizeLocalizedField(raw.paragraph1 ?? defaults.paragraph1),
    paragraph2: normalizeLocalizedField(raw.paragraph2 ?? defaults.paragraph2),
    paragraph3: normalizeLocalizedField(raw.paragraph3 ?? defaults.paragraph3),
    counters: countersRaw.map((item, index) =>
      normalizeCounter(item, defaults.counters[index] || defaults.counters[0])
    ),
    bookNowLabel: normalizeLocalizedField(raw.bookNowLabel ?? defaults.bookNowLabel),
    whatsappLabel: normalizeLocalizedField(raw.whatsappLabel ?? defaults.whatsappLabel),
    whatsappNumber: String(raw.whatsappNumber || defaults.whatsappNumber).replace(/\D/g, ''),
    whatsappMessage: normalizeLocalizedField(raw.whatsappMessage ?? defaults.whatsappMessage),
    updatedAt: raw.updatedAt || null,
  };
}

export async function getWhyChooseSettings() {
  const db = getAdminDb();
  if (!db) {
    return normalizeWhyChooseSettings(DEFAULT_WHY_CHOOSE_SETTINGS);
  }

  const doc = await db.collection(COLLECTION).doc(WHY_CHOOSE_DOC_ID).get();
  if (!doc.exists) {
    return normalizeWhyChooseSettings(DEFAULT_WHY_CHOOSE_SETTINGS);
  }

  return normalizeWhyChooseSettings(doc.data());
}

export async function updateWhyChooseSettings(payload = {}) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const existing = await getWhyChooseSettings();
  const now = new Date().toISOString();
  const data = normalizeWhyChooseSettings({
    ...existing,
    ...payload,
    updatedAt: now,
  });

  await db.collection(COLLECTION).doc(WHY_CHOOSE_DOC_ID).set(data, { merge: true });
  return normalizeWhyChooseSettings(data);
}

export function normalizeOurWorkSettings(raw = {}) {
  const defaults = DEFAULT_OUR_WORK_SETTINGS;

  return {
    id: OUR_WORK_DOC_ID,
    eyebrow: normalizeLocalizedField(raw.eyebrow ?? defaults.eyebrow),
    title: normalizeLocalizedField(raw.title ?? defaults.title),
    lead: normalizeLocalizedField(raw.lead ?? defaults.lead),
    updatedAt: raw.updatedAt || null,
  };
}

export async function getOurWorkSettings() {
  const db = getAdminDb();
  if (!db) {
    return normalizeOurWorkSettings(DEFAULT_OUR_WORK_SETTINGS);
  }

  const doc = await db.collection(COLLECTION).doc(OUR_WORK_DOC_ID).get();
  if (!doc.exists) {
    return normalizeOurWorkSettings(DEFAULT_OUR_WORK_SETTINGS);
  }

  return normalizeOurWorkSettings(doc.data());
}

export async function updateOurWorkSettings(payload = {}) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const existing = await getOurWorkSettings();
  const now = new Date().toISOString();
  const data = normalizeOurWorkSettings({
    ...existing,
    ...payload,
    updatedAt: now,
  });

  await db.collection(COLLECTION).doc(OUR_WORK_DOC_ID).set(data, { merge: true });
  return normalizeOurWorkSettings(data);
}

export function isSiteSettingsConfigured() {
  return isFirebaseAdminConfigured();
}
