'use client';

import { useCallback, useEffect, useState } from 'react';
import ServiceCategoryForm from '@/components/admin/service-category-form';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';
import { AdminActionButton, AdminActionGroup } from '@/components/admin/admin-action-button';

export default function AdminServiceCategoriesPage() {
  const { getIdToken, canWrite, canDeleteContent } = useAdminAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getIdToken();
      const data = await adminFetch('/api/admin/service-categories', { token });
      setCategories(data);
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

  const handleSave = async (category) => {
    try {
      setSaving(true);
      const token = await getIdToken();
      if (editing) {
        await adminFetch(`/api/admin/service-categories/${editing.id}`, {
          method: 'PUT',
          body: category,
          token,
        });
      } else {
        await adminFetch('/api/admin/service-categories', {
          method: 'POST',
          body: category,
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
    if (!window.confirm('Delete this service category?')) return;
    try {
      const token = await getIdToken();
      await adminFetch(`/api/admin/service-categories/${id}`, { method: 'DELETE', token });
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#002f3b]">Service Categories</h1>
          <p className="mt-1 text-sm text-[#586971]">Group services into categories for listing and filtering.</p>
        </div>
        {canWrite && (
          <button
            type="button"
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="rounded-lg bg-[#037B76] px-4 py-2 text-sm font-medium text-white"
          >
            Add Category
          </button>
        )}
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {showForm && canWrite && (
        <div className="mt-6">
          <ServiceCategoryForm
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
              <th className="px-4 py-3 font-medium text-[#586971]">Name</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Slug</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Order</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Status</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>
                  <AdminPageLoader
                    variant="table"
                    label="Loading service categories..."
                    description="Fetching categories from the database."
                  />
                </td>
              </tr>
            ) : categories.map((category) => (
              <tr key={category.id} className="border-b border-[#eef4f2]">
                <td className="px-4 py-3">
                  <p className="font-medium text-[#002f3b]">{category.name?.en}</p>
                  <p className="text-xs text-[#586971]" dir="rtl">{category.name?.ar}</p>
                </td>
                <td className="px-4 py-3 text-[#586971]">{category.slug}</td>
                <td className="px-4 py-3 text-[#586971]">{category.order}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${category.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {category.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {canWrite && (
                    <AdminActionGroup>
                      <AdminActionButton
                        action="edit"
                        onClick={() => { setEditing(category); setShowForm(true); }}
                      />
                      {canDeleteContent && (
                        <AdminActionButton action="delete" onClick={() => handleDelete(category.id)} />
                      )}
                    </AdminActionGroup>
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
