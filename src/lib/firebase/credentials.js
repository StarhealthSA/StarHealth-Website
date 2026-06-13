export function normalizePrivateKey(raw) {
  if (!raw) return '';
  let key = raw.trim();
  if (
    (key.startsWith('"') && key.endsWith('"'))
    || (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1);
  }
  return key.replace(/\\n/g, '\n');
}

export function getFirebaseAdminCredential() {
  const projectId = (
    process.env.FIREBASE_ADMIN_PROJECT_ID
    || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    || ''
  ).trim();

  const clientEmail = (process.env.FIREBASE_ADMIN_CLIENT_EMAIL || '').trim();
  const privateKey = normalizePrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY);

  return { projectId, clientEmail, privateKey };
}

export function getStorageBucketCandidates() {
  const { projectId } = getFirebaseAdminCredential();
  const candidates = [
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    process.env.FIREBASE_STORAGE_BUCKET,
    projectId ? `${projectId}.firebasestorage.app` : null,
    projectId ? `${projectId}.appspot.com` : null,
  ]
    .map((value) => value?.trim())
    .filter(Boolean);

  return [...new Set(candidates)];
}
