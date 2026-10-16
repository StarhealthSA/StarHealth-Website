/**
 * Anniversary offer creatives for the giveaway page.
 *
 * How to add / update an offer:
 * 1. Drop the image into `src/assets/giveaway/offers/` (or use a full CDN URL).
 * 2. Import the file below (or paste the URL into `image`).
 * 3. Set `href` to where the card should go (`/offers`, `/booking`, an external URL, etc.).
 * 4. Add English + Arabic alt text for accessibility.
 *
 * Example:
 *   import lipFiller from '@/assets/giveaway/offers/lip-filler.jpg';
 *
 *   {
 *     id: 'lip-filler',
 *     image: lipFiller,
 *     href: '/offers',
 *     alt: {
 *       en: 'Lip filler anniversary offer',
 *       ar: 'عرض فيلر الشفاه بمناسبة الذكرى',
 *     },
 *   },
 */

// import exampleOffer from '@/assets/giveaway/offers/example.jpg';

/** Only the first 2 entries are shown on the giveaway page. */
export const GIVEAWAY_OFFERS = [
  // Add offer entries here. Leave empty until creatives are ready.
  // {
  //   id: 'example-offer',
  //   image: exampleOffer,
  //   href: '/offers',
  //   alt: {
  //     en: 'Anniversary offer',
  //     ar: 'عرض الذكرى السنوية',
  //   },
  // },
];

export function resolveGiveawayOfferImage(image) {
  if (!image) return '';
  if (typeof image === 'string') return image;
  return image.src || '';
}
