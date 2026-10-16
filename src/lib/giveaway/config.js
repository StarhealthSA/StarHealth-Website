/** Anniversary giveaway campaign settings. */
export const GIVEAWAY = {
  enabled: true,
  /** ISO datetime — ends in Riyadh local time (UTC+3). */
  endsAt: '2026-11-30T23:59:59+03:00',
  whatsappNumber: '966505730003',
  phoneTel: '+966505730003',
  path: '/giveaway',
  /** Clinic location (used by terms QR / branch CTA). */
  mapsUrl: 'https://maps.app.goo.gl/fNDUmeW3QMxax97x5',
};

export function getGiveawayEntryWhatsAppUrl(message) {
  const text = encodeURIComponent(
    message || 'Hello Star Health, I want to enter the anniversary giveaway.'
  );
  return `https://wa.me/${GIVEAWAY.whatsappNumber}?text=${text}`;
}

export function getGiveawayEndDate() {
  return new Date(GIVEAWAY.endsAt);
}
