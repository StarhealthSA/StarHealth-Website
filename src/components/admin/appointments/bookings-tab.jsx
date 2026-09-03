'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';
import AdminPagination, { usePagination } from '@/components/admin/admin-pagination';
import { AdminActionButton, AdminActionGroup, AdminActionLink } from '@/components/admin/admin-action-button';
import { formatDateLabel } from '@/lib/appointments/slot-utils';
import {
  isOfferBookingConfirmed,
  isOfferBookingPending,
} from '@/lib/appointments/offer-booking-status';
import notify from '@/lib/ui/notify';

function StatusBadge({ item }) {
  if (item.status === 'cancelled') {
    return <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">Cancelled</span>;
  }
  if (isOfferBookingPending(item)) {
    return <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">Pending</span>;
  }
  if (isOfferBookingConfirmed(item)) {
    return <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">Booking confirmed</span>;
  }
  if (!item.read) {
    return <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">New</span>;
  }
  return <span className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-700">Booked</span>;
}

const VIEW_FILTERS = [
  { value: 'booked', label: 'Active', type: 'appointment', status: 'booked' },
  { value: 'cancelled', label: 'Cancelled', type: 'appointment', status: 'cancelled' },
  { value: 'all', label: 'All', type: 'appointment', status: '' },
  { value: 'offers', label: 'Offer Bookings', type: 'offer_callback', status: '' },
];

