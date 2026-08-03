'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { adminFetch } from '@/lib/admin-api';
import AdminPageLoader from '@/components/admin/admin-page-loader';
import { ROLE_LABELS } from '@/lib/firebase/roles';
import DashboardActivityChart from '@/components/admin/dashboard/dashboard-activity-chart';
import DashboardStatCard from '@/components/admin/dashboard/dashboard-stat-card';

function formatNumber(value) {
  return new Intl.NumberFormat().format(value ?? 0);
}

export default function AdminDashboard() {
  const { role, canWrite, canManageUsers, getIdToken } = useAdminAuth();
  const roleLabel = ROLE_LABELS[role] || role;
  const [period, setPeriod] = useState('7days');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [error, setError] = useState('');

  const loadStats = useCallback(async (nextPeriod, { initial = false } = {}) => {
    try {
      if (initial) {
        setLoading(true);
      } else {
        setChartLoading(true);
      }
      const token = await getIdToken();
      const data = await adminFetch(`/api/admin/dashboard/stats?period=${nextPeriod}`, { token });
      setStats(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setChartLoading(false);
    }
  }, [getIdToken]);

  useEffect(() => {
    loadStats(period, { initial: true });
  }, [loadStats]);

  const handlePeriodChange = (nextPeriod) => {
    if (nextPeriod === period) return;
    setPeriod(nextPeriod);
    loadStats(nextPeriod, { initial: false });
  };

  if (loading && !stats) {
    return (
      <AdminPageLoader
        label="Loading dashboard..."
        description="Fetching counts and activity trends from your admin data."
      />
    );
  }

  const counts = stats?.counts || {};

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#037B76]">Overview</p>
          <h1 className="mt-1 text-3xl font-semibold text-[#002f3b]">Dashboard</h1>
          <p className="mt-2 text-[#586971]">
            Signed in as <strong>{roleLabel}</strong>.
            {canWrite ? ' Track content, bookings, and contact activity in one place.' : ' You have read-only access.'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Total bookings', value: counts.bookings },
            { label: 'Active bookings', value: counts.bookingsActive },
            { label: 'Unread bookings', value: counts.bookingsUnread },
            { label: 'Unread contacts', value: counts.contactUnread },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-[#d7e6e2] bg-white px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-[#586971]">{item.label}</p>
              <p className="mt-1 text-xl font-semibold text-[#002f3b]">{formatNumber(item.value)}</p>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <DashboardActivityChart
        activity={stats?.activity}
        period={period}
        onPeriodChange={handlePeriodChange}
        loading={chartLoading}
      />

      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#002f3b]">Content & Operations</h2>
            <p className="text-sm text-[#586971]">Live counts across every section of the admin panel.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <DashboardStatCard
            href="/"
            external
            title="View Website"
            description="Open the public Star Health site in a new tab to preview the frontend."
            countLabel="Live"
            accent="teal"
          />
          <DashboardStatCard
            href="/admin/appointments"
            title="Bookings"
            description="View appointments, mark as read, and create or cancel bookings."
            count={counts.bookings}
            badge={counts.bookingsUnread ? `${counts.bookingsUnread} new` : null}
            accent="amber"
          />
          <DashboardStatCard
            href="/admin/appointments?tab=contact"
            title="Contact Submissions"
            description="Review messages submitted through the website contact form."
            count={counts.contactSubmissions}
            badge={counts.contactUnread ? `${counts.contactUnread} new` : null}
            accent="amber"
          />
          <DashboardStatCard
            href="/admin/specializations"
            title="Specializations"
            description="Manage doctor specializations linked to parent services."
            count={counts.specializations}
          />
          <DashboardStatCard
            href="/admin/doctors"
            title="Doctors"
            description="Manage doctor profiles, specialties, and visibility."
            count={counts.doctors}
          />
          <DashboardStatCard
            href="/admin/services"
            title="Services"
            description="Manage service listings and detail pages."
            count={counts.services}
          />
          <DashboardStatCard
            href="/admin/blogs"
            title="Blogs"
            description="Create SEO blog posts for the public blog listing and detail pages."
            count={counts.blogs}
          />
          {canManageUsers && (
            <DashboardStatCard
              href="/admin/users"
              title="Users"
              description="Create and manage admin panel users and roles."
              count={counts.users}
            />
          )}
        </div>
      </div>
    </div>
  );
}
