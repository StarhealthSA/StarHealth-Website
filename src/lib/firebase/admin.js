import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { getFirebaseAdminCredential, getStorageBucketCandidates } from './credentials';

export function isFirebaseAdminConfigured() {
  const { projectId, clientEmail, privateKey } = getFirebaseAdminCredential();
  return Boolean(projectId && clientEmail && privateKey);
}

function getAdminApp() {
  if (!isFirebaseAdminConfigured()) {
    return null;
  }

  if (getApps().length) {
    return getApps()[0];
  }

  const { projectId, clientEmail, privateKey } = getFirebaseAdminCredential();
  const [storageBucket] = getStorageBucketCandidates();

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    storageBucket,
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
