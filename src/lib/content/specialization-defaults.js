import { createEmptyMarketing } from './service-marketing';

const emptyLocalized = () => ({ en: '', ar: '' });

export function createEmptySpecialization() {
  return {
    id: '',
    slug: '',
    name: emptyLocalized(),
    parentServiceId: '',
    parentId: null,
    shortDescription: emptyLocalized(),
    fullDescription: emptyLocalized(),
    iconKey: 'generalMedicine',
    featuredImageUrl: '',
    benefits: [],
    faqs: [],
    galleryImages: [],
    videoUrl: '',
    procedureOverview: emptyLocalized(),
    treatmentDuration: emptyLocalized(),
    priceAmount: '',
    price: emptyLocalized(),
    recoveryInfo: emptyLocalized(),
    preparationGuidelines: emptyLocalized(),
    suitableFor: [],
    risksAndPrecautions: emptyLocalized(),
    marketing: createEmptyMarketing(),
    metaTitle: emptyLocalized(),
    metaDescription: emptyLocalized(),
    order: 1,
    active: true,
  };
}
