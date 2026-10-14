const emptyLocalized = () => ({ en: '', ar: '' });

export function createEmptyInsurancePartner() {
  return {
    id: '',
    slug: '',
    name: emptyLocalized(),
    logoUrl: '',
    websiteUrl: '',
    status: 'draft',
    featured: false,
    order: 0,
  };
}
