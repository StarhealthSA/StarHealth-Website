'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/admin-auth-context';
import AdminPageLoader from '@/components/admin/admin-page-loader';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, configured, loading } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      router.replace('/admin');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <AdminPageLoader
          label="Loading sign in..."
          description="Preparing the admin login page."
          className="w-full max-w-md border-none bg-transparent"
        />
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-[#d7e6e2] bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-[#002f3b]">Firebase not configured</h1>
          <p className="mt-3 text-sm text-[#586971]">
            Copy `.env.example` to `.env.local` and add your Firebase credentials.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-[#d7e6e2] bg-white p-8 shadow-sm"
      >
        <h1 className="text-2xl font-semibold text-[#002f3b]">Admin Login</h1>
        <p className="mt-2 text-sm text-[#586971]">Sign in to manage doctors and services.</p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <label className="mt-6 block">
          <span className="text-sm font-medium text-[#586971]">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-[#586971]">Password</span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[#d7e6e2] px-3 py-2"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-lg bg-[#037B76] py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {submitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
