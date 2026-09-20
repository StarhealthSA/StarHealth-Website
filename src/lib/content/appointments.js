import { getAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import {
  buildSlotAvailability,
  doctorHasAvailabilitySchedule,
  formatDateKey,
  formatDateLabel,
  getDateAvailabilityEntry,
  getUpcomingDateKeys,
  OPEN_BOOKING_DAYS,
  parseDateKey,
} from '@/lib/appointments/slot-utils';
import { getDoctorById } from './doctors';
import { getOfferById } from './offers';
import { isOfferCurrentlyValid, isOfferPublished } from './normalize-offer';
import {
  isOfferBookingConfirmed,
  isOfferBookingPending,
} from '@/lib/appointments/offer-booking-status';

export {
  isOfferBookingConfirmed,
  isOfferBookingPending,
} from '@/lib/appointments/offer-booking-status';

const COLLECTION = 'appointments';

function appointmentDocId(doctorId, date, slotIndex) {
  return `${doctorId}_${date}_${slotIndex}`;
}

function openAppointmentDocId(doctorId) {
  return `${doctorId}_open_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function offerCallbackDocId(offerId) {
  return `offer_${offerId}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function getBookedSlotIndices(doctorId, dateKey, excludeAppointmentId = null) {
  const db = getAdminDb();
  if (!db) return [];

  const snapshot = await db
    .collection(COLLECTION)
    .where('doctorId', '==', doctorId)
    .where('date', '==', dateKey)
    .get();

  return snapshot.docs
    .filter((doc) => doc.data().status === 'booked' && doc.id !== excludeAppointmentId)
    .map((doc) => doc.data().slotIndex);
}

export async function getDoctorAvailableDates(doctorId) {
  const doctor = await getDoctorById(doctorId);
  if (!doctor) throw new Error('Doctor not found');

  if (!doctorHasAvailabilitySchedule(doctor)) {
    return { scheduleMode: 'open', dates: [] };
  }

  const dates = getUpcomingDateKeys(OPEN_BOOKING_DAYS)
    .filter((dateKey) => {
      const entry = getDateAvailabilityEntry(doctor, parseDateKey(dateKey));
      return Boolean(entry?.enabled);
    })
    .map((dateKey) => ({
      dateKey,
      label: formatDateLabel(dateKey),
    }));

  return { scheduleMode: 'configured', dates };
}

export async function getAvailableSlotsForDoctor(doctorId, dateInput, excludeAppointmentId = null) {
  const date = dateInput instanceof Date ? dateInput : parseDateKey(dateInput);
  const dateKey = formatDateKey(date);
  const doctor = await getDoctorById(doctorId);

  if (!doctor) {
    throw new Error('Doctor not found');
  }

  const bookedSlotIndices = await getBookedSlotIndices(doctorId, dateKey, excludeAppointmentId);
  const slots = buildSlotAvailability(doctor, date, bookedSlotIndices);

  return {
    doctorId,
    date: dateKey,
    dayKey: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getDay()],
    slots,
  };
}

async function assertSlotAvailable(doctorId, date, slotIndex, excludeAppointmentId = null) {
  const doctor = await getDoctorById(doctorId);
  if (!doctor) throw new Error('Doctor not found');

  const dateObj = parseDateKey(date);
  const availability = buildSlotAvailability(
    doctor,
    dateObj,
    await getBookedSlotIndices(doctorId, date, excludeAppointmentId)
  );
  const normalizedSlotIndex = Number(slotIndex);
  const slot = availability.find((item) => item.index === normalizedSlotIndex);

  if (!slot) {
    throw new Error('This time slot is not available for the selected doctor');
  }

  if (slot.status === 'booked') {
    throw new Error('This time slot has already been booked');
  }

  return { doctor, slot };
}

export async function createAppointment(payload, { source = 'website', read = false } = {}) {
  const db = getAdminDb();
  if (!db) throw new Error('Booking is not available right now. Please try again later.');

  const {
    doctorId,
    date,
    slotIndex,
    slotLabel,
    patientName,
    phone,
    age,
    speciality,
    doctorName,
  } = payload;

  if (!doctorId) {
    throw new Error('Doctor is required');
  }

  const doctor = await getDoctorById(doctorId);
  if (!doctor) throw new Error('Doctor not found');

  const hasSchedule = doctorHasAvailabilitySchedule(doctor);
  const now = new Date().toISOString();

  if (!hasSchedule) {
    const docId = openAppointmentDocId(doctorId);
    await db.collection(COLLECTION).doc(docId).set({
      id: docId,
      doctorId,
      doctorName: doctorName || doctor.name?.en || '',
      date: '',
      slotIndex: null,
      slotLabel: 'To be confirmed',
      patientName: patientName || '',
      phone: phone || '',
      age: age || '',
      speciality: speciality || '',
      status: 'booked',
      unscheduled: true,
      source,
      read: Boolean(read),
      createdAt: now,
      updatedAt: now,
    });

    return { id: docId, slotLabel: 'To be confirmed' };
  }

  if (!date || slotIndex == null) {
    throw new Error('Doctor, date, and time slot are required');
  }

  const { slot } = await assertSlotAvailable(doctorId, date, slotIndex);
  const docId = appointmentDocId(doctorId, date, slotIndex);

  await db.runTransaction(async (transaction) => {
    const ref = db.collection(COLLECTION).doc(docId);
    const existing = await transaction.get(ref);
    if (existing.exists && existing.data()?.status === 'booked') {
      throw new Error('This time slot has already been booked');
    }

    transaction.set(ref, {
      id: docId,
      doctorId,
      doctorName: doctorName || doctor.name?.en || '',
      date,
      slotIndex: Number(slotIndex),
      slotLabel: slotLabel || slot.label,
      patientName: patientName || '',
      phone: phone || '',
      age: age || '',
      speciality: speciality || '',
      status: 'booked',
      unscheduled: false,
      source,
      read: Boolean(read),
      createdAt: existing.exists ? existing.data()?.createdAt || now : now,
      updatedAt: now,
    });
  });

  return { id: docId, slotLabel: slotLabel || slot.label };
}

export async function createOfferCallbackBooking(payload, { source = 'website', read = false } = {}) {
  const db = getAdminDb();
  if (!db) throw new Error('Booking is not available right now. Please try again later.');

  const offerId = String(payload.offerId || '').trim();
  const patientName = String(payload.patientName || '').trim();
  const phone = String(payload.phone || '').trim();
  const age = String(payload.age || '').trim();
  const offerNameFromClient = String(payload.offerName || '').trim();

  if (!offerId) throw new Error('Please select an offer');
  if (!patientName) throw new Error('Full name is required');
  if (!phone) throw new Error('Phone number is required');
  if (!age) throw new Error('Age group is required');

  const offer = await getOfferById(offerId);
  if (!offer) throw new Error('Selected offer was not found');
  if (!isOfferPublished(offer) || !isOfferCurrentlyValid(offer)) {
    throw new Error('Selected offer is no longer available');
  }

  const offerName =
    offerNameFromClient
    || offer.name?.en
    || offer.treatment?.en
    || offer.slug
    || offerId;

  const now = new Date().toISOString();
  const docId = offerCallbackDocId(offerId);

  await db.collection(COLLECTION).doc(docId).set({
    id: docId,
    type: 'offer_callback',
    offerId,
    offerName,
    doctorId: '',
    doctorName: '',
    date: '',
    slotIndex: null,
    slotLabel: 'Callback requested',
    patientName,
    phone,
    age,
    speciality: offerName,
    status: 'pending',
    unscheduled: true,
    source,
    read: Boolean(read),
    createdAt: now,
    updatedAt: now,
  });

  return { id: docId, offerName, slotLabel: 'Callback requested', status: 'pending' };
}

export async function confirmOfferBooking(id, payload = {}) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const existing = await getAppointmentById(id);
  if (!existing) throw new Error('Offer booking not found');
  if (existing.type !== 'offer_callback') {
    throw new Error('Only offer bookings can be confirmed this way');
  }
  if (existing.status === 'cancelled') {
    throw new Error('Cancelled offer bookings cannot be confirmed');
  }
  if (isOfferBookingConfirmed(existing)) {
    throw new Error('This offer booking is already confirmed');
  }

  const doctorId = String(payload.doctorId || '').trim();
  if (!doctorId) throw new Error('Doctor is required');

  const doctor = await getDoctorById(doctorId);
  if (!doctor) throw new Error('Doctor not found');

  const doctorName = payload.doctorName || doctor.name?.en || '';
  const now = new Date().toISOString();
  const hasSchedule = doctorHasAvailabilitySchedule(doctor);

  let nextData = {
    ...existing,
    doctorId,
    doctorName,
    patientName: payload.patientName ?? existing.patientName ?? '',
    phone: payload.phone ?? existing.phone ?? '',
    age: payload.age ?? existing.age ?? '',
    speciality: payload.speciality ?? existing.speciality ?? existing.offerName ?? '',
    status: 'booked',
    type: 'offer_callback',
    source: existing.source || 'offers',
    read: true,
    confirmedAt: now,
    updatedAt: now,
  };

  if (!hasSchedule) {
    nextData = {
      ...nextData,
      date: '',
      slotIndex: null,
      slotLabel: 'To be confirmed',
      unscheduled: true,
    };
    await db.collection(COLLECTION).doc(id).set(nextData, { merge: true });
    return getAppointmentById(id);
  }

  const date = String(payload.date || '').trim();
  const slotIndex = payload.slotIndex;
  if (!date || slotIndex == null) {
    throw new Error('Date and time slot are required for this doctor');
  }

  const { slot } = await assertSlotAvailable(doctorId, date, slotIndex, id);
  nextData = {
    ...nextData,
    date,
    slotIndex: Number(slotIndex),
    slotLabel: payload.slotLabel || slot.label,
    unscheduled: false,
  };

  await db.collection(COLLECTION).doc(id).set(nextData, { merge: true });
  return getAppointmentById(id);
}

