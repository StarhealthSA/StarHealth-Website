import { NextResponse } from 'next/server';
import { authenticateRequest, WRITE_ROLES } from '@/lib/firebase/auth';
import { getAdminStorage } from '@/lib/firebase/admin';
import { randomUUID } from 'crypto';

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

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${folder}/${randomUUID()}-${safeName}`;
    const bucket = storage.bucket();
    const fileRef = bucket.file(path);

    await fileRef.save(buffer, {
      metadata: { contentType: file.type || 'application/octet-stream' },
      public: true,
    });

    const imageUrl = `https://storage.googleapis.com/${bucket.name}/${path}`;
    return NextResponse.json({ imageUrl });
  } catch (error) {
    const status = error.message.includes('permissions') ? 403 : 401;
    return NextResponse.json({ error: error.message }, { status });
  }
}
