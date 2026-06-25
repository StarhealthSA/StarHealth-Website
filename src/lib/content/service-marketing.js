import { resolveBannerVideo } from '@/lib/video/banner-video';

const emptyLocalized = () => ({ en: '', ar: '' });

export function createEmptyMarketing() {
  return {
    heroVideo: { enabled: false, url: '' },
    stats: [],
    highlights: [],
    featuredDoctorIds: [],
    testimonials: [],
    showGlobalTestimonials: true,
    urgencyNote: emptyLocalized(),
    whatsappEnabled: true,
  };
}

function normalizeLocalized(value) {
  if (!value) return emptyLocalized();
  if (typeof value === 'string') return { en: value, ar: '' };
  return { en: value.en || '', ar: value.ar || '' };
}

function normalizeLocalizedList(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    if (typeof item === 'string') return { en: item, ar: '' };
    return { en: item.en || '', ar: item.ar || '' };
  });
}

function normalizeStats(stats) {
  if (!Array.isArray(stats)) return [];
  return stats.map((stat) => ({
    value: normalizeLocalized(stat.value),
    label: normalizeLocalized(stat.label),
  }));
}

function normalizeTestimonials(testimonials) {
  if (!Array.isArray(testimonials)) return [];
  return testimonials.map((item) => ({
    quote: normalizeLocalized(item.quote),
    name: normalizeLocalized(item.name),
    rating: Number(item.rating) || 5,
  }));
}

export function normalizeMarketing(raw = {}) {
  const url = (raw.heroVideo?.url || '').trim();
  const enabled = Boolean(raw.heroVideo?.enabled) && Boolean(url);
  const playback = enabled ? resolveBannerVideo(url) : null;

  return {
    heroVideo: {
      enabled: enabled && Boolean(playback),
      url,
      playback,
    },
    stats: normalizeStats(raw.stats),
    highlights: normalizeLocalizedList(raw.highlights),
    featuredDoctorIds: Array.isArray(raw.featuredDoctorIds) ? raw.featuredDoctorIds : [],
    testimonials: normalizeTestimonials(raw.testimonials),
    showGlobalTestimonials: raw.showGlobalTestimonials !== false,
    urgencyNote: normalizeLocalized(raw.urgencyNote),
    whatsappEnabled: raw.whatsappEnabled !== false,
  };
}

export function normalizeBenefits(items) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => {
    if (typeof item === 'string') return { en: item, ar: '' };
    return {
      en: item.en || '',
      ar: item.ar || '',
    };
  });
}
