import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminCredential, loadEnv } from './load-env.js';

loadEnv();

if (!getApps().length) {
  initializeApp({ credential: cert(getAdminCredential()) });
}

const db = getFirestore();
const { normalizeDoctor } = await import('../src/lib/content/normalize-doctor.js');

const snapshot = await db.collection('doctors').get();

for (const doc of snapshot.docs) {
  const raw = { id: doc.id, ...doc.data() };
  const normalized = normalizeDoctor(raw);

  if (!normalized.profilePhotoUrl && raw.imageUrl) {
    normalized.profilePhotoUrl = raw.imageUrl;
  }

  await db.collection('doctors').doc(doc.id).set({
    ...normalized,
    updatedAt: new Date().toISOString(),
  }, { merge: true });

  console.log(`Migrated doctor: ${doc.id}`);
}

console.log('Doctor migration complete.');
