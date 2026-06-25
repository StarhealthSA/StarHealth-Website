import AdminShell from '@/components/admin/admin-shell';
import { AdminAuthProvider } from '@/contexts/admin-auth-context';
import { AdminThemeProvider } from '@/contexts/admin-theme-context';
import { AdminUploadProvider } from '@/contexts/admin-upload-context';

export const metadata = {
  title: 'Admin | Star Health',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminThemeProvider>
        <AdminUploadProvider>
          <AdminShell>{children}</AdminShell>
        </AdminUploadProvider>
      </AdminThemeProvider>
    </AdminAuthProvider>
  );
}
