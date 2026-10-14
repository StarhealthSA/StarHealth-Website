import { getLocalizedText } from './localized';
import { isOfferCurrentlyValid } from './normalize-offer';

export function formatOfferValidUntil(value, language = 'en') {
  if (!value) return '';
  return new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString(
    language === 'ar' ? 'ar-SA' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );
}

export function formatOfferPrice(amount, currency = 'SAR') {
  if (amount == null || String(amount).trim() === '') return '';
  return `${currency} ${String(amount).trim()}`;
}

/** Parse numeric amount from admin input (supports "299", "SAR 299", "1,299"). */
export function parseOfferAmount(value) {
  if (value == null || value === '') return null;
  const normalized = String(value).replace(/,/g, '').replace(/[^\d.]/g, '');
  if (!normalized) return null;
  const num = Number(normalized);
  return Number.isFinite(num) ? num : null;
}

/**
 * Discount % from default (cross) price and offer price:
 * ((defaultPrice - offerPrice) / defaultPrice) * 100
 */
export function getOfferDiscountPercent(offerPrice, crossPrice) {
  const sale = parseOfferAmount(offerPrice);
  const original = parseOfferAmount(crossPrice);
  if (sale == null || original == null || original <= 0 || sale < 0) return null;
  if (sale >= original) return null;

  const percent = Math.round(((original - sale) / original) * 100);
  if (percent <= 0 || percent > 100) return null;
  return percent;
}

export function formatOfferDiscountLabel(percent, language = 'en') {
  if (percent == null) return '';
  return language === 'ar' ? `${percent}% خصم` : `${percent}% OFF`;
}

export function toPublicOffer(offer, language = 'en') {
  if (!offer) return null;

  const discountPercent = getOfferDiscountPercent(offer.offerPrice, offer.crossPrice);

  return {
    id: offer.id,
    slug: offer.slug,
    name: getLocalizedText(offer.name, language),
    treatment: getLocalizedText(offer.treatment, language),
    description: getLocalizedText(offer.description, language),
    offerPrice: offer.offerPrice,
    crossPrice: offer.crossPrice,
    currency: offer.currency || 'SAR',
    offerPriceLabel: formatOfferPrice(offer.offerPrice, offer.currency),
    crossPriceLabel: formatOfferPrice(offer.crossPrice, offer.currency),
    discountPercent,
    discountLabel: formatOfferDiscountLabel(discountPercent, language),
    bookAppointmentUrl: offer.bookAppointmentUrl || '/booking',
    validUntil: offer.validUntil,
    validUntilLabel: formatOfferValidUntil(offer.validUntil, language),
    imageUrl: offer.featuredImageUrl || '',
    featured: Boolean(offer.featured),
    isValid: isOfferCurrentlyValid(offer),
  };
}
