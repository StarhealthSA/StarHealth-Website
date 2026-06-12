import { NextResponse } from 'next/server';
import { authenticateRequest, READ_ROLES, WRITE_ROLES } from '@/lib/firebase/auth';
import { createAppointment, listAppointments } from '@/lib/content/appointments';

export async function GET(request) {
  try {
    await authenticateRequest(request, READ_ROLES);
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId') || undefined;
    const date = searchParams.get('date') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const appointments = await listAppointments({ doctorId, date, status, search });
    return NextResponse.json(appointments);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

export async function POST(request) {
  try {
    await authenticateRequest(request, WRITE_ROLES);
    const body = await request.json();
    const appointment = await createAppointment(body, {
      source: 'admin',
      read: true,
    });
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    const status = error.message.includes('not configured') ? 503 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
