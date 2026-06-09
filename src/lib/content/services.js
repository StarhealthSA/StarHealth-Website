import { getAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import { FALLBACK_SERVICES } from './fallback-data';

const COLLECTION = 'services';

function sortByOrder(items) {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

async function fetchServicesFromFirestore({ publishedOnly = true } = {}) {
  const db = getAdminDb();
  if (!db) return null;

  let query = db.collection(COLLECTION);
  if (publishedOnly) {
    query = query.where('published', '==', true);
  }

  const snapshot = await query.get();
  return sortByOrder(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
}

export async function getPublishedServices() {
  try {
    if (!isFirebaseAdminConfigured()) {
      return sortByOrder(FALLBACK_SERVICES.filter((s) => s.published));
    }

    const services = await fetchServicesFromFirestore({ publishedOnly: true });
    if (!services?.length) {
      return sortByOrder(FALLBACK_SERVICES.filter((s) => s.published));
    }
    return services;
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return sortByOrder(FALLBACK_SERVICES.filter((s) => s.published));
  }
}

export async function getAllServices() {
  const db = getAdminDb();
  if (!db) return FALLBACK_SERVICES;

  const snapshot = await db.collection(COLLECTION).get();
  return sortByOrder(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
}

export async function getServiceById(id) {
  const db = getAdminDb();
  if (!db) return FALLBACK_SERVICES.find((s) => s.id === id) ?? null;

  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function createService(data) {
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

export async function updateService(id, data) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const now = new Date().toISOString();
  const payload = { ...data, updatedAt: now };
  await db.collection(COLLECTION).doc(id).set(payload, { merge: true });
  return { id, ...payload };
}

export async function deleteService(id) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');
  await db.collection(COLLECTION).doc(id).delete();
}
