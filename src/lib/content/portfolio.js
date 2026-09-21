import { getAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';
import { isPortfolioPublished, normalizePortfolioEntry } from './normalize-portfolio';

const COLLECTION = 'portfolioEntries';

function sortEntries(items) {
  return [...items].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) {
      return a.featured ? -1 : 1;
    }
    if ((a.order ?? 0) !== (b.order ?? 0)) {
      return (a.order ?? 0) - (b.order ?? 0);
    }
    const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return dateB - dateA;
  });
}

function normalizeList(items) {
  return sortEntries(items.map((item) => normalizePortfolioEntry(item)));
}

async function fetchFromFirestore({ publishedOnly = true, featuredOnly = false, category = null } = {}) {
  const db = getAdminDb();
  if (!db) return null;

  const snapshot = await db.collection(COLLECTION).get();
  let entries = snapshot.docs.map((doc) => normalizePortfolioEntry({ id: doc.id, ...doc.data() }));

  if (publishedOnly) {
    entries = entries.filter((entry) => isPortfolioPublished(entry));
  }

  if (featuredOnly) {
    entries = entries.filter((entry) => entry.featured);
  }

  if (category) {
    const normalized = String(category).trim().toLowerCase();
    entries = entries.filter((entry) => entry.category === normalized);
  }

  return sortEntries(entries);
}

export async function getPublishedPortfolioEntries({ featuredOnly = false, category = null } = {}) {
  try {
    if (!isFirebaseAdminConfigured()) {
      return [];
    }

    const entries = await fetchFromFirestore({
      publishedOnly: true,
      featuredOnly,
      category,
    });
    return entries || [];
  } catch (error) {
    console.error('Failed to fetch portfolio entries:', error);
    return [];
  }
}

export async function getFeaturedPortfolioEntries({ limit = 24 } = {}) {
  const featured = await getPublishedPortfolioEntries({ featuredOnly: true });
  if (featured.length) {
    return featured.slice(0, limit);
  }

  // If nothing is explicitly featured yet, show published cases so the
  // homepage section still appears after content is published.
  const published = await getPublishedPortfolioEntries();
  return published.slice(0, limit);
}

export async function getAllPortfolioEntries() {
  const db = getAdminDb();
  if (!db) return [];

  const snapshot = await db.collection(COLLECTION).get();
  return normalizeList(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
}

export async function getPortfolioEntryById(id) {
  const db = getAdminDb();
  if (!db) return null;

  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return normalizePortfolioEntry({ id: doc.id, ...doc.data() });
}

export async function createPortfolioEntry(data) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const now = new Date().toISOString();
  const docRef = db.collection(COLLECTION).doc(data.id || data.slug);
  const payload = normalizePortfolioEntry({
    ...data,
    createdAt: now,
    updatedAt: now,
  });
  await docRef.set(payload);
  return { id: docRef.id, ...payload };
}

export async function updatePortfolioEntry(id, data) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const now = new Date().toISOString();
  const payload = normalizePortfolioEntry({
    ...data,
    updatedAt: now,
  });
  await db.collection(COLLECTION).doc(id).set(payload, { merge: true });
  return { id, ...payload };
}

export async function deletePortfolioEntry(id) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');
  await db.collection(COLLECTION).doc(id).delete();
}
