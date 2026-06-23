import { getAdminDb, isFirebaseAdminConfigured } from '@/lib/firebase/admin';

const COLLECTION = 'enquiries';

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

export function isEnquiriesConfigured() {
  return isFirebaseAdminConfigured();
}
