'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';
import { AdminActionButton, AdminActionGroup, AdminActionLink } from '@/components/admin/admin-action-button';
import { resolveServiceIcon } from '@/lib/content/service-icons';

export default function AdminServicesPage() {
  const { getIdToken, canWrite, canDeleteContent } = useAdminAuth();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getIdToken();
      const [data, cats] = await Promise.all([
        adminFetch('/api/admin/services', { token }),
        adminFetch('/api/admin/service-categories', { token }),
      ]);
      setServices(data);
      setCategories(cats);
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

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();
    return services.filter((service) => {
      const matchesCategory = !categoryFilter || service.categoryId === categoryFilter;
      if (!query) return matchesCategory;
      const titleEn = service.title?.en?.toLowerCase() || '';
      const titleAr = service.title?.ar?.toLowerCase() || '';
      const slug = service.slug?.toLowerCase() || '';
      const matchesSearch = titleEn.includes(query) || titleAr.includes(query) || slug.includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [services, search, categoryFilter]);

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name?.en || '—';
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      const token = await getIdToken();
      await adminFetch(`/api/admin/services/${serviceId}`, { method: 'DELETE', token });
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
          <Link
            href="/admin/services/new"
            className="rounded-lg bg-[#037B76] px-4 py-2 text-sm font-medium text-white"
          >
            Add Service
          </Link>
        )}
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services..."
          className="min-w-[220px] flex-1 rounded-lg border border-[#d7e6e2] px-3 py-2 text-sm"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-[#d7e6e2] px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name?.en}</option>
          ))}
        </select>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-[#d7e6e2] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[#d7e6e2] bg-[#f8fbfa]">
            <tr>
              <th className="px-4 py-3 font-medium text-[#586971]">Image</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Name</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Category</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Status</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Order</th>
              <th className="px-4 py-3 font-medium text-[#586971]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6}>
                  <AdminPageLoader
                    variant="table"
                    label="Loading services..."
                    description="Fetching services and categories from the database."
                  />
                </td>
              </tr>
            ) : filteredServices.map((service) => (
              <tr key={service.id} className="border-b border-[#eef4f2]">
                <td className="px-4 py-3">
                  <img
                    src={resolveServiceIcon(service)}
                    alt=""
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-[#002f3b]">{service.title?.en}</p>
                  <p className="text-xs text-[#586971]">{service.slug}</p>
                </td>
                <td className="px-4 py-3 text-[#586971]">{getCategoryName(service.categoryId)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-1 text-xs ${
                    (service.status || (service.published !== false ? 'active' : 'inactive')) === 'active'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  >
                    {service.status || (service.published !== false ? 'active' : 'inactive')}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#586971]">{service.order}</td>
                <td className="px-4 py-3">
                  <AdminActionGroup>
                    {canWrite && (
                      <AdminActionLink action="edit" href={`/admin/services/${service.id}`} />
                    )}
                    {canDeleteContent && (
                      <AdminActionButton action="delete" onClick={() => handleDelete(service.id)} />
                    )}
                  </AdminActionGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
