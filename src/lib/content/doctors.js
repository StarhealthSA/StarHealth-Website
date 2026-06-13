import { getAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import { FALLBACK_DOCTORS } from './fallback-data';
import { normalizeDoctor, isDoctorActive } from './normalize-doctor';

const COLLECTION = 'doctors';

function sortByOrder(items) {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function normalizeList(items) {
  return sortByOrder(items.map(normalizeDoctor));
}

async function fetchDoctorsFromFirestore({ activeOnly = true } = {}) {
  const db = getAdminDb();
  if (!db) return null;

  const snapshot = await db.collection(COLLECTION).get();
  let doctors = snapshot.docs.map((doc) => normalizeDoctor({ id: doc.id, ...doc.data() }));

  if (activeOnly) {
    doctors = doctors.filter((d) => d.status === 'active');
  }

  return sortByOrder(doctors);
}

export async function getActiveDoctors() {
  return getPublishedDoctors();
}

export async function getPublishedDoctors() {
  try {
    if (!isFirebaseAdminConfigured()) {
      return normalizeList(FALLBACK_DOCTORS.filter((d) => d.published !== false));
    }

    const doctors = await fetchDoctorsFromFirestore({ activeOnly: true });
    if (!doctors?.length) {
      return normalizeList(FALLBACK_DOCTORS.filter((d) => d.published !== false));
    }
    return doctors;
  } catch (error) {
    console.error('Failed to fetch doctors:', error);
    return normalizeList(FALLBACK_DOCTORS.filter((d) => d.published !== false));
  }
}

export async function getFeaturedDoctors() {
  const doctors = await getPublishedDoctors();
  const featured = doctors.filter((d) => d.featured);
  return featured.length ? featured : doctors.slice(0, 4);
}

export async function getAllDoctors() {
  const db = getAdminDb();
  if (!db) return normalizeList(FALLBACK_DOCTORS);

  const snapshot = await db.collection(COLLECTION).get();
  return normalizeList(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
}

export async function getDoctorById(id) {
  const db = getAdminDb();
  if (!db) {
    const found = FALLBACK_DOCTORS.find((d) => d.id === id);
    return found ? normalizeDoctor(found) : null;
  }

  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return normalizeDoctor({ id: doc.id, ...doc.data() });
}

export async function getDoctorBySlug(slug) {
  const db = getAdminDb();

  if (!db) {
    const found = FALLBACK_DOCTORS.find((d) => d.slug === slug || d.id === slug);
    return found && isDoctorActive(found) ? normalizeDoctor(found) : null;
  }

  const byId = await db.collection(COLLECTION).doc(slug).get();
  if (byId.exists) {
    const doctor = normalizeDoctor({ id: byId.id, ...byId.data() });
    return isDoctorActive(doctor) ? doctor : null;
  }

  const snapshot = await db.collection(COLLECTION).where('slug', '==', slug).limit(1).get();
  if (snapshot.empty) return null;

  const doctor = normalizeDoctor({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
  return isDoctorActive(doctor) ? doctor : null;
}

export async function createDoctor(data) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const now = new Date().toISOString();
  const normalized = normalizeDoctor(data);
  const docRef = db.collection(COLLECTION).doc(data.id || data.slug);
  const payload = { ...normalized, createdAt: now, updatedAt: now };
  await docRef.set(payload);
  return { id: docRef.id, ...payload };
}

export async function updateDoctor(id, data) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const now = new Date().toISOString();
  const normalized = normalizeDoctor({ ...data, id });
  const payload = {
    ...normalized,
    categoryId: data.categoryId ?? normalized.categoryId ?? null,
    dateAvailability: data.dateAvailability ?? normalized.dateAvailability,
    updatedAt: now,
  };
  await db.collection(COLLECTION).doc(id).set(payload, { merge: true });
  return { id, ...payload };
}

export async function deleteDoctor(id) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');
  await db.collection(COLLECTION).doc(id).delete();
}
