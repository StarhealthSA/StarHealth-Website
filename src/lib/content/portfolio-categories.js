/**
 * Extendable portfolio categories. Add new entries here to surface them
 * in admin filters and matching service detail pages without schema changes.
 *
 * `serviceMatchers` maps a portfolio category onto public service pages
 * (matched against service id, slug, or English title).
 */
export const PORTFOLIO_CATEGORIES = [
  {
    id: 'dental',
    label: { en: 'Dental', ar: 'الأسنان' },
    serviceMatchers: ['dentistry', 'dental', 'orthodontics'],
  },
  {
    id: 'dermatology',
    label: { en: 'Dermatology', ar: 'الجلدية' },
    serviceMatchers: ['dermatology', 'derma', 'skin'],
  },
];

export function getPortfolioCategory(id) {
  if (!id) return null;
  return PORTFOLIO_CATEGORIES.find((category) => category.id === id) || null;
}

export function getPortfolioCategoryLabel(id, language = 'en') {
  const category = getPortfolioCategory(id);
  if (!category) return id || '';
  return category.label?.[language] || category.label?.en || id;
}

export function isKnownPortfolioCategory(id) {
  return Boolean(getPortfolioCategory(id));
}

/**
 * Resolve which portfolio category (if any) belongs on a given service page.
 */
export function resolvePortfolioCategoryForService(service) {
  if (!service) return null;

  const explicit = String(service.portfolioCategory || '').trim().toLowerCase();
  if (explicit && getPortfolioCategory(explicit)) return explicit;

  const haystack = [
    service.id,
    service.slug,
    typeof service.title === 'string' ? service.title : service.title?.en,
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase())
    .join(' ');

  for (const category of PORTFOLIO_CATEGORIES) {
    const matchers = category.serviceMatchers || [category.id];
    if (matchers.some((matcher) => haystack.includes(String(matcher).toLowerCase()))) {
      return category.id;
    }
  }

  return null;
}

/** Best public service path for a portfolio category (used by admin/public CTAs). */
export function getServicePathForPortfolioCategory(categoryId) {
  if (categoryId === 'dental') return '/services/dentistry';
  if (categoryId === 'dermatology') return '/services/dermatology';
  return '/services';
}