function matchesSearch(item, search) {
  if (!search) return true;
  const query = search.trim().toLowerCase();
  if (!query) return true;

  const name = (item.patientName || '').toLowerCase();
  const phone = (item.phone || '').replace(/\s+/g, '');
  const phoneQuery = query.replace(/\s+/g, '');
  const offerName = (item.offerName || item.speciality || '').toLowerCase();
  const doctorName = (item.doctorName || '').toLowerCase();

  return (
    name.includes(query)
    || phone.includes(phoneQuery)
    || offerName.includes(query)
    || doctorName.includes(query)
  );
}

export async function listAppointments({ doctorId, date, status, search, type } = {}) {
  const db = getAdminDb();
  if (!db) return [];

  let query = db.collection(COLLECTION);
  if (doctorId) query = query.where('doctorId', '==', doctorId);
  if (date) query = query.where('date', '==', date);

  const snapshot = await query.get();
  let items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  if (type === 'offer_callback') {
    items = items.filter((item) => item.type === 'offer_callback');
  } else if (type === 'appointment') {
    // Main booking tabs: regular appointments + confirmed offer bookings.
    // Pending offer callbacks stay only in the Offer Bookings tab.
    items = items.filter((item) => {
      if (item.type !== 'offer_callback') return true;
      return Boolean(item.doctorId) && item.status !== 'pending';
    });
  }

  if (status) {
    items = items.filter((item) => item.status === status);
  }

  if (search) {
    items = items.filter((item) => matchesSearch(item, search));
  }

  return items.sort((a, b) => {
    const createdA = a.createdAt || '';
    const createdB = b.createdAt || '';
    if (createdA !== createdB) return createdB.localeCompare(createdA);
    if ((a.date || '') !== (b.date || '')) return (b.date || '').localeCompare(a.date || '');
    return (Number(b.slotIndex) || 0) - (Number(a.slotIndex) || 0);
  });
}

