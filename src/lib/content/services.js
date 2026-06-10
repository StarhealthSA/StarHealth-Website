import { getAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import { FALLBACK_SERVICES } from './fallback-data';
import { isServiceActive, normalizeService } from './normalize-service';

const COLLECTION = 'services';

function sortByOrder(items) {
  return [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

function normalizeList(items) {
  return sortByOrder(items.map((item) => normalizeService(item)));
}

function filterPublished(services) {
  return services.filter((service) => isServiceActive(service));
}

async function fetchServicesFromFirestore({ publishedOnly = true } = {}) {
  const db = getAdminDb();
  if (!db) return null;

  const snapshot = await db.collection(COLLECTION).get();
  const services = sortByOrder(snapshot.docs.map((doc) => normalizeService({ id: doc.id, ...doc.data() })));
  return publishedOnly ? filterPublished(services) : services;
}

export async function getPublishedServices({ categoryId } = {}) {
  try {
    let services;
    if (!isFirebaseAdminConfigured()) {
      services = normalizeList(FALLBACK_SERVICES);
    } else {
      const fetched = await fetchServicesFromFirestore({ publishedOnly: true });
      services = fetched?.length ? fetched : normalizeList(FALLBACK_SERVICES);
    }

    if (categoryId) {
      return services.filter((s) => s.categoryId === categoryId);
    }
    return services;
  } catch (error) {
    console.error('Failed to fetch services:', error);
    const services = normalizeList(FALLBACK_SERVICES);
    return categoryId ? services.filter((s) => s.categoryId === categoryId) : services;
  }
}

export async function getAllServices() {
  const db = getAdminDb();
  if (!db) return normalizeList(FALLBACK_SERVICES);
  const snapshot = await db.collection(COLLECTION).get();
  return normalizeList(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
}

export async function getServiceById(id) {
  const db = getAdminDb();
  if (!db) {
    const service = FALLBACK_SERVICES.find((s) => s.id === id);
    return service ? normalizeService(service) : null;
  }

  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return normalizeService({ id: doc.id, ...doc.data() });
}

export async function getServiceBySlug(slug) {
  const db = getAdminDb();
  if (!db) {
    const service = FALLBACK_SERVICES.find((s) => s.slug === slug);
    if (!service || !isServiceActive(service)) return null;
    return normalizeService(service);
  }

  const snapshot = await db.collection(COLLECTION).where('slug', '==', slug).limit(1).get();
  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    const service = normalizeService({ id: doc.id, ...doc.data() });
    return isServiceActive(service) ? service : null;
  }

  const byId = await getServiceById(slug);
  return byId && isServiceActive(byId) ? byId : null;
}

export async function createService(data) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const now = new Date().toISOString();
  const docRef = db.collection(COLLECTION).doc(data.id || data.slug);
  const payload = normalizeService({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  await docRef.set(payload);
  return { id: docRef.id, ...payload };
}

export async function updateService(id, data) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const now = new Date().toISOString();
  const payload = normalizeService({
    ...data,
    updatedAt: now,
  });
  await db.collection(COLLECTION).doc(id).set(payload, { merge: true });
  return { id, ...payload };
}

export async function deleteService(id) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');
  await db.collection(COLLECTION).doc(id).delete();
}
