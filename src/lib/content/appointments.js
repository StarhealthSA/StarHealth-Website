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

const COLLECTION = 'appointments';

function appointmentDocId(doctorId, date, slotIndex) {
  return `${doctorId}_${date}_${slotIndex}`;
}

function openAppointmentDocId(doctorId) {
  return `${doctorId}_open_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
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

function matchesSearch(item, search) {
  if (!search) return true;
  const query = search.trim().toLowerCase();
  if (!query) return true;

  const name = (item.patientName || '').toLowerCase();
  const phone = (item.phone || '').replace(/\s+/g, '');
  const phoneQuery = query.replace(/\s+/g, '');

  return name.includes(query) || phone.includes(phoneQuery);
}

export async function listAppointments({ doctorId, date, status, search } = {}) {
  const db = getAdminDb();
  if (!db) return [];

  let query = db.collection(COLLECTION);
  if (doctorId) query = query.where('doctorId', '==', doctorId);
  if (date) query = query.where('date', '==', date);

  const snapshot = await query.get();
  let items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

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
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return b.slotIndex - a.slotIndex;
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

export async function getUnreadAppointmentCount() {
  const db = getAdminDb();
  if (!db) return 0;

  const snapshot = await db.collection(COLLECTION).where('read', '==', false).get();
  return snapshot.docs.filter((doc) => doc.data().status === 'booked').length;
}

export function isAppointmentsConfigured() {
  return isFirebaseAdminConfigured();
}
