'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAdminAuth } from '@/contexts/admin-auth-context';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/specializations', label: 'Specializations' },
  { href: '/admin/doctors', label: 'Doctors' },
  { href: '/admin/services', label: 'Services' },
];

export default function AdminShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, loading, logout, configured } = useAdminAuth();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (loading || isLoginPage) return;
    if (!configured) return;
    if (!user) {
      router.replace('/admin/login');
    }
  }, [loading, user, configured, isLoginPage, router]);

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#f4f8f7]">{children}</div>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f8f7]">
        <p className="text-[#586971]">Loading admin panel...</p>
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f8f7] px-6">
        <div className="max-w-lg rounded-2xl border border-[#d7e6e2] bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-[#002f3b]">Firebase not configured</h1>
          <p className="mt-3 text-[#586971]">
            Add your Firebase environment variables to enable the admin panel. See `.env.example` for details.
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f4f8f7]">
      <header className="border-b border-[#d7e6e2] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-xl font-semibold text-[#037B76]">
              Star Health Admin
            </Link>
            <nav className="hidden gap-4 md:flex">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium ${
                    pathname === item.href ? 'text-[#037B76]' : 'text-[#586971] hover:text-[#002f3b]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-[#586971] sm:inline">
              {user.email} · {role}
            </span>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-[#037B76] px-4 py-2 text-sm font-medium text-[#037B76] hover:bg-[#037B76] hover:text-white"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  );
}