export async function getAppointmentById(id) {
  const db = getAdminDb();
  if (!db) return null;

  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function markAppointmentRead(id) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const now = new Date().toISOString();
  await db.collection(COLLECTION).doc(id).set(
    { read: true, updatedAt: now },
    { merge: true }
  );

  return getAppointmentById(id);
}

export async function updateAppointment(id, payload) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const existing = await getAppointmentById(id);
  if (!existing) throw new Error('Appointment not found');
  if (existing.status === 'cancelled') {
    throw new Error('Cancelled appointments cannot be edited');
  }

  const doctorId = payload.doctorId || existing.doctorId;
  const date = payload.date || existing.date;
  const slotIndex = payload.slotIndex != null ? Number(payload.slotIndex) : existing.slotIndex;
  const doctor = await getDoctorById(doctorId);
  if (!doctor) throw new Error('Doctor not found');

  const newDocId = appointmentDocId(doctorId, date, slotIndex);
  const slotChanged = newDocId !== id;
  const now = new Date().toISOString();

  const nextData = {
    doctorId,
    doctorName: payload.doctorName || doctor.name?.en || existing.doctorName || '',
    date,
    slotIndex,
    slotLabel: payload.slotLabel || existing.slotLabel,
    patientName: payload.patientName ?? existing.patientName ?? '',
    phone: payload.phone ?? existing.phone ?? '',
    age: payload.age ?? existing.age ?? '',
    speciality: payload.speciality ?? existing.speciality ?? '',
    status: 'booked',
    read: existing.read ?? true,
    source: existing.source || 'admin',
    updatedAt: now,
  };

  if (!slotChanged) {
    if (payload.slotLabel) {
      nextData.slotLabel = payload.slotLabel;
    }
    await db.collection(COLLECTION).doc(id).set(nextData, { merge: true });
    return getAppointmentById(id);
  }

  const { slot } = await assertSlotAvailable(doctorId, date, slotIndex);
  nextData.slotLabel = payload.slotLabel || slot.label;

  await db.runTransaction(async (transaction) => {
    const oldRef = db.collection(COLLECTION).doc(id);
    const newRef = db.collection(COLLECTION).doc(newDocId);
    const newExisting = await transaction.get(newRef);

    if (newExisting.exists && newExisting.data()?.status === 'booked') {
      throw new Error('This time slot has already been booked');
    }

    transaction.delete(oldRef);

    transaction.set(newRef, {
      ...existing,
      ...nextData,
      id: newDocId,
      createdAt: existing.createdAt || now,
    });
  });

  return getAppointmentById(newDocId);
}

