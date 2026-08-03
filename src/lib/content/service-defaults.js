import { createEmptyMarketing } from './service-marketing';

const emptyLocalized = () => ({ en: '', ar: '' });

export function createEmptyService() {
  return {
    id: '',
    slug: '',
    title: emptyLocalized(),
    shortDescription: emptyLocalized(),
    fullDescription: emptyLocalized(),
    iconKey: 'generalMedicine',
    iconUrl: '',
    featuredImageUrl: '',
    marketing: createEmptyMarketing(),
    benefits: [],
    procedureOverview: emptyLocalized(),
    treatmentDuration: emptyLocalized(),
    recoveryInfo: emptyLocalized(),
    preparationGuidelines: emptyLocalized(),
    suitableFor: [],
    risksAndPrecautions: emptyLocalized(),
    faqs: [],
    galleryImages: [],
    videoUrl: '',
    similarServiceIds: [],
    recommendedServiceIds: [],
    metaTitle: emptyLocalized(),
    metaDescription: emptyLocalized(),
    status: 'active',
    order: 1,
  };
}

export const SERVICE_FORM_TABS = [
  { id: 'basic', label: 'Basic' },
  { id: 'landing', label: 'Landing' },
  { id: 'details', label: 'Details' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'media', label: 'Media' },
  { id: 'relations', label: 'Relations' },
  { id: 'seo', label: 'SEO' },
  { id: 'status', label: 'Status' },
];
