'use client';

import BookingsTab from '@/components/admin/appointments/bookings-tab';

export default function AdminAppointmentsPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#002f3b]">Bookings</h1>
      <div className="mt-6">
        <BookingsTab />
      </div>
    </div>
  );
}
