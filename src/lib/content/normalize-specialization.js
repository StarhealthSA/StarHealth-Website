import { createEmptySpecialization } from './specialization-defaults';
import { normalizeBenefits, normalizeMarketing } from './service-marketing';
import { createEmptyService } from './service-defaults';

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

export function isSpecializationActive(spec) {
  if (!spec) return false;
  return spec.active !== false;
}

export function normalizeSpecialization(raw = {}) {
  const defaults = createEmptySpecialization();

  return {
    ...defaults,
    ...raw,
    name: normalizeLocalized(raw.name),
    shortDescription: normalizeLocalized(raw.shortDescription),
    fullDescription: normalizeLocalized(raw.fullDescription),
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
    parentServiceId: raw.parentServiceId || '',
    categoryId: raw.categoryId || null,
    parentId: raw.parentId || null,
    featuredImageUrl: raw.featuredImageUrl || '',
    active: raw.active !== false,
  };
}

/** Map a specialization document to the service landing shape for shared UI components. */
export function specializationToServiceShape(spec) {
  const normalized = normalizeSpecialization(spec);
  const serviceDefaults = createEmptyService();

  return {
    ...serviceDefaults,
    ...normalized,
    id: normalized.id,
    slug: normalized.slug,
    title: normalized.name,
    shortDescription: normalized.shortDescription,
    fullDescription: normalized.fullDescription,
    categoryId: normalized.categoryId || '',
    status: normalized.active ? 'active' : 'inactive',
  };
}
