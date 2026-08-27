import { getLocalizedText } from './localized';

export function toPublicInsurancePartner(partner, language = 'en') {
  if (!partner) return null;

  return {
    id: partner.id,
    slug: partner.slug,
    name: getLocalizedText(partner.name, language),
    logoUrl: partner.logoUrl || '',
    websiteUrl: partner.websiteUrl || '',
    featured: Boolean(partner.featured),
  };
}
