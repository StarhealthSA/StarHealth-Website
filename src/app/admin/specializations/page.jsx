'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import SpecializationForm from '@/components/admin/specialization-form';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';
import { AdminActionButton, AdminActionGroup } from '@/components/admin/admin-action-button';
import notify from '@/lib/ui/notify';
import {
  getSpecializationsByParentService,
  getTopLevelSpecializations,
} from '@/lib/content/specialization-utils';

export default function AdminSpecializationsPage() {
  const { getIdToken, canWrite, canDeleteContent } = useAdminAuth();
  const [specializations, setSpecializations] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getIdToken();
      const [specs, svcs] = await Promise.all([
        adminFetch('/api/admin/specializations', { token }),
        adminFetch('/api/admin/services', { token }),
      ]);
      setSpecializations(specs);
      setServices(svcs || []);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (spec) => {
    try {
      setSaving(true);
      const token = await getIdToken();
      if (editing) {
        await adminFetch(`/api/admin/specializations/${editing.id}`, {
          method: 'PUT',
          body: spec,
          token,
        });
      } else {
        await adminFetch('/api/admin/specializations', {
          method: 'POST',
          body: spec,
          token,
        });
      }
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await notify.confirm({
      title: 'Delete specialization?',
      text: 'This specialization will be removed from the website.',
      confirmText: 'Delete',
      danger: true,
    });
    if (!confirmed) return;
    try {
      const token = await getIdToken();
      await adminFetch(`/api/admin/specializations/${id}`, { method: 'DELETE', token });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const unassigned = useMemo(
    () => getTopLevelSpecializations(specializations).filter((spec) => !spec.parentServiceId),
    [specializations]
  );

  const groupedByService = useMemo(
    () =>
      services.map((service) => ({
        service,
        specializations: getSpecializationsByParentService(specializations, service.id),
      })),
    [services, specializations]
  );

  const renderSpecRow = (spec, nested = false) => (
    <div
      key={spec.id}
      className={`flex items-center justify-between ${nested ? 'mt-3 ml-6 border-l-2 border-[#d7e6e2] pl-4' : ''}`}
    >
      <div>
        <p className={`${nested ? 'text-sm' : ''} font-medium text-[#002f3b]`}>{spec.name?.en}</p>
        <p className={`${nested ? 'text-xs' : 'text-sm'} text-[#586971]`} dir="rtl">{spec.name?.ar}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`rounded-full px-2 py-1 text-xs ${spec.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
          {spec.active ? 'Active' : 'Inactive'}
        </span>
        {canWrite && (
          <AdminActionGroup>
            <AdminActionButton
              action="edit"
              onClick={() => { setEditing(spec); setShowForm(true); }}
            />
            {canDeleteContent && (
              <AdminActionButton action="delete" onClick={() => handleDelete(spec.id)} />
            )}
          </AdminActionGroup>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#002f3b]">Specializations</h1>
          <p className="mt-1 text-sm text-[#586971]">
            Manage specialization landing pages linked to parent services.
          </p>
        </div>
        {canWrite && (
          <button
            type="button"
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="rounded-lg bg-[#037B76] px-4 py-2 text-sm font-medium text-white"
          >
            Add Specialization
          </button>
        )}
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {showForm && canWrite && (
        <div className="mt-6">
          <SpecializationForm
            initial={editing}
            services={services}
            saving={saving}
            onSubmit={handleSave}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </div>
      )}

      <div className="mt-8 space-y-4">
        {loading ? (
          <AdminPageLoader
            label="Loading specializations..."
            description="Fetching specializations and services from the database."
          />
        ) : (
          <>
            {groupedByService.map(({ service, specializations: specs }) => (
              specs.length > 0 && (
                <div key={service.id} className="rounded-2xl border border-[#d7e6e2] bg-white p-4">
                  <div className="mb-3 border-b border-[#eef3f1] pb-3">
                    <p className="font-semibold text-[#037B76]">{service.title?.en}</p>
                    <p className="text-sm text-[#586971]" dir="rtl">{service.title?.ar}</p>
                  </div>
                  <div className="space-y-3">
                    {specs.map((spec) => renderSpecRow(spec, true))}
                  </div>
                </div>
              )
            ))}

            {unassigned.length > 0 && (
              <div className="rounded-2xl border border-[#d7e6e2] bg-white p-4">
                <div className="mb-3 border-b border-[#eef3f1] pb-3">
                  <p className="font-semibold text-[#586971]">No parent service</p>
                </div>
                <div className="space-y-3">
                  {unassigned.map((spec) => renderSpecRow(spec))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
