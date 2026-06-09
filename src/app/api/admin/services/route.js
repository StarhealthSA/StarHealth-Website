import { NextResponse } from 'next/server';
import { authenticateRequest, WRITE_ROLES } from '@/lib/firebase/auth';
import { createService, getAllServices } from '@/lib/content/services';

export async function GET(request) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const services = await getAllServices();
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const body = await request.json();
    const service = await createService(body);
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    const status = error.message.includes('not configured') ? 503 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