export async function deleteAppointment(id) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const existing = await getAppointmentById(id);
  if (!existing) throw new Error('Appointment not found');

  await db.collection(COLLECTION).doc(id).delete();
  return { id, deleted: true };
}

export async function cancelAppointment(id) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const existing = await getAppointmentById(id);
  if (!existing) throw new Error('Appointment not found');
  if (existing.status === 'cancelled') return existing;

  const now = new Date().toISOString();
  await db.collection(COLLECTION).doc(id).set(
    {
      status: 'cancelled',
      cancelledAt: now,
      updatedAt: now,
    },
    { merge: true }
  );

  return getAppointmentById(id);
}

export async function getUnreadAppointmentCounts() {
  const db = getAdminDb();
  if (!db) {
    return { appointments: 0, offerBookings: 0, total: 0 };
  }

  const snapshot = await db.collection(COLLECTION).where('read', '==', false).get();
  let appointments = 0;
  let offerBookings = 0;

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (data.status === 'cancelled') return;

    if (data.type === 'offer_callback' && isOfferBookingPending(data)) {
      offerBookings += 1;
      return;
    }

    if (data.status === 'booked') {
      appointments += 1;
    }
  });

  return {
    appointments,
    offerBookings,
    total: appointments + offerBookings,
  };
}

export async function getUnreadAppointmentCount() {
  const counts = await getUnreadAppointmentCounts();
  return counts.total;
}

export function isAppointmentsConfigured() {
  return isFirebaseAdminConfigured();
}
