import { getAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import { FALLBACK_DOCTORS } from './fallback-data';

const COLLECTION = 'doctors';

function sortByOrder(items) {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

async function fetchDoctorsFromFirestore({ publishedOnly = true } = {}) {
  const db = getAdminDb();
  if (!db) return null;

  let query = db.collection(COLLECTION);

  if (publishedOnly) {
    query = query.where('published', '==', true);
  }

  const snapshot = await query.get();
  const doctors = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return sortByOrder(doctors);
}

export async function getPublishedDoctors() {
  try {
    if (!isFirebaseAdminConfigured()) {
      return sortByOrder(FALLBACK_DOCTORS.filter((d) => d.published));
    }

    const doctors = await fetchDoctorsFromFirestore({ publishedOnly: true });
    if (!doctors?.length) {
      return sortByOrder(FALLBACK_DOCTORS.filter((d) => d.published));
    }
    return doctors;
  } catch (error) {
    console.error('Failed to fetch doctors:', error);
    return sortByOrder(FALLBACK_DOCTORS.filter((d) => d.published));
  }
}

export async function getFeaturedDoctors() {
  const doctors = await getPublishedDoctors();
  const featured = doctors.filter((d) => d.featured);
  return featured.length ? featured : doctors.slice(0, 4);
}

export async function getAllDoctors() {
  const db = getAdminDb();
  if (!db) return FALLBACK_DOCTORS;

  const snapshot = await db.collection(COLLECTION).get();
  return sortByOrder(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
}

export async function getDoctorById(id) {
  const db = getAdminDb();
  if (!db) return FALLBACK_DOCTORS.find((d) => d.id === id) ?? null;

  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function createDoctor(data) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const now = new Date().toISOString();
  const docRef = db.collection(COLLECTION).doc(data.id || data.slug);
  const payload = {
    ...data,
    createdAt: now,
    updatedAt: now,
  };
  await docRef.set(payload);
  return { id: docRef.id, ...payload };
}

export async function updateDoctor(id, data) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const now = new Date().toISOString();
  const payload = { ...data, updatedAt: now };
  await db.collection(COLLECTION).doc(id).set(payload, { merge: true });
  return { id, ...payload };
}

export async function deleteDoctor(id) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');
  await db.collection(COLLECTION).doc(id).delete();
}
