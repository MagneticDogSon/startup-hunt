import { redirect } from 'next/navigation';
import { AdminShell } from '@/modules/admin/components/admin-shell';
import { canManageRoles } from '@/shared/lib/permissions';
import { authWithFreshRole } from '@/modules/auth/lib/session';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await authWithFreshRole();
  if (!session?.user || !canManageRoles(session.user.role)) {
    redirect('/startups');
  }

  return <AdminShell>{children}</AdminShell>;
}
