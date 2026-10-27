export const BOOKING_PHONE_MAX_LENGTH = 10;

/** Keep digits only and cap length for booking phone fields. */
export function sanitizeBookingPhone(value, maxLength = BOOKING_PHONE_MAX_LENGTH) {
  return String(value ?? '')
    .replace(/\D/g, '')
    .slice(0, maxLength);
}
