import { getAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';

const COLLECTION = 'enquiries';

function matchesSearch(item, search) {
  if (!search) return true;
  const query = search.trim().toLowerCase();
  if (!query) return true;

  const name = (item.name || '').toLowerCase();
  const email = (item.email || '').toLowerCase();
  const phone = (item.phone || '').replace(/\s+/g, '');
  const phoneQuery = query.replace(/\s+/g, '');

  return name.includes(query) || email.includes(query) || phone.includes(phoneQuery);
}

export async function createEnquiry(payload, { source = 'website', read = false } = {}) {
  const db = getAdminDb();
  if (!db) {
    throw new Error('Enquiry submission is not available right now. Please try again later.');
  }

  const {
    name,
    phone,
    email,
    country,
    speciality,
    address,
    message,
  } = payload;

  if (!name?.trim()) throw new Error('Name is required');
  if (!phone?.trim()) throw new Error('Phone number is required');
  if (!email?.trim()) throw new Error('Email is required');

  const now = new Date().toISOString();
  const ref = db.collection(COLLECTION).doc();

  const data = {
    id: ref.id,
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim(),
    country: country?.trim() || '',
    speciality: speciality?.trim() || '',
    address: address?.trim() || '',
    message: message?.trim() || '',
    source,
    read: Boolean(read),
    createdAt: now,
  };

  await ref.set(data);
  return data;
}

export async function listEnquiries({ search } = {}) {
  const db = getAdminDb();
  if (!db) return [];

  const snapshot = await db.collection(COLLECTION).get();
  let items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  if (search) {
    items = items.filter((item) => matchesSearch(item, search));
  }

  return items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

export async function getEnquiryById(id) {
  const db = getAdminDb();
  if (!db) return null;

  const doc = await db.collection(COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function markEnquiryRead(id) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  await db.collection(COLLECTION).doc(id).set({ read: true }, { merge: true });
  return getEnquiryById(id);
}

export async function deleteEnquiry(id) {
  const db = getAdminDb();
  if (!db) throw new Error('Firebase Admin is not configured');

  const existing = await getEnquiryById(id);
  if (!existing) throw new Error('Enquiry not found');

  await db.collection(COLLECTION).doc(id).delete();
  return { id, deleted: true };
}

export async function getUnreadEnquiryCount() {
  const db = getAdminDb();
  if (!db) return 0;

  const snapshot = await db.collection(COLLECTION).where('read', '==', false).get();
  return snapshot.size;
}

export function isEnquiriesConfigured() {
  return isFirebaseAdminConfigured();
}
