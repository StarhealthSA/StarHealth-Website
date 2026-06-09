import { NextResponse } from 'next/server';
import { authenticateRequest, WRITE_ROLES } from '@/lib/firebase/auth';
import { createDoctor, getAllDoctors } from '@/lib/content/doctors';

export async function GET(request) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const doctors = await getAllDoctors();
    return NextResponse.json(doctors);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const body = await request.json();
    const doctor = await createDoctor(body);
    return NextResponse.json(doctor, { status: 201 });
  } catch (error) {
    const status = error.message.includes('not configured') ? 503 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
