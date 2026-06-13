import { NextResponse } from 'next/server';
import { authenticateRequest, WRITE_ROLES } from '@/lib/firebase/auth';
import { getAdminStorage } from '@/lib/firebase/admin';
import { uploadToFirebaseStorage } from '@/lib/firebase/storage-upload';
import { prepareUploadBuffer } from '@/lib/images/prepare-upload-buffer';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function extensionFromName(filename) {
  const match = filename.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1].toLowerCase() : 'bin';
}

function mapUploadError(error) {
  const message = error?.message || 'Upload failed';
  const code = error?.code;

  if (code === 403 || message.includes('permission') || message.includes('Permission')) {
    return {
      status: 403,
      error:
        'Storage permission denied. In Google Cloud IAM, grant Storage Object Admin to your Firebase Admin service account.',
    };
  }

  if (
    code === 404
    || message.includes('bucket')
    || message.includes('not configured')
    || message.includes('does not exist')
  ) {
    return {
      status: 503,
      error: `Storage bucket error: ${message}. Verify NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET matches Firebase Console.`,
    };
  }

  if (message.includes('uniform bucket-level access')) {
    return {
      status: 503,
      error: 'Storage bucket ACL settings blocked the upload. Redeploy the latest upload fix.',
    };
  }

  if (message.includes('Input') || message.includes('unsupported')) {
    return { status: 400, error: 'Invalid image file' };
  }

  if (
    message.includes('token')
    || message.includes('auth')
    || message.includes('authorization')
    || message.includes('JWT')
    || message.includes('private key')
  ) {
    return {
      status: 401,
      error: 'Firebase Admin credentials invalid. Check FIREBASE_ADMIN_PRIVATE_KEY formatting on Vercel.',
    };
  }

  return { status: 500, error: message };
}

export async function POST(request) {
  try {
    await authenticateRequest(request, WRITE_ROLES);

    const storage = getAdminStorage();
    if (!storage) {
      return NextResponse.json(
        { error: 'Firebase Admin is not configured on the server.' },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const folder = String(formData.get('folder') || 'uploads').replace(/^\/+|\/+$/g, '');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    if (!inputBuffer.length) {
      return NextResponse.json({ error: 'Empty file' }, { status: 400 });
    }

    const mimeType = file.type || 'application/octet-stream';
    const { buffer, contentType, extension } = await prepareUploadBuffer(inputBuffer, mimeType);
    const fileExtension = extension || extensionFromName(file.name) || 'bin';

    const { imageUrl } = await uploadToFirebaseStorage(storage, {
      buffer,
      contentType,
      folder,
      extension: fileExtension,
    });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Admin upload failed:', error);
    const mapped = mapUploadError(error);
    return NextResponse.json({ error: mapped.error, code: error?.code || null }, { status: mapped.status });
  }
}
