import AdminShell from '@/components/admin/admin-shell';
import { AdminAuthProvider } from '@/contexts/admin-auth-context';
import { AdminThemeProvider } from '@/contexts/admin-theme-context';

export const metadata = {
  title: 'Admin | Star Health',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminThemeProvider>
        <AdminShell>{children}</AdminShell>
      </AdminThemeProvider>
    </AdminAuthProvider>
  );
}
