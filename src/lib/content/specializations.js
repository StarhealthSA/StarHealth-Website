import { getAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import { FALLBACK_SPECIALIZATIONS } from './fallback-specializations';
import {
  isSpecializationActive,
  normalizeSpecialization,
} from './normalize-specialization';

const COLLECTION = 'specializations';

function sortByOrder(items) {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function normalizeList(items) {
  return sortByOrder(items.map((item) => normalizeSpecialization(item)));
}

async function fetchSpecializations({ activeOnly = true } = {}) {
  const db = getAdminDb();
  if (!db) return null;

  let query = db.collection(COLLECTION);
  if (activeOnly) {
    query = query.where('active', '==', true);
  }

  const snapshot = await query.get();
  return sortByOrder(snapshot.docs.map((doc) => normalizeSpecialization({ id: doc.id, ...doc.data() })));
}

export async function getActiveSpecializations() {
  try {
    if (!isFirebaseAdminConfigured()) {
      return normalizeList(FALLBACK_SPECIALIZATIONS.filter((s) => s.active));
    }
    // When Firebase is configured, trust the DB — empty collection means no specializations.
    return (await fetchSpecializations({ activeOnly: true })) ?? [];
  } catch (error) {
    console.error('Failed to fetch specializations:', error);
    if (!isFirebaseAdminConfigured()) {
      return normalizeList(FALLBACK_SPECIALIZATIONS.filter((s) => s.active));
    }
    return [];
  }
}

export async function getAllSpecializations() {
  const db = getAdminDb();
  if (!db) return normalizeList(FALLBACK_SPECIALIZATIONS);
  const snapshot = await db.collection(COLLECTION).get();
  return normalizeList(snapshot.docs.map((doc) => normalizeSpecialization({ id: doc.id, ...doc.data() })));
}

export async function getSpecializationById(id) {
  const db = getAdminDb();
  if (!db) {
    const spec = FALLBACK_SPECIALIZATIONS.find((s) => s.id === id);
    return spec ? normalizeSpecialization(spec) : null;
  }
  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return normalizeSpecialization({ id: doc.id, ...doc.data() });
}

export async function getSpecializationBySlug(slug) {
  const normalizedSlug = slug?.trim();
  if (!normalizedSlug) return null;

  const db = getAdminDb();
  if (!db) {
    const spec = FALLBACK_SPECIALIZATIONS.find((s) => s.slug === normalizedSlug);
    return spec && isSpecializationActive(spec) ? normalizeSpecialization(spec) : null;
  }

  const snapshot = await db.collection(COLLECTION)
    .where('slug', '==', normalizedSlug)
    .limit(1)
    .get();

  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    const spec = normalizeSpecialization({ id: doc.id, ...doc.data() });
    return isSpecializationActive(spec) ? spec : null;
  }

  const byId = await getSpecializationById(normalizedSlug);
  return byId && isSpecializationActive(byId) ? byId : null;
}

export async function createSpecialization(data) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');
  const now = new Date().toISOString();
  const docRef = db.collection(COLLECTION).doc(data.id || data.slug);
  const payload = normalizeSpecialization({ ...data, createdAt: now, updatedAt: now });
  await docRef.set(payload);
  return { id: docRef.id, ...payload };
}

export async function updateSpecialization(id, data) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');
  const now = new Date().toISOString();
  const payload = normalizeSpecialization({ ...data, updatedAt: now });
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
  getSpecializationsByParentService,
  getSpecializationsForService,
  findSpecializationName,
} from './specialization-utils';
