'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';
import { AdminActionButton, AdminActionGroup, AdminActionLink } from '@/components/admin/admin-action-button';
import notify from '@/lib/ui/notify';

function EnquiryStatusBadge({ read }) {
  if (!read) {
    return <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">New</span>;
  }
  return <span className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-700">Read</span>;
}

function formatSubmittedAt(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

export default function ContactEnquiriesTab() {
  const { getIdToken, canWrite } = useAdminAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getIdToken();
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      const query = params.toString() ? `?${params.toString()}` : '';
      const data = await adminFetch(`/api/admin/enquiries${query}`, { token });
      setEnquiries(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getIdToken, search]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id) => {
    const confirmed = await notify.confirm({
      title: 'Delete submission?',
      text: 'This contact form submission will be permanently removed.',
      confirmText: 'Delete',
      danger: true,
    });
    if (!confirmed) return;
    try {
      const token = await getIdToken();
      await adminFetch(`/api/admin/enquiries/${id}`, { method: 'DELETE', token });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <p className="text-sm text-[#586971]">
        Contact page enquiries from the website. New submissions are highlighted until opened.
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <label className="min-w-[16rem] flex-1">
          <span className="text-sm font-medium text-[#586971]">Search by name, email, or phone</span>
          <div className="mt-1 flex gap-2">
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setSearch(searchInput);
              }}
              placeholder="Name, email, or phone number"
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

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-[#d7e6e2] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#d7e6e2] bg-[#f8fbfa]">
            <tr>
              <th className="px-4 py-3 font-medium text-[#586971]">Name</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Contact</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Speciality</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Country</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Submitted</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Status</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7}>
                  <AdminPageLoader
                    variant="table"
                    label="Loading contact submissions..."
                    description="Fetching enquiries from the database."
                  />
                </td>
              </tr>
            ) : enquiries.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-6 text-[#586971]">No contact form submissions found.</td></tr>
            ) : enquiries.map((item) => (
              <tr
                key={item.id}
                className={`border-b border-[#eef4f2] ${!item.read ? 'bg-amber-50/40' : ''}`}
              >
                <td className="px-4 py-3 font-medium text-[#002f3b]">{item.name || '—'}</td>
                <td className="px-4 py-3 text-[#586971]">
                  <p>{item.email || '—'}</p>
                  <p className="text-xs">{item.phone || '—'}</p>
                </td>
                <td className="px-4 py-3 text-[#586971]">{item.speciality || '—'}</td>
                <td className="px-4 py-3 text-[#586971]">{item.country || '—'}</td>
                <td className="px-4 py-3 text-[#586971]">{formatSubmittedAt(item.createdAt)}</td>
                <td className="px-4 py-3">
                  <EnquiryStatusBadge read={item.read} />
                </td>
                <td className="px-4 py-3">
                  <AdminActionGroup>
                    <AdminActionLink action="view" href={`/admin/appointments/contact/${item.id}`} />
                    {canWrite && (
                      <AdminActionButton action="delete" onClick={() => handleDelete(item.id)} />
                    )}
                  </AdminActionGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
