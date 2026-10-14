import { createEmptyOffer } from './offer-defaults';

function normalizeLocalized(value) {
  if (!value) return { en: '', ar: '' };
  if (typeof value === 'string') return { en: value, ar: '' };
  return { en: value.en || '', ar: value.ar || '' };
}

export function isOfferPublished(offer) {
  if (!offer) return false;
  if (offer.status) return offer.status === 'active';
  return offer.published !== false;
}

export function isOfferCurrentlyValid(offer, now = new Date()) {
  if (!isOfferPublished(offer)) return false;
  if (!offer.validUntil) return true;

  const end = new Date(`${String(offer.validUntil).slice(0, 10)}T23:59:59`);
  if (Number.isNaN(end.getTime())) return true;
  return end.getTime() >= now.getTime();
}

export function normalizeOffer(raw = {}) {
  const defaults = createEmptyOffer();

  return {
    ...defaults,
    ...raw,
    id: raw.id ?? raw.slug ?? '',
    slug: raw.slug ?? raw.id ?? '',
    name: normalizeLocalized(raw.name || raw.title),
    treatment: normalizeLocalized(raw.treatment),
    description: normalizeLocalized(raw.description),
    offerPrice: raw.offerPrice != null ? String(raw.offerPrice) : '',
    crossPrice: raw.crossPrice != null ? String(raw.crossPrice) : '',
    currency: raw.currency || 'SAR',
    bookAppointmentUrl: raw.bookAppointmentUrl || '/booking',
    validUntil: raw.validUntil ? String(raw.validUntil).slice(0, 10) : '',
    featuredImageUrl: raw.featuredImageUrl || '',
    status: raw.status ?? (raw.published === false ? 'draft' : 'active'),
    featured: Boolean(raw.featured),
    order: Number.isFinite(Number(raw.order)) ? Number(raw.order) : 0,
    createdAt: raw.createdAt || null,
    updatedAt: raw.updatedAt || null,
  };
}
