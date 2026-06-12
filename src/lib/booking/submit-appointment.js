import emailjs from '@emailjs/browser';
import { formatDateKey } from '@/lib/appointments/slot-utils';

const EMAILJS_SERVICE_ID = 'service_gr3hz0c';
const EMAILJS_TEMPLATE_ID = 'template_zi5qnzk';
const EMAILJS_PUBLIC_KEY = '3hR26mPB0OTAoNfhQ';

export async function submitAppointmentBooking({
  doctorId,
  doctorName,
  date,
  slot,
  patientName,
  phone,
  age,
  speciality,
  requiresSchedule = true,
}) {
  const body = {
    doctorId,
    doctorName,
    patientName,
    phone,
    age,
    speciality,
  };

  if (requiresSchedule) {
    if (!date || !slot) {
      throw new Error('Please select a date and time slot.');
    }
    body.date = formatDateKey(date);
    body.slotIndex = slot.index;
    body.slotLabel = slot.label;
  }

  const bookingResponse = await fetch('/api/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const bookingData = await bookingResponse.json();
  if (!bookingResponse.ok) {
    throw new Error(bookingData.error || 'Failed to book appointment');
  }

  await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      name: patientName,
      age,
      phonenumber: phone,
      doctor: doctorName,
      speciality,
      date: date ? date.toLocaleDateString() : 'To be confirmed',
      time: slot?.label || 'To be confirmed',
    },
    EMAILJS_PUBLIC_KEY
  );

  return bookingData;
}
