import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminCredential, loadEnv } from './load-env.js';

loadEnv();

if (!getApps().length) {
  initializeApp({ credential: cert(getAdminCredential()) });
}

const db = getFirestore();
const { FALLBACK_SPECIALIZATIONS } = await import('../src/lib/content/fallback-specializations.js');

const now = new Date().toISOString();

for (const spec of FALLBACK_SPECIALIZATIONS) {
  await db.collection('specializations').doc(spec.id).set({
    ...spec,
    createdAt: now,
    updatedAt: now,
  });
  console.log(`Seeded specialization: ${spec.id}`);
}

console.log('Specializations seed complete.');
