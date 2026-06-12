import { NextResponse } from 'next/server';
import { createAppointment } from '@/lib/content/appointments';

export async function POST(request) {
  try {
    const body = await request.json();
    const appointment = await createAppointment(body, {
      source: 'website',
      read: false,
    });
    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    const status = error.message.includes('not available') ? 503 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
