'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';
import { AdminActionButton } from '@/components/admin/admin-action-button';

export default function AdminContactEnquiryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getIdToken, canWrite } = useAdminAuth();
  const [enquiry, setEnquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getIdToken();
      const data = await adminFetch(`/api/admin/enquiries/${id}`, { token });
      setEnquiry(data);
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

  const handleDelete = async () => {
    if (!window.confirm('Permanently delete this contact form submission?')) return;
    try {
      const token = await getIdToken();
      await adminFetch(`/api/admin/enquiries/${id}`, { method: 'DELETE', token });
      router.push('/admin/appointments?tab=contact');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <AdminPageLoader
        label="Loading submission..."
        description="Fetching contact form details from the database."
      />
    );
  }

  if (error && !enquiry) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!enquiry) {
    return <p className="text-[#586971]">Submission not found.</p>;
  }

  return (
    <div>
      <Link href="/admin/appointments?tab=contact" className="text-sm text-[#037B76] hover:underline">
        ← Back to Contact us form
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#002f3b]">{enquiry.name}</h1>
          <p className="mt-1 text-sm text-[#586971]">
            Submitted {enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleString() : '—'}
          </p>
        </div>
        {canWrite && (
          <AdminActionButton action="delete" onClick={handleDelete} />
        )}
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mt-8 rounded-2xl border border-[#d7e6e2] bg-white p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          {[
            ['Full name', enquiry.name],
            ['Email', enquiry.email],
            ['Phone', enquiry.phone],
            ['Country', enquiry.country || '—'],
            ['Speciality', enquiry.speciality || '—'],
            ['Address', enquiry.address || '—'],
            ['Source', enquiry.source || 'website'],
            ['Status', enquiry.read ? 'Read' : 'New'],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm font-medium text-[#586971]">{label}</dt>
              <dd className="mt-1 text-[#002f3b]">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 border-t border-[#eef4f2] pt-6">
          <h2 className="text-sm font-medium text-[#586971]">Message</h2>
          <p className="mt-2 whitespace-pre-wrap text-[#002f3b]">{enquiry.message || '—'}</p>
        </div>
      </div>
    </div>
  );
}
