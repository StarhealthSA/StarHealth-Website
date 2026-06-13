import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { authenticateRequest, WRITE_ROLES } from '@/lib/firebase/auth';
import { getAdminStorage } from '@/lib/firebase/admin';
import { prepareUploadBuffer } from '@/lib/images/prepare-upload-buffer';

export const runtime = 'nodejs';
export const maxDuration = 60;

function extensionFromName(filename) {
  const match = filename.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1].toLowerCase() : 'bin';
}

function getStorageBucketName() {
  return (
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    || process.env.FIREBASE_STORAGE_BUCKET
    || `${process.env.FIREBASE_ADMIN_PROJECT_ID}.appspot.com`
  );
}

function buildFirebaseDownloadUrl(bucketName, path, token) {
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
}

function mapUploadError(error) {
  const message = error?.message || 'Upload failed';

  if (message.includes('permissions') || message.includes('Permission')) {
    return { status: 403, error: 'Storage permission denied. Grant the Firebase Admin service account Storage Object Admin access.' };
  }

  if (
    message.includes('not configured')
    || message.includes('Storage')
    || message.includes('No bucket')
    || message.includes('bucket does not exist')
  ) {
    return { status: 503, error: 'Firebase Storage is not configured correctly. Check NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET on Vercel.' };
  }

  if (message.includes('uniform bucket-level access')) {
    return { status: 503, error: 'Storage bucket ACL settings blocked the upload. Contact support to update the upload configuration.' };
  }

  if (message.includes('Input') || message.includes('unsupported')) {
    return { status: 400, error: 'Invalid image file' };
  }

  if (message.includes('token') || message.includes('auth') || message.includes('authorization')) {
    return { status: 401, error: message };
  }

  return { status: 500, error: message };
}

export async function POST(request) {
  try {
    await authenticateRequest(request, WRITE_ROLES);

    const storage = getAdminStorage();
    if (!storage) {
      return NextResponse.json({ error: 'Firebase Storage is not configured' }, { status: 503 });
    }

    const bucketName = getStorageBucketName();
    if (!bucketName) {
      return NextResponse.json(
        { error: 'Missing storage bucket. Set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET in Vercel env vars.' },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'uploads';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || 'application/octet-stream';
    const { buffer, contentType, extension } = await prepareUploadBuffer(inputBuffer, mimeType);

    const fileExtension = extension || extensionFromName(file.name);
    const path = `${folder}/${randomUUID()}.${fileExtension}`;
    const downloadToken = randomUUID();
    const bucket = storage.bucket(bucketName);
    const fileRef = bucket.file(path);

    await fileRef.save(buffer, {
      metadata: {
        contentType,
        metadata: {
          firebaseStorageDownloadTokens: downloadToken,
        },
      },
    });

    const imageUrl = buildFirebaseDownloadUrl(bucketName, path, downloadToken);
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Admin upload failed:', error);
    const mapped = mapUploadError(error);
    return NextResponse.json({ error: mapped.error }, { status: mapped.status });
  }
}
