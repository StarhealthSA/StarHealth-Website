import { createEmptyInsurancePartner } from './insurance-defaults';

function normalizeLocalized(value) {
  if (!value) return { en: '', ar: '' };
  if (typeof value === 'string') return { en: value, ar: '' };
  return { en: value.en || '', ar: value.ar || '' };
}

export function isInsurancePartnerPublished(partner) {
  if (!partner) return false;
  if (partner.status) return partner.status === 'active';
  return partner.published !== false;
}

export function normalizeInsurancePartner(raw = {}) {
  const defaults = createEmptyInsurancePartner();

  return {
    ...defaults,
    ...raw,
    id: raw.id ?? raw.slug ?? '',
    slug: raw.slug ?? raw.id ?? '',
    name: normalizeLocalized(raw.name || raw.title),
    logoUrl: raw.logoUrl || raw.imageUrl || raw.featuredImageUrl || '',
    websiteUrl: raw.websiteUrl || '',
    status: raw.status ?? (raw.published === false ? 'draft' : 'active'),
    featured: Boolean(raw.featured),
    order: Number.isFinite(Number(raw.order)) ? Number(raw.order) : 0,
    createdAt: raw.createdAt || null,
    updatedAt: raw.updatedAt || null,
  };
}
