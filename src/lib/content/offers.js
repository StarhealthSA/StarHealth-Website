import { getAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import { isOfferCurrentlyValid, isOfferPublished, normalizeOffer } from './normalize-offer';

const COLLECTION = 'offers';

function sortOffers(items) {
  return [...items].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) {
      return a.featured ? -1 : 1;
    }
    if ((a.order ?? 0) !== (b.order ?? 0)) {
      return (a.order ?? 0) - (b.order ?? 0);
    }
    const dateA = new Date(a.validUntil || 0).getTime();
    const dateB = new Date(b.validUntil || 0).getTime();
    return dateA - dateB;
  });
}

function normalizeList(items) {
  return sortOffers(items.map((item) => normalizeOffer(item)));
}

async function fetchOffersFromFirestore({ publishedOnly = true, validOnly = false } = {}) {
  const db = getAdminDb();
  if (!db) return null;

  const snapshot = await db.collection(COLLECTION).get();
  let offers = snapshot.docs.map((doc) => normalizeOffer({ id: doc.id, ...doc.data() }));

  if (publishedOnly) {
    offers = offers.filter((offer) => isOfferPublished(offer));
  }

  if (validOnly) {
    offers = offers.filter((offer) => isOfferCurrentlyValid(offer));
  }

  return sortOffers(offers);
}

export async function getPublishedOffers() {
  try {
    if (!isFirebaseAdminConfigured()) {
      return [];
    }

    const offers = await fetchOffersFromFirestore({ publishedOnly: true, validOnly: true });
    return offers || [];
  } catch (error) {
    console.error('Failed to fetch offers:', error);
    return [];
  }
}

export async function getAllOffers() {
  const db = getAdminDb();
  if (!db) return [];

  const snapshot = await db.collection(COLLECTION).get();
  return normalizeList(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
}

export async function getOfferById(id) {
  const db = getAdminDb();
  if (!db) return null;

  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return normalizeOffer({ id: doc.id, ...doc.data() });
}

export async function createOffer(data) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const now = new Date().toISOString();
  const docRef = db.collection(COLLECTION).doc(data.id || data.slug);
  const payload = normalizeOffer({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  await docRef.set(payload);
  return { id: docRef.id, ...payload };
}

export async function updateOffer(id, data) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const now = new Date().toISOString();
  const payload = normalizeOffer({
    ...data,
    updatedAt: now,
  });
  await db.collection(COLLECTION).doc(id).set(payload, { merge: true });
  return { id, ...payload };
}

export async function deleteOffer(id) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');
  await db.collection(COLLECTION).doc(id).delete();
}
