import { NextResponse } from 'next/server';
import { authenticateRequest, WRITE_ROLES } from '@/lib/firebase/auth';
import { createSpecialization, getAllSpecializations } from '@/lib/content/specializations';

export async function GET(request) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const specializations = await getAllSpecializations();
    return NextResponse.json(specializations);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const body = await request.json();
    const specialization = await createSpecialization(body);
    return NextResponse.json(specialization, { status: 201 });
  } catch (error) {
    const status = error.message.includes('not configured') ? 503 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
