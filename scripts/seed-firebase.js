/**
 * Seed Firestore with initial specializations, doctors, and services.
 * Usage: node scripts/seed-firebase.js
 */

import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminCredential, loadEnv } from './load-env.js';

loadEnv();

if (!getApps().length) {
  initializeApp({ credential: cert(getAdminCredential()) });
}

const db = getFirestore();

const { FALLBACK_DOCTORS, FALLBACK_SERVICES } = await import('../src/lib/content/fallback-data.js');
const { FALLBACK_SPECIALIZATIONS } = await import('../src/lib/content/fallback-specializations.js');
const { normalizeDoctor } = await import('../src/lib/content/normalize-doctor.js');

async function seed() {
  const now = new Date().toISOString();

  for (const spec of FALLBACK_SPECIALIZATIONS) {
    await db.collection('specializations').doc(spec.id).set({
      ...spec,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`Seeded specialization: ${spec.id}`);
  }

  for (const doctor of FALLBACK_DOCTORS) {
    const normalized = normalizeDoctor(doctor);
    await db.collection('doctors').doc(doctor.id).set({
      ...normalized,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`Seeded doctor: ${doctor.id}`);
  }

  for (const service of FALLBACK_SERVICES) {
    await db.collection('services').doc(service.id).set({
      ...service,
      createdAt: now,
      updatedAt: now,
    });
    console.log(`Seeded service: ${service.id}`);
  }

  console.log('Seed complete.');
}

seed().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
