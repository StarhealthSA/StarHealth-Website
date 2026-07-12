'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';
import AdminPagination, { usePagination } from '@/components/admin/admin-pagination';
import { AdminActionButton, AdminActionGroup, AdminActionLink } from '@/components/admin/admin-action-button';
import { formatDateLabel } from '@/lib/appointments/slot-utils';
import notify from '@/lib/ui/notify';

function StatusBadge({ status, read }) {
  if (status === 'cancelled') {
    return <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">Cancelled</span>;
  }
  if (!read) {
    return <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">New</span>;
  }
  return <span className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-700">Booked</span>;
}

export default function BookingsTab() {
  const { getIdToken, canWrite } = useAdminAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('booked');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getIdToken();
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());
      const query = params.toString() ? `?${params.toString()}` : '';
      const data = await adminFetch(`/api/admin/appointments${query}`, { token });
      setAppointments(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getIdToken, statusFilter, search]);

  const {
    page,
    setPage,
    totalPages,
    paginatedItems,
    totalItems,
    pageSize,
  } = usePagination(appointments, undefined, `${statusFilter}|${search}`);

  useEffect(() => {
    load();
  }, [load]);

  const handleCancel = async (id) => {
    const confirmed = await notify.confirm({
      title: 'Cancel appointment?',
      text: 'This will free the time slot for other patients.',
      confirmText: 'Cancel appointment',
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

  const handleDelete = async (id, status) => {
    const isBooked = status === 'booked';
    const confirmed = await notify.confirm({
      title: isBooked ? 'Delete booking?' : 'Delete cancelled booking?',
      text: isBooked
        ? 'The time slot will be freed permanently.'
        : 'This action cannot be undone.',
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
          View website and admin appointments. New bookings stay booked until cancelled.
        </p>
        {canWrite && (
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
          <span className="text-sm font-medium text-[#586971]">Search by name or phone</span>
          <div className="mt-1 flex gap-2">
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setSearch(searchInput);
              }}
              placeholder="Patient name or phone number"
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
        {[
          { value: 'booked', label: 'Active' },
          { value: 'cancelled', label: 'Cancelled' },
          { value: '', label: 'All' },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setStatusFilter(item.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              statusFilter === item.value
                ? 'bg-[#037B76] text-white'
                : 'border border-[#d7e6e2] bg-white text-[#586971]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[#d7e6e2] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#d7e6e2] bg-[#f8fbfa]">
            <tr>
              <th className="px-4 py-3 font-medium text-[#586971]">Patient</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Doctor</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Date & time</th>
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
                    label="Loading bookings..."
                    description="Fetching appointments from the database."
                  />
                </td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-6 text-[#586971]">No appointments found.</td></tr>
            ) : paginatedItems.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-[#eef4f2] ${!item.read && item.status === 'booked' ? 'bg-amber-50/40' : ''}`}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-[#002f3b]">{item.patientName || '—'}</p>
                  <p className="text-xs text-[#586971]">{item.phone || '—'}</p>
                </td>
                <td className="px-4 py-3 text-[#586971]">{item.doctorName || item.doctorId}</td>
                <td className="px-4 py-3 text-[#586971]">
                  <p>{item.date ? formatDateLabel(item.date) : 'To be confirmed'}</p>
                  <p className="text-xs">{item.slotLabel || 'To be confirmed'}</p>
                </td>
                <td className="px-4 py-3 capitalize text-[#586971]">{item.source || 'website'}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={item.status} read={item.read} />
                </td>
                <td className="px-4 py-3">
                  <AdminActionGroup>
                    <AdminActionLink action="view" href={`/admin/appointments/${item.id}`} />
                    {canWrite && item.status === 'booked' && (
                      <AdminActionLink action="edit" href={`/admin/appointments/${item.id}/edit`} />
                    )}
                    {canWrite && item.status === 'booked' && (
                      <AdminActionButton action="cancel" onClick={() => handleCancel(item.id)} />
                    )}
                    {canWrite && (
                      <AdminActionButton action="delete" onClick={() => handleDelete(item.id, item.status)} />
                    )}
                  </AdminActionGroup>
                </td>
              </tr>
            ))}
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
