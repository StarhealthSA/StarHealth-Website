import { getAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import { FALLBACK_SPECIALIZATIONS } from './fallback-specializations';

const COLLECTION = 'specializations';

function sortByOrder(items) {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

async function fetchSpecializations({ activeOnly = true } = {}) {
  const db = getAdminDb();
  if (!db) return null;

  let query = db.collection(COLLECTION);
  if (activeOnly) {
    query = query.where('active', '==', true);
  }

  const snapshot = await query.get();
  return sortByOrder(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
}

export async function getActiveSpecializations() {
  try {
    if (!isFirebaseAdminConfigured()) {
      return sortByOrder(FALLBACK_SPECIALIZATIONS.filter((s) => s.active));
    }
    const items = await fetchSpecializations({ activeOnly: true });
    if (!items?.length) {
      return sortByOrder(FALLBACK_SPECIALIZATIONS.filter((s) => s.active));
    }
    return items;
  } catch (error) {
    console.error('Failed to fetch specializations:', error);
    return sortByOrder(FALLBACK_SPECIALIZATIONS.filter((s) => s.active));
  }
}

export async function getAllSpecializations() {
  const db = getAdminDb();
  if (!db) return FALLBACK_SPECIALIZATIONS;
  const snapshot = await db.collection(COLLECTION).get();
  return sortByOrder(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
}

export async function getSpecializationById(id) {
  const db = getAdminDb();
  if (!db) return FALLBACK_SPECIALIZATIONS.find((s) => s.id === id) ?? null;
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function createSpecialization(data) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');
  const now = new Date().toISOString();
  const docRef = db.collection(COLLECTION).doc(data.id || data.slug);
  const payload = { ...data, createdAt: now, updatedAt: now };
  await docRef.set(payload);
  return { id: docRef.id, ...payload };
}

export async function updateSpecialization(id, data) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');
  const now = new Date().toISOString();
  const payload = { ...data, updatedAt: now };
  await db.collection(COLLECTION).doc(id).set(payload, { merge: true });
  return { id, ...payload };
}

export async function deleteSpecialization(id) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');
  await db.collection(COLLECTION).doc(id).delete();
}

export {
  getTopLevelSpecializations,
  getSubSpecializations,
  getSpecializationsByCategory,
  getSpecializationCategoryId,
  findSpecializationName,
} from './specialization-utils';
