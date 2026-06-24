'use client';

import Link from 'next/link';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import { ROLE_LABELS } from '@/lib/firebase/roles';

export default function AdminDashboardPage() {
  const { role, canWrite, canManageUsers } = useAdminAuth();
  const roleLabel = ROLE_LABELS[role] || role;

  return (
    <div>
      <h1 className="text-3xl font-semibold text-[#002f3b]">Dashboard</h1>
      <p className="mt-2 text-[#586971]">
        Signed in as <strong>{roleLabel}</strong>. {canWrite ? 'You can manage content below.' : 'You have read-only access.'}
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-2xl border border-[#b8d9cf] bg-gradient-to-br from-[#f3faf8] to-white p-6 transition-shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold text-[#037B76]">View Website</h2>
          <p className="mt-2 text-sm text-[#586971]">Open the public Star Health site in a new tab to preview the frontend.</p>
        </a>
        <Link
          href="/admin/specializations"
          className="rounded-2xl border border-[#d7e6e2] bg-white p-6 transition-shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold text-[#037B76]">Specializations</h2>
          <p className="mt-2 text-sm text-[#586971]">Manage doctor specializations by service category.</p>
        </Link>
        <Link
          href="/admin/doctors"
          className="rounded-2xl border border-[#d7e6e2] bg-white p-6 transition-shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold text-[#037B76]">Doctors</h2>
          <p className="mt-2 text-sm text-[#586971]">Manage doctor profiles, specialties, and visibility.</p>
        </Link>
        <Link
          href="/admin/service-categories"
          className="rounded-2xl border border-[#d7e6e2] bg-white p-6 transition-shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold text-[#037B76]">Service Categories</h2>
          <p className="mt-2 text-sm text-[#586971]">Organize services into browsable categories.</p>
        </Link>
        <Link
          href="/admin/services"
          className="rounded-2xl border border-[#d7e6e2] bg-white p-6 transition-shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold text-[#037B76]">Services</h2>
          <p className="mt-2 text-sm text-[#586971]">Manage service listings and detail pages.</p>
        </Link>
        <Link
          href="/admin/blogs"
          className="rounded-2xl border border-[#d7e6e2] bg-white p-6 transition-shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold text-[#037B76]">Blogs</h2>
          <p className="mt-2 text-sm text-[#586971]">Create SEO blog posts for the public blog listing and detail pages.</p>
        </Link>
        <Link
          href="/admin/appointments"
          className="rounded-2xl border border-[#d7e6e2] bg-white p-6 transition-shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold text-[#037B76]">Bookings</h2>
          <p className="mt-2 text-sm text-[#586971]">View appointments, mark as read, and create or cancel bookings.</p>
        </Link>
        <Link
          href="/admin/homepage"
          className="rounded-2xl border border-[#d7e6e2] bg-white p-6 transition-shadow hover:shadow-md"
        >
          <h2 className="text-xl font-semibold text-[#037B76]">Homepage</h2>
          <p className="mt-2 text-sm text-[#586971]">Edit hero title, subtitle, and banner video for the homepage.</p>
        </Link>
        {canManageUsers && (
          <Link
            href="/admin/users"
            className="rounded-2xl border border-[#d7e6e2] bg-white p-6 transition-shadow hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-[#037B76]">Users</h2>
            <p className="mt-2 text-sm text-[#586971]">Create and manage admin panel users and roles.</p>
          </Link>
        )}
      </div>
    </div>
  );
}
