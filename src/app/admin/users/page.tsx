import { prisma } from '@/shared/lib/prisma';
import { authWithFreshRole } from '@/modules/auth/lib/session';
import type { Role } from '@/modules/auth/lib/roles';
import { AdminUserTable } from '@/modules/admin/components/admin-user-table';

export default async function AdminUsersPage() {
  const session = await authWithFreshRole();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      requestedRole: true,
      createdAt: true,
    },
  });

  return (
    <AdminUserTable
      users={users.map((u) => ({ ...u, role: u.role as Role }))}
      currentUserId={session!.user.id}
    />
  );
}
