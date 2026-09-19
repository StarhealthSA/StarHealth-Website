import { createEmptyPortfolioEntry } from './portfolio-defaults';

function normalizeLocalized(value) {
  if (!value) return { en: '', ar: '' };
  if (typeof value === 'string') return { en: value, ar: '' };
  return { en: value.en || '', ar: value.ar || '' };
}

export function isPortfolioPublished(entry) {
  if (!entry) return false;
  if (entry.status) return entry.status === 'active';
  return entry.published !== false;
}

export function normalizePortfolioEntry(raw = {}) {
  const defaults = createEmptyPortfolioEntry();
  const mediaType = raw.mediaType === 'video' ? 'video' : 'image';

  return {
    ...defaults,
    ...raw,
    id: raw.id ?? raw.slug ?? '',
    slug: raw.slug ?? raw.id ?? '',
    title: normalizeLocalized(raw.title || raw.name),
    serviceName: normalizeLocalized(raw.serviceName || raw.service),
    doctorName: normalizeLocalized(raw.doctorName || raw.doctor),
    description: normalizeLocalized(raw.description),
    category: String(raw.category || defaults.category).trim().toLowerCase() || defaults.category,
    mediaType,
    mediaUrl: raw.mediaUrl || raw.imageUrl || raw.featuredImageUrl || '',
    beforeImageUrl: raw.beforeImageUrl || '',
    afterImageUrl: raw.afterImageUrl || '',
    altText: normalizeLocalized(raw.altText || raw.alt),
    status: raw.status ?? (raw.published === false ? 'draft' : 'active'),
    featured: Boolean(raw.featured),
    order: Number.isFinite(Number(raw.order)) ? Number(raw.order) : 0,
    createdAt: raw.createdAt || null,
    updatedAt: raw.updatedAt || null,
  };
}
