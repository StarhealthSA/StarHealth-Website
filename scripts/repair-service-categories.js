/**
 * Align service category ids/names and doctor categoryId assignments.
 * Usage: node scripts/repair-service-categories.js
 */

import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminCredential, loadEnv } from './load-env.js';

loadEnv();

if (!getApps().length) {
  initializeApp({ credential: cert(getAdminCredential()) });
}

const db = getFirestore();

const SERVICE_CATEGORIES = [
  {
    id: 'general-medicine',
    slug: 'general-medicine',
    name: { en: 'General Medicine', ar: 'الطب العام' },
    order: 1,
    active: true,
  },
  {
    id: 'internal-medicine',
    slug: 'internal-medicine',
    name: { en: 'Internal Medicine', ar: 'الطب الباطني' },
    order: 2,
    active: true,
  },
  {
    id: 'laboratory',
    slug: 'laboratory',
    name: { en: 'Laboratory', ar: 'معمل' },
    order: 3,
    active: true,
  },
  {
    id: 'pediatrics',
    slug: 'pediatrics',
    name: { en: 'Pediatrics', ar: 'طب الأطفال' },
    order: 4,
    active: true,
  },
  {
    id: 'sports-injury',
    slug: 'sports-injury',
    name: { en: 'Sports Injury', ar: 'إصابات رياضية' },
    order: 5,
    active: true,
  },
  {
    id: 'family-medicine',
    slug: 'family-medicine',
    name: { en: 'Family Medicine', ar: 'طب العائلة' },
    order: 6,
    active: true,
  },
  {
    id: 'obg',
    slug: 'obg',
    name: { en: 'Obstetrics & Gynecology (OBG)', ar: 'التوليد وأمراض النساء' },
    order: 7,
    active: true,
  },
  {
    id: 'dermatology',
    slug: 'dermatology',
    name: { en: 'Dermatology', ar: 'الأمراض الجلدية' },
    order: 8,
    active: true,
  },
  {
    id: 'dentistry',
    slug: 'dentistry',
    name: { en: 'Dentistry & Orthodontics', ar: 'طب الأسنان وتقويم الأسنان' },
    order: 9,
    active: true,
  },
];

const LEGACY_CATEGORY_IDS = [
  'primary-care',
  'womens-health',
  'dental',
  'diagnostics',
  'orthopedics',
];

const DOCTOR_CATEGORY_BY_ID = {
  'dr-aljazi-al-baqmi': 'dentistry',
  'dr-waad-al-sayed': 'dentistry',
  'dr-haifa-ali-khalid': 'pediatrics',
  'dr-hany-mostafa': 'general-medicine',
  'dr-thanaa-shehab': 'obg',
  'dr-asmaa-shawqi': 'family-medicine',
  shan: 'general-medicine',
  asdsad: 'internal-medicine',
};

const SPECIALIZATION_CATEGORY_BY_ID = {
  'general-medicine': 'general-medicine',
  'family-medicine': 'family-medicine',
  'internal-medicine': 'internal-medicine',
  paediatrics: 'pediatrics',
  pediatrics: 'pediatrics',
  dentistry: 'dentistry',
  orthodontics: 'dentistry',
  obg: 'obg',
  'botox-full-face': 'dermatology',
  'cold-peeling': 'dermatology',
  'd-c': 'obg',
};

const SERVICE_CATEGORY_BY_ID = {
  'general-medicine': 'general-medicine',
  'family-medicine': 'family-medicine',
  'internal-medicine': 'internal-medicine',
  laboratory: 'laboratory',
  pediatrics: 'pediatrics',
  obg: 'obg',
  dentistry: 'dentistry',
  orthopedics: 'dermatology',
};

async function repair() {
  const now = new Date().toISOString();

  for (const category of SERVICE_CATEGORIES) {
    await db.collection('serviceCategories').doc(category.id).set(
      {
        ...category,
        description: category.description || { en: '', ar: '' },
        updatedAt: now,
        createdAt: now,
      },
      { merge: true }
    );
    console.log(`Updated category: ${category.id}`);
  }

  for (const legacyId of LEGACY_CATEGORY_IDS) {
    await db.collection('serviceCategories').doc(legacyId).delete();
    console.log(`Removed legacy category: ${legacyId}`);
  }

  const doctorSnap = await db.collection('doctors').get();
  for (const doc of doctorSnap.docs) {
    const data = doc.data();
    const mapped =
      DOCTOR_CATEGORY_BY_ID[doc.id] ||
      SPECIALIZATION_CATEGORY_BY_ID[data.specializationId] ||
      SPECIALIZATION_CATEGORY_BY_ID[data.subSpecializationId] ||
      data.categoryId;

    if (!mapped) continue;

    await doc.ref.set(
      {
        categoryId: mapped,
        updatedAt: now,
      },
      { merge: true }
    );
    console.log(`Updated doctor ${doc.id} -> categoryId: ${mapped}`);
  }

  const specSnap = await db.collection('specializations').get();
  for (const doc of specSnap.docs) {
    const mapped = SPECIALIZATION_CATEGORY_BY_ID[doc.id];
    if (!mapped) continue;

    await doc.ref.set(
      {
        categoryId: mapped,
        updatedAt: now,
      },
      { merge: true }
    );
    console.log(`Updated specialization ${doc.id} -> categoryId: ${mapped}`);
  }

  const serviceSnap = await db.collection('services').get();
  for (const doc of serviceSnap.docs) {
    const mapped =
      SERVICE_CATEGORY_BY_ID[doc.id] ||
      SERVICE_CATEGORY_BY_ID[doc.data().slug];
    if (!mapped) continue;

    await doc.ref.set(
      {
        categoryId: mapped,
        updatedAt: now,
      },
      { merge: true }
    );
    console.log(`Updated service ${doc.id} -> categoryId: ${mapped}`);
  }

  console.log('Repair complete.');
}

repair().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
