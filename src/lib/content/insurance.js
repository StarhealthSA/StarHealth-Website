import { getAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import {
  isInsurancePartnerPublished,
  normalizeInsurancePartner,
} from './normalize-insurance';

const COLLECTION = 'insurancePartners';

function sortPartners(items) {
  return [...items].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) {
      return a.featured ? -1 : 1;
    }
    if ((a.order ?? 0) !== (b.order ?? 0)) {
      return (a.order ?? 0) - (b.order ?? 0);
    }
    const nameA = a.name?.en || '';
    const nameB = b.name?.en || '';
    return nameA.localeCompare(nameB);
  });
}

function normalizeList(items) {
  return sortPartners(items.map((item) => normalizeInsurancePartner(item)));
}

async function fetchPartnersFromFirestore({ publishedOnly = true } = {}) {
  const db = getAdminDb();
  if (!db) return null;

  const snapshot = await db.collection(COLLECTION).get();
  let partners = snapshot.docs.map((doc) =>
    normalizeInsurancePartner({ id: doc.id, ...doc.data() })
  );

  if (publishedOnly) {
    partners = partners.filter((partner) => isInsurancePartnerPublished(partner));
  }

  return sortPartners(partners);
}

export async function getPublishedInsurancePartners() {
  try {
    if (!isFirebaseAdminConfigured()) {
      return [];
    }

    const partners = await fetchPartnersFromFirestore({ publishedOnly: true });
    return partners || [];
  } catch (error) {
    console.error('Failed to fetch insurance partners:', error);
    return [];
  }
}

export async function getAllInsurancePartners() {
  const db = getAdminDb();
  if (!db) return [];

  const snapshot = await db.collection(COLLECTION).get();
  return normalizeList(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
}

export async function getInsurancePartnerById(id) {
  const db = getAdminDb();
  if (!db) return null;

  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return normalizeInsurancePartner({ id: doc.id, ...doc.data() });
}

export async function createInsurancePartner(data) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const now = new Date().toISOString();
  const docRef = db.collection(COLLECTION).doc(data.id || data.slug);
  const payload = normalizeInsurancePartner({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  await docRef.set(payload);
  return { id: docRef.id, ...payload };
}

export async function updateInsurancePartner(id, data) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const now = new Date().toISOString();
  const payload = normalizeInsurancePartner({
    ...data,
    updatedAt: now,
  });
  await db.collection(COLLECTION).doc(id).set(payload, { merge: true });
  return { id, ...payload };
}

export async function deleteInsurancePartner(id) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');
  await db.collection(COLLECTION).doc(id).delete();
}
