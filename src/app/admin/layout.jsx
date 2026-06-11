import AdminShell from '@/components/admin/admin-shell';
import { AdminAuthProvider } from '@/contexts/admin-auth-context';

export const metadata = {
  title: 'Admin | Star Health',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAuthProvider>
  );
}
