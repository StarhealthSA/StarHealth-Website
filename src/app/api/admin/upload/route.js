import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { authenticateRequest, WRITE_ROLES } from '@/lib/firebase/auth';
import { getAdminStorage } from '@/lib/firebase/admin';
import { prepareUploadBuffer } from '@/lib/images/prepare-upload-buffer';

function extensionFromName(filename) {
  const match = filename.match(/\.([a-zA-Z0-9]+)$/);
  return match ? match[1].toLowerCase() : 'bin';
}

export async function POST(request) {
  try {
    await authenticateRequest(request, WRITE_ROLES);

    const storage = getAdminStorage();
    if (!storage) {
      return NextResponse.json({ error: 'Firebase Storage is not configured' }, { status: 503 });
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
    const bucket = storage.bucket();
    const fileRef = bucket.file(path);

    await fileRef.save(buffer, {
      metadata: { contentType },
      public: true,
    });

    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${path}`;
    return NextResponse.json({ imageUrl });
  } catch (error) {
    if (error.message?.includes('permissions')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error.message?.includes('not configured') || error.message?.includes('Storage')) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    if (error.message?.includes('Input') || error.message?.includes('unsupported')) {
      return NextResponse.json({ error: 'Invalid image file' }, { status: 400 });
    }
    const status = error.message?.includes('token') || error.message?.includes('auth')
      ? 401
      : 500;
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status });
  }
}
