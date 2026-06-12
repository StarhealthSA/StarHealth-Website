import { NextResponse } from 'next/server';
import { authenticateRequest, READ_ROLES } from '@/lib/firebase/auth';
import { getDoctorAvailableDates } from '@/lib/content/appointments';

export async function GET(request) {
  try {
    await authenticateRequest(request, READ_ROLES);
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');

    if (!doctorId) {
      return NextResponse.json({ error: 'doctorId is required' }, { status: 400 });
    }

    const result = await getDoctorAvailableDates(doctorId);
    return NextResponse.json(result);
  } catch (error) {
    const status = error.message === 'Doctor not found' ? 404 : 400;
    return NextResponse.json({ error: error.message }, { status });
  }
}
