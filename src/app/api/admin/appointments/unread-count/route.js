import { NextResponse } from 'next/server';
import { authenticateRequest, READ_ROLES } from '@/lib/firebase/auth';
import { getUnreadAppointmentCount } from '@/lib/content/appointments';

export async function GET(request) {
  try {
    await authenticateRequest(request, READ_ROLES);
    const count = await getUnreadAppointmentCount();
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
