const emptyLocalized = () => ({ en: '', ar: '' });

export function createEmptyOffer() {
  return {
    id: '',
    slug: '',
    name: emptyLocalized(),
    treatment: emptyLocalized(),
    description: emptyLocalized(),
    offerPrice: '',
    crossPrice: '',
    currency: 'SAR',
    bookAppointmentUrl: '/booking',
    validUntil: '',
    featuredImageUrl: '',
    status: 'draft',
    featured: false,
    order: 0,
  };
}
