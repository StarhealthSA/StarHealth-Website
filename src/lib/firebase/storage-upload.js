import { randomUUID } from 'crypto';
import { getStorageBucketCandidates } from './credentials';

function buildFirebaseDownloadUrl(bucketName, path, token) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
}

function isRetryableBucketError(error) {
  const message = (error?.message || '').toLowerCase();
  const code = error?.code;

  return (
    code === 404
    || message.includes('bucket')
    || message.includes('not found')
    || message.includes('does not exist')
  );
}

export async function uploadToFirebaseStorage(storage, { buffer, contentType, folder, extension }) {
  const bucketCandidates = getStorageBucketCandidates();
  if (!bucketCandidates.length) {
    throw new Error('Missing storage bucket. Set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in Vercel env vars.');
  }

  const path = `${folder}/${randomUUID()}.${extension}`;
  const downloadToken = randomUUID();
  let lastError = null;

  for (const bucketName of bucketCandidates) {
    try {
      const bucket = storage.bucket(bucketName);
      const fileRef = bucket.file(path);

      await fileRef.save(buffer, {
        resumable: false,
        metadata: {
          contentType,
          metadata: {
            firebaseStorageDownloadTokens: downloadToken,
          },
        },
      });

      return {
        imageUrl: buildFirebaseDownloadUrl(bucketName, path, downloadToken),
        bucketName,
        path,
      };
    } catch (error) {
      lastError = error;
      console.error(`Upload failed for bucket "${bucketName}":`, error?.message || error);

      if (!isRetryableBucketError(error)) {
        throw error;
      }
    }
  }

  throw lastError || new Error('Upload failed for all configured storage buckets.');
}
