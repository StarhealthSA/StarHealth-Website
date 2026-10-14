'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';
import { AdminActionButton, AdminActionGroup, AdminActionLink } from '@/components/admin/admin-action-button';
import OfferBookingConfirmForm from '@/components/admin/appointments/offer-booking-confirm-form';
import { formatDateLabel } from '@/lib/appointments/slot-utils';
import {
  isOfferBookingConfirmed,
  isOfferBookingPending,
} from '@/lib/appointments/offer-booking-status';
import { doctorAvailabilityAdminPath } from '@/lib/content/doctor-defaults';
import notify from '@/lib/ui/notify';

function statusLabel(appointment) {
  if (appointment.status === 'cancelled') return 'Cancelled';
  if (isOfferBookingPending(appointment)) return 'Pending';
  if (isOfferBookingConfirmed(appointment)) return 'Booking confirmed';
  return 'Booked';
}

export default function AdminAppointmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getIdToken, canWrite } = useAdminAuth();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getIdToken();
      const data = await adminFetch(`/api/admin/appointments/${id}`, { token });
      setAppointment(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getIdToken, id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCancel = async () => {
    const isOffer = appointment?.type === 'offer_callback';
    const confirmed = await notify.confirm({
      title: isOffer ? 'Cancel offer booking?' : 'Cancel appointment?',
      text: isOffer
        ? 'This offer booking will be marked as cancelled.'
        : 'This will free the time slot for other patients.',
      confirmText: isOffer ? 'Cancel request' : 'Cancel appointment',
      danger: true,
    });
    if (!confirmed) return;
    try {
      const token = await getIdToken();
      await adminFetch(`/api/admin/appointments/${id}`, {
        method: 'PATCH',
        token,
        body: { action: 'cancel' },
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    const isBooked = appointment?.status === 'booked' || appointment?.status === 'pending';
    const confirmed = await notify.confirm({
      title: isBooked ? 'Delete booking?' : 'Delete cancelled booking?',
      text: isBooked
        ? 'This booking will be removed permanently.'
        : 'This action cannot be undone.',
      confirmText: 'Delete',
      danger: true,
    });
    if (!confirmed) return;
    try {
      const token = await getIdToken();
      await adminFetch(`/api/admin/appointments/${id}`, { method: 'DELETE', token });
      router.push('/admin/appointments');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <AdminPageLoader
        label="Loading booking..."
        description="Fetching appointment details from the database."
      />
    );
  }

  if (error && !appointment) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!appointment) {
    return <p className="text-[#586971]">Appointment not found.</p>;
  }

  const isOffer = appointment.type === 'offer_callback';
  const isPendingOffer = isOfferBookingPending(appointment);
  const isConfirmedOffer = isOfferBookingConfirmed(appointment);
  const canCancel = appointment.status === 'booked' || appointment.status === 'pending';

  return (
    <div>
      <Link href="/admin/appointments" className="text-sm text-[#037B76] hover:underline">
        ← Back to bookings
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#002f3b]">
            {isOffer ? 'Offer booking details' : 'Appointment details'}
          </h1>
          <p className="mt-1 text-sm text-[#586971]">
            {isPendingOffer
              ? 'Pending offer request. Assign a doctor to confirm the booking.'
              : isConfirmedOffer
                ? 'Offer booking confirmed and available in Active bookings.'
                : appointment.status === 'booked' && !appointment.read
                  ? 'Marked as seen. Booking stays active until cancelled.'
                  : 'Booking information'}
          </p>
        </div>
        {canWrite && (
          <AdminActionGroup>
            {canCancel && (
              <>
                {!isOffer && (
                  <AdminActionLink action="edit" href={`/admin/appointments/${id}/edit`} />
                )}
                {isConfirmedOffer && (
                  <AdminActionLink action="edit" href={`/admin/appointments/${id}/edit`} />
                )}
                <AdminActionButton action="cancel" onClick={handleCancel} />
              </>
            )}
            <AdminActionButton action="delete" onClick={handleDelete} />
          </AdminActionGroup>
        )}
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {[
          ['Patient', appointment.patientName],
          ['Phone', appointment.phone],
          ['Age', appointment.age],
          isOffer
            ? ['Offer', appointment.offerName || appointment.speciality]
            : ['Speciality', appointment.speciality],
          ['Doctor', appointment.doctorName || (isPendingOffer ? 'Not assigned' : '—')],
          [
            'Date',
            appointment.date
              ? formatDateLabel(appointment.date)
              : (isPendingOffer ? 'Pending confirmation' : 'To be confirmed'),
          ],
          [
            'Time slot',
            appointment.slotLabel
              || (isPendingOffer ? 'Pending confirmation' : 'To be confirmed'),
          ],
          ['Status', statusLabel(appointment)],
          ['Source', appointment.source || 'website'],
          ['Seen', appointment.read ? 'Yes' : 'No'],
          ['Created', appointment.createdAt ? new Date(appointment.createdAt).toLocaleString() : '—'],
          ['Updated', appointment.updatedAt ? new Date(appointment.updatedAt).toLocaleString() : '—'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-[#d7e6e2] bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[#586971]">{label}</p>
            <p className="mt-1 text-sm text-[#002f3b]">{value || '—'}</p>
          </div>
        ))}
      </div>

      {isPendingOffer && canWrite && (
        <OfferBookingConfirmForm
          appointment={appointment}
          onConfirmed={(confirmed) => {
            setAppointment(confirmed);
            notify.success('Offer booking confirmed and moved to Active bookings.');
          }}
        />
      )}

      {(appointment.unscheduled || !appointment.date)
        && appointment.doctorId
        && !isPendingOffer
        && canWrite && (
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-[#586971]">
          <p>Date and time are not set yet. Enable bookable dates and duty hours for this doctor, then edit this booking.</p>
          <Link
            href={doctorAvailabilityAdminPath(appointment.doctorId)}
            className="mt-2 inline-block font-medium text-[#037B76] hover:underline"
          >
            Set availability &amp; duty times →
          </Link>
        </div>
      )}

      {isConfirmedOffer && (
        <p className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          Booking confirmed. This appointment also appears under Active bookings.
        </p>
      )}

      {appointment.status === 'cancelled' && (
        <p className="mt-6 rounded-lg border border-[#d7e6e2] bg-[#f8fbfa] px-4 py-3 text-sm text-[#586971]">
          {isOffer
            ? 'This offer booking was cancelled.'
            : 'This slot is available for booking again.'}
        </p>
      )}
    </div>
  );
}
