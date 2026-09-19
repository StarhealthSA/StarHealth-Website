import { getLocalizedText } from './localized';
import { getPortfolioCategoryLabel } from './portfolio-categories';
import { isPortfolioPublished } from './normalize-portfolio';

export function toPublicPortfolioEntry(entry, language = 'en') {
  if (!entry || !isPortfolioPublished(entry)) return null;

  const hasBeforeAfter = Boolean(entry.beforeImageUrl && entry.afterImageUrl);
  const primaryMedia =
    entry.mediaUrl
    || entry.afterImageUrl
    || entry.beforeImageUrl
    || '';

  return {
    id: entry.id,
    slug: entry.slug,
    title: getLocalizedText(entry.title, language),
    serviceName: getLocalizedText(entry.serviceName, language),
    doctorName: getLocalizedText(entry.doctorName, language),
    description: getLocalizedText(entry.description, language),
    category: entry.category,
    categoryLabel: getPortfolioCategoryLabel(entry.category, language),
    mediaType: entry.mediaType === 'video' ? 'video' : 'image',
    mediaUrl: primaryMedia,
    beforeImageUrl: entry.beforeImageUrl || '',
    afterImageUrl: entry.afterImageUrl || '',
    hasBeforeAfter,
    altText:
      getLocalizedText(entry.altText, language)
      || getLocalizedText(entry.title, language)
      || '',
    featured: Boolean(entry.featured),
    order: entry.order ?? 0,
  };
}
