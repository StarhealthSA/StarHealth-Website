import { NextResponse } from 'next/server';
import { authenticateRequest, READ_ROLES } from '@/lib/firebase/auth';
import { getUnreadAppointmentCount } from '@/lib/content/appointments';
import { getUnreadEnquiryCount } from '@/lib/content/enquiries';

export async function GET(request) {
  try {
    await authenticateRequest(request, READ_ROLES);
    const [appointments, enquiries] = await Promise.all([
      getUnreadAppointmentCount(),
      getUnreadEnquiryCount(),
    ]);
    return NextResponse.json({
      count: appointments + enquiries,
      appointments,
      enquiries,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
