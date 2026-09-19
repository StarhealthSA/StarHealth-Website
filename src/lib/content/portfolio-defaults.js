const emptyLocalized = () => ({ en: '', ar: '' });

export function createEmptyPortfolioEntry() {
  return {
    id: '',
    slug: '',
    title: emptyLocalized(),
    serviceId: '',
    serviceSlug: '',
    serviceName: emptyLocalized(),
    doctorName: emptyLocalized(),
    description: emptyLocalized(),
    category: 'dental',
    mediaType: 'image',
    mediaUrl: '',
    beforeImageUrl: '',
    afterImageUrl: '',
    altText: emptyLocalized(),
    status: 'draft',
    featured: false,
    order: 0,
    createdAt: null,
    updatedAt: null,
  };
}
