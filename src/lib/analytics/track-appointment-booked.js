/**
 * Pushes a GTM custom event for successful appointment bookings.
 * Dedupes within a short session window so thank-you remounts don't double-count.
 */
export function trackAppointmentBooked() {
  if (typeof window === 'undefined') return;

  try {
    if (window.sessionStorage.getItem('appointment_booked_tracked') === '1') {
      return;
    }
    window.sessionStorage.setItem('appointment_booked_tracked', '1');
  } catch {
    // sessionStorage may be blocked; still push the event
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'appointment_booked',
  });
}

/** Call when the user starts a new booking attempt so a later success can fire again. */
export function resetAppointmentBookedTracking() {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem('appointment_booked_tracked');
  } catch {
    // ignore
  }
}
