import Link from 'next/link';
import { Role } from '@/modules/auth/lib/roles';
import { prisma } from '@/shared/lib/prisma';
import { AdminCreateEvaluatorForm } from '@/modules/admin/components/admin-create-evaluator-form';
import { cn } from '@/shared/lib/utils';

export default async function AdminDashboardPage() {
  const [usersByRole, startupCount, pendingFounders] = await Promise.all([
    prisma.user.groupBy({
      by: ['role'],
      _count: { id: true },
    }),
    prisma.startup.count(),
    prisma.user.count({
      where: { role: Role.PENDING, requestedRole: Role.FOUNDER },
    }),
  ]);

  const roleCount = Object.fromEntries(
    usersByRole.map((r) => [r.role, r._count.id]),
  );
  const totalUsers = usersByRole.reduce((sum, r) => sum + r._count.id, 0);

  const stats = [
    { label: 'Всего пользователей', value: totalUsers },
    { label: 'Основатели', value: roleCount[Role.FOUNDER] ?? 0 },
    { label: 'Оценщики', value: roleCount[Role.EVALUATOR] ?? 0 },
    { label: 'Стартапы', value: startupCount },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-surface p-5"
          >
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-1 text-3xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </div>

      {pendingFounders > 0 && (
        <div className="flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-amber-900">
            {pendingFounders}{' '}
            {pendingFounders === 1
              ? 'основатель ожидает'
              : 'основателей ожидают'}{' '}
            подтверждения роли
          </p>
          <Link
            href="/admin/users"
            className={cn(
              'inline-flex h-8 items-center justify-center rounded-md border border-border bg-surface px-3 text-sm font-medium transition-colors hover:bg-background',
            )}
          >
            Перейти к пользователям
          </Link>
        </div>
      )}

      <AdminCreateEvaluatorForm />
    </div>
  );
}
