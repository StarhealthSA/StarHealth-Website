/**
 * Seed Firestore with initial doctors and services.
 * Usage: node scripts/seed-firebase.js
 */

import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminCredential, loadEnv } from './load-env.js';

loadEnv();

if (!getApps().length) {
  const credential = getAdminCredential();
  initializeApp({
    credential: cert(credential),
  });
}

const db = getFirestore();

const { FALLBACK_DOCTORS, FALLBACK_SERVICES } = await import('../src/lib/content/fallback-data.js');

async function seed() {
  const now = new Date().toISOString();

  for (const doctor of FALLBACK_DOCTORS) {
    await db.collection('doctors').doc(doctor.id).set({
      ...doctor,
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
