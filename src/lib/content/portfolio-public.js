import { getLocalizedText } from './localized';
import {
  getPortfolioCategoryLabel,
  getPortfolioServicePath,
} from './portfolio-categories';
import { isPortfolioPublished } from './normalize-portfolio';

export function toPublicPortfolioEntry(entry, language = 'en') {
  if (!entry || !isPortfolioPublished(entry)) return null;

  const mediaUrl =
    entry.mediaUrl
    || entry.afterImageUrl
    || entry.beforeImageUrl
    || '';
  if (!mediaUrl) return null;

  const serviceSlug = entry.serviceSlug || entry.serviceId || '';

  return {
    id: entry.id,
    slug: entry.slug,
    title: getLocalizedText(entry.title, language),
    serviceId: entry.serviceId || '',
    serviceSlug,
    serviceName: getLocalizedText(entry.serviceName, language),
    serviceHref: getPortfolioServicePath({
      serviceSlug,
      categoryId: entry.category,
    }),
    doctorName: getLocalizedText(entry.doctorName, language),
    description: getLocalizedText(entry.description, language),
    category: entry.category,
    categoryLabel: getPortfolioCategoryLabel(entry.category, language),
    mediaType: 'image',
    mediaUrl,
    altText:
      getLocalizedText(entry.altText, language)
      || getLocalizedText(entry.title, language)
      || '',
    featured: Boolean(entry.featured),
    order: entry.order ?? 0,
  };
}
