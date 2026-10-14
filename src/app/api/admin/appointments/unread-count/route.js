import { NextResponse } from 'next/server';
import { authenticateRequest, READ_ROLES } from '@/lib/firebase/auth';
import { getUnreadAppointmentCounts } from '@/lib/content/appointments';
import { getUnreadEnquiryCount } from '@/lib/content/enquiries';

export async function GET(request) {
  try {
    await authenticateRequest(request, READ_ROLES);
    const [appointmentCounts, enquiries] = await Promise.all([
      getUnreadAppointmentCounts(),
      getUnreadEnquiryCount(),
    ]);
    return NextResponse.json({
      count: appointmentCounts.total + enquiries,
      appointments: appointmentCounts.total,
      doctorAppointments: appointmentCounts.appointments,
      offerBookings: appointmentCounts.offerBookings,
      enquiries,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
