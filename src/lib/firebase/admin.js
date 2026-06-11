import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

export function isFirebaseAdminConfigured() {
  return Boolean(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY
  );
}

function getAdminApp() {
  if (!isFirebaseAdminConfigured()) {
    return null;
  }

  if (getApps().length) {
    return getApps()[0];
  }

  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey,
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

export function getAdminDb() {
  const app = getAdminApp();
  if (!app) return null;
  return getFirestore(app);
}

export function getAdminAuth() {
  const app = getAdminApp();
  if (!app) return null;
  return getAuth(app);
}

export function getAdminStorage() {
  const app = getAdminApp();
  if (!app) return null;
  return getStorage(app);
}
