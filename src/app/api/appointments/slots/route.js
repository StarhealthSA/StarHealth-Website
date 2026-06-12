import { NextResponse } from 'next/server';
import { getAvailableSlotsForDoctor } from '@/lib/content/appointments';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');

    if (!doctorId || !date) {
      return NextResponse.json({ error: 'doctorId and date are required' }, { status: 400 });
    }

    const excludeAppointmentId = searchParams.get('excludeAppointmentId') || null;
    const result = await getAvailableSlotsForDoctor(
      doctorId,
      date,
      excludeAppointmentId
    );
    return NextResponse.json(result);
  } catch (error) {
    const status = error.message === 'Doctor not found' ? 404 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