export default function BookingsTab() {
  const router = useRouter();
  const { getIdToken, canWrite } = useAdminAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewFilter, setViewFilter] = useState('booked');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [unreadOfferBookings, setUnreadOfferBookings] = useState(0);

  const activeView = VIEW_FILTERS.find((item) => item.value === viewFilter) || VIEW_FILTERS[0];
  const isOfferView = activeView.type === 'offer_callback';

  const loadUnreadOfferCount = useCallback(async () => {
    try {
      const token = await getIdToken();
      const data = await adminFetch('/api/admin/appointments/unread-count', { token });
      setUnreadOfferBookings(data.offerBookings || 0);
    } catch {
      setUnreadOfferBookings(0);
    }
  }, [getIdToken]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getIdToken();
      const params = new URLSearchParams();
      if (activeView.status) params.set('status', activeView.status);
      if (activeView.type) params.set('type', activeView.type);
      if (search.trim()) params.set('search', search.trim());
      const query = params.toString() ? `?${params.toString()}` : '';
      const data = await adminFetch(`/api/admin/appointments${query}`, { token });
      setAppointments(data);
      setError('');
      await loadUnreadOfferCount();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getIdToken, activeView.status, activeView.type, search, loadUnreadOfferCount]);

  const {
    page,
    setPage,
    totalPages,
    paginatedItems,
    totalItems,
    pageSize,
  } = usePagination(appointments, undefined, `${viewFilter}|${search}`);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const interval = setInterval(loadUnreadOfferCount, 30000);
    return () => clearInterval(interval);
  }, [loadUnreadOfferCount]);

  const handleCancel = async (id, isOffer) => {
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

  const handleDelete = async (id, status, isOffer) => {
    const isActive = status === 'booked' || status === 'pending';
    const confirmed = await notify.confirm({
      title: isOffer
        ? (isActive ? 'Delete offer booking?' : 'Delete cancelled offer booking?')
        : (isActive ? 'Delete booking?' : 'Delete cancelled booking?'),
      text: isOffer
        ? 'This action cannot be undone.'
        : (isActive
          ? 'The time slot will be freed permanently.'
          : 'This action cannot be undone.'),
      confirmText: 'Delete',
      danger: true,
    });
    if (!confirmed) return;
    try {
      const token = await getIdToken();
      await adminFetch(`/api/admin/appointments/${id}`, { method: 'DELETE', token });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-[#586971]">
          {isOfferView
            ? 'Offer page requests. Assign a doctor to confirm; confirmed bookings also appear under Active.'
            : 'View website and admin appointments. New bookings stay booked until cancelled.'}
        </p>
        {canWrite && !isOfferView && (
          <Link
            href="/admin/appointments/new"
            className="rounded-lg bg-[#037B76] px-4 py-2 text-sm font-medium text-white"
          >
            New appointment
          </Link>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <label className="min-w-[16rem] flex-1">
          <span className="text-sm font-medium text-[#586971]">
            {isOfferView ? 'Search by name, phone, or offer' : 'Search by name or phone'}
          </span>
          <div className="mt-1 flex gap-2">
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setSearch(searchInput);
              }}
              placeholder={isOfferView ? 'Patient, phone, or offer name' : 'Patient name or phone number'}
              className="w-full rounded-lg border border-[#d7e6e2] px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => setSearch(searchInput)}
              className="rounded-lg bg-[#037B76] px-4 py-2 text-sm font-medium text-white"
            >
              Search
            </button>
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSearchInput('');
                }}
                className="rounded-lg border border-[#d7e6e2] px-4 py-2 text-sm font-medium text-[#586971]"
              >
                Clear
              </button>
            )}
          </div>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {VIEW_FILTERS.map((item) => {
          const isActive = viewFilter === item.value;
          const showOfferBadge = item.value === 'offers' && unreadOfferBookings > 0;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setViewFilter(item.value)}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${
                isActive
                  ? 'bg-[#037B76] text-white'
                  : 'border border-[#d7e6e2] bg-white text-[#586971]'
              }`}
            >
              <span>{item.label}</span>
              {showOfferBadge ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    isActive ? 'bg-white text-[#037B76]' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {unreadOfferBookings}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[#d7e6e2] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#d7e6e2] bg-[#f8fbfa]">
            <tr>
              <th className="px-4 py-3 font-medium text-[#586971]">Patient</th>
              <th className="px-4 py-3 font-medium text-[#586971]">
                {isOfferView ? 'Offer' : 'Doctor'}
              </th>
              <th className="px-4 py-3 font-medium text-[#586971]">
                {isOfferView ? 'Doctor / Schedule' : 'Date & time'}
              </th>
              <th className="px-4 py-3 font-medium text-[#586971]">Source</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Status</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>
                  <AdminPageLoader
                    variant="table"
                    label={isOfferView ? 'Loading offer bookings...' : 'Loading bookings...'}
                    description="Fetching appointments from the database."
                  />
                </td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-[#586971]">
                  {isOfferView ? 'No offer bookings found.' : 'No appointments found.'}
                </td>
              </tr>
            ) : paginatedItems.map((item) => {
              const isOffer = item.type === 'offer_callback';
              const isPending = isOfferBookingPending(item);
              const isConfirmed = isOfferBookingConfirmed(item);
              const canCancel = item.status === 'booked' || item.status === 'pending';
              const highlightUnread = !item.read && (isPending || item.status === 'booked');

              return (
                <tr
                  key={item.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => router.push(`/admin/appointments/${item.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      router.push(`/admin/appointments/${item.id}`);
                    }
                  }}
                  className={`cursor-pointer border-b border-[#eef4f2] transition-colors hover:bg-[#f8fbfa] ${
                    highlightUnread ? 'bg-amber-50/40' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#002f3b]">{item.patientName || '—'}</p>
                    <p className="text-xs text-[#586971]">{item.phone || '—'}</p>
                    {isOffer && item.age ? (
                      <p className="text-xs text-[#8a9aa1]">Age: {item.age}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-[#586971]">
                    {isOfferView
                      ? (item.offerName || item.speciality || 'Offer callback')
                      : (item.doctorName || item.doctorId || '—')}
                    {!isOfferView && isOffer && item.offerName ? (
                      <p className="text-xs text-[#8a9aa1]">Offer: {item.offerName}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-[#586971]">
                    {isOfferView ? (
                      isConfirmed ? (
                        <>
                          <p>{item.doctorName || 'Doctor assigned'}</p>
                          <p className="text-xs">
                            {item.date ? formatDateLabel(item.date) : 'To be confirmed'}
                            {item.slotLabel ? ` · ${item.slotLabel}` : ''}
                          </p>
                        </>
                      ) : (
                        <>
                          <p>Awaiting assignment</p>
                          <p className="text-xs">Team will confirm</p>
                        </>
                      )
                    ) : (
                      <>
                        <p>{item.date ? formatDateLabel(item.date) : 'To be confirmed'}</p>
                        <p className="text-xs">{item.slotLabel || 'To be confirmed'}</p>
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3 capitalize text-[#586971]">{item.source || 'website'}</td>
                  <td className="px-4 py-3">
                    <StatusBadge item={item} />
                  </td>
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    <AdminActionGroup>
                      <AdminActionLink action="view" href={`/admin/appointments/${item.id}`} />
                      {canWrite && (item.status === 'booked' && (!isOffer || isConfirmed)) && (
                        <AdminActionLink action="edit" href={`/admin/appointments/${item.id}/edit`} />
                      )}
                      {canWrite && canCancel && (
                        <AdminActionButton
                          action="cancel"
                          onClick={() => handleCancel(item.id, isOffer)}
                        />
                      )}
                      {canWrite && (
                        <AdminActionButton
                          action="delete"
                          onClick={() => handleDelete(item.id, item.status, isOffer)}
                        />
                      )}
                    </AdminActionGroup>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!loading && totalItems > 0 && (
          <AdminPagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        )}
      </div>
    </>
  );
}
