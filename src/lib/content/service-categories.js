import { getAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import { FALLBACK_SERVICE_CATEGORIES } from './fallback-service-categories';

const COLLECTION = 'serviceCategories';

function sortByOrder(items) {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

async function fetchCategories({ activeOnly = true } = {}) {
  const db = getAdminDb();
  if (!db) return null;

  let query = db.collection(COLLECTION);
  if (activeOnly) {
    query = query.where('active', '==', true);
  }

  const snapshot = await query.get();
  return sortByOrder(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
}

export async function getActiveServiceCategories() {
  try {
    if (!isFirebaseAdminConfigured()) {
      return sortByOrder(FALLBACK_SERVICE_CATEGORIES.filter((c) => c.active));
    }
    const items = await fetchCategories({ activeOnly: true });
    if (!items?.length) {
      return sortByOrder(FALLBACK_SERVICE_CATEGORIES.filter((c) => c.active));
    }
    return items;
  } catch (error) {
    console.error('Failed to fetch service categories:', error);
    return sortByOrder(FALLBACK_SERVICE_CATEGORIES.filter((c) => c.active));
  }
}

export async function getAllServiceCategories() {
  const db = getAdminDb();
  if (!db) return FALLBACK_SERVICE_CATEGORIES;
  const snapshot = await db.collection(COLLECTION).get();
  return sortByOrder(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
}

export async function getServiceCategoryById(id) {
  const db = getAdminDb();
  if (!db) return FALLBACK_SERVICE_CATEGORIES.find((c) => c.id === id) ?? null;
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function createServiceCategory(data) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');
  const now = new Date().toISOString();
  const docRef = db.collection(COLLECTION).doc(data.id || data.slug);
  const payload = { ...data, createdAt: now, updatedAt: now };
  await docRef.set(payload);
  return { id: docRef.id, ...payload };
}

export async function updateServiceCategory(id, data) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');
  const now = new Date().toISOString();
  const payload = { ...data, updatedAt: now };
  await db.collection(COLLECTION).doc(id).set(payload, { merge: true });
  return { id, ...payload };
}

export async function deleteServiceCategory(id) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');
  await db.collection(COLLECTION).doc(id).delete();
}
