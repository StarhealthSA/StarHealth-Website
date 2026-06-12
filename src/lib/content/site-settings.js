import { getAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import {
  detectBannerVideoPlatform,
  resolveBannerVideo,
} from '@/lib/video/banner-video';

const COLLECTION = 'siteSettings';
const HOME_DOC_ID = 'home';

const emptyLocalized = () => ({ en: '', ar: '' });

export const DEFAULT_HOME_SETTINGS = {
  heroTitle: emptyLocalized(),
  heroSubtitle: emptyLocalized(),
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

export function normalizeHomeSettings(raw = {}) {
  return {
    id: HOME_DOC_ID,
    heroTitle: normalizeLocalizedField(raw.heroTitle),
    heroSubtitle: normalizeLocalizedField(raw.heroSubtitle),
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
  const url = (payload.heroVideo?.url ?? existing.heroVideo.url).trim();
  const enabled = payload.heroVideo?.enabled ?? existing.heroVideo.enabled;

  const heroVideo = normalizeHeroVideo({
    enabled,
    url,
    platform: detectBannerVideoPlatform(url),
  });

  if (enabled && url && !heroVideo.playback) {
    throw new Error('Unsupported video link. Use YouTube, Vimeo, or a direct MP4/WebM URL.');
  }

  const heroTitle = normalizeLocalizedField(payload.heroTitle ?? existing.heroTitle);
  const heroSubtitle = normalizeLocalizedField(payload.heroSubtitle ?? existing.heroSubtitle);

  const now = new Date().toISOString();
  const data = {
    id: HOME_DOC_ID,
    heroTitle,
    heroSubtitle,
    heroVideo: {
      enabled: heroVideo.enabled,
      url: heroVideo.url,
      platform: heroVideo.platform,
    },
    updatedAt: now,
  };

  await db.collection(COLLECTION).doc(HOME_DOC_ID).set(data, { merge: true });
  return normalizeHomeSettings(data);
}

export function isSiteSettingsConfigured() {
  return isFirebaseAdminConfigured();
}
