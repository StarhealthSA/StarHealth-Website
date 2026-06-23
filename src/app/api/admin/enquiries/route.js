import { NextResponse } from 'next/server';
import { authenticateRequest, READ_ROLES } from '@/lib/firebase/auth';
import { listEnquiries } from '@/lib/content/enquiries';

export async function GET(request) {
  try {
    await authenticateRequest(request, READ_ROLES);
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const enquiries = await listEnquiries({ search });
    return NextResponse.json(enquiries);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
