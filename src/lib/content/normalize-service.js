import { createEmptyService } from './service-defaults';
import { normalizeBenefits, normalizeMarketing } from './service-marketing';

function normalizeLocalized(value) {
  if (!value) return { en: '', ar: '' };
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

function normalizeFaqs(faqs) {
  if (!Array.isArray(faqs)) return [];
  return faqs.map((faq) => ({
    question: normalizeLocalized(faq.question),
    answer: normalizeLocalized(faq.answer),
  }));
}

export function isServiceActive(service) {
  if (!service) return false;
  if (service.status) return service.status === 'active';
  return service.published !== false;
}

export function normalizeService(raw = {}) {
  const defaults = createEmptyService();

  const shortDescription = raw.shortDescription
    ? normalizeLocalized(raw.shortDescription)
    : normalizeLocalized(raw.description);

  return {
    ...defaults,
    ...raw,
    title: normalizeLocalized(raw.title),
    shortDescription,
    fullDescription: normalizeLocalized(raw.fullDescription || raw.description),
    description: shortDescription,
    procedureOverview: normalizeLocalized(raw.procedureOverview),
    treatmentDuration: normalizeLocalized(raw.treatmentDuration),
    recoveryInfo: normalizeLocalized(raw.recoveryInfo),
    preparationGuidelines: normalizeLocalized(raw.preparationGuidelines),
    risksAndPrecautions: normalizeLocalized(raw.risksAndPrecautions),
    metaTitle: normalizeLocalized(raw.metaTitle),
    metaDescription: normalizeLocalized(raw.metaDescription),
    marketing: normalizeMarketing(raw.marketing),
    benefits: normalizeBenefits(raw.benefits),
    suitableFor: normalizeLocalizedList(raw.suitableFor),
    faqs: normalizeFaqs(raw.faqs),
    galleryImages: Array.isArray(raw.galleryImages) ? raw.galleryImages : [],
    similarServiceIds: Array.isArray(raw.similarServiceIds) ? raw.similarServiceIds : [],
    recommendedServiceIds: Array.isArray(raw.recommendedServiceIds) ? raw.recommendedServiceIds : [],
    status: raw.status ?? (raw.published !== false ? 'active' : 'inactive'),
    published: raw.published ?? (raw.status !== 'inactive'),
    iconUrl: raw.iconUrl || '',
    featuredImageUrl: raw.featuredImageUrl || raw.imageUrl || '',
    imageUrl: raw.imageUrl || raw.featuredImageUrl || '',
  };
}
