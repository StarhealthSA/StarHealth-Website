export function isOfferBookingPending(item) {
  if (!item || item.type !== 'offer_callback') return false;
  if (item.status === 'cancelled') return false;
  if (item.status === 'pending') return true;
  // Legacy offer bookings were stored as booked before doctor assignment existed.
  return !item.doctorId;
}

export function isOfferBookingConfirmed(item) {
  if (!item || item.type !== 'offer_callback') return false;
  return item.status === 'booked' && Boolean(item.doctorId);
}
