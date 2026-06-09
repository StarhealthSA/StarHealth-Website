'use client';

import { useCallback, useEffect, useState } from 'react';
import ServiceForm from '@/components/admin/service-form';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';

export default function AdminServicesPage() {
  const { getIdToken, canWrite, isAdmin } = useAdminAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getIdToken();
      const data = await adminFetch('/api/admin/services', { token });
      setServices(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleSave = async (service) => {
    try {
      setSaving(true);
      const token = await getIdToken();
      if (editing) {
        await adminFetch(`/api/admin/services/${editing.id}`, {
          method: 'PUT',
          body: service,
          token,
        });
      } else {
        await adminFetch('/api/admin/services', {
          method: 'POST',
          body: service,
          token,
        });
      }
      setShowForm(false);
      setEditing(null);
      await loadServices();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      const token = await getIdToken();
      await adminFetch(`/api/admin/services/${id}`, { method: 'DELETE', token });
      await loadServices();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#002f3b]">Services</h1>
          <p className="mt-1 text-sm text-[#586971]">Manage services shown on the website.</p>
        </div>
        {canWrite && (
          <button
            type="button"
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="rounded-lg bg-[#037B76] px-4 py-2 text-sm font-medium text-white"
          >
            Add Service
          </button>
        )}
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {showForm && canWrite && (
        <div className="mt-6">
          <ServiceForm
            initial={editing}
            saving={saving}
            onSubmit={handleSave}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      )}

      <div className="mt-8 overflow-x-auto rounded-2xl border border-[#d7e6e2] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#d7e6e2] bg-[#f8fbfa]">
            <tr>
              <th className="px-4 py-3 font-medium text-[#586971]">Title</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Order</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Status</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-6 text-[#586971]">Loading...</td></tr>
            ) : services.map((service) => (
              <tr key={service.id} className="border-b border-[#eef4f2]">
                <td className="px-4 py-3">
                  <p className="font-medium text-[#002f3b]">{service.title?.en}</p>
                  <p className="text-xs text-[#586971] line-clamp-1">{service.description?.en}</p>
                </td>
                <td className="px-4 py-3 text-[#586971]">{service.order}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${service.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {service.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {canWrite && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => { setEditing(service); setShowForm(true); }}
                        className="text-[#037B76] hover:underline"
                      >
                        Edit
                      </button>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDelete(service.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
