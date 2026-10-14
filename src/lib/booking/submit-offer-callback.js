import { sendAppointmentEmailClient } from '@/lib/email/client-emailjs';

export async function submitOfferCallbackBooking({
  offerId,
  offerName,
  patientName,
  phone,
  age,
}) {
  const response = await fetch('/api/offer-bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      offerId,
      offerName,
      patientName,
      phone,
      age,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit offer booking request');
  }

  try {
    await sendAppointmentEmailClient({
      name: patientName,
      age,
      phonenumber: phone,
      doctor: 'Offer callback',
      speciality: offerName || data.offerName || 'Offer',
      date: 'Callback requested',
      time: 'Team will confirm',
    });
  } catch (error) {
    console.error('Offer callback email failed:', error);
  }

  return data;
}
