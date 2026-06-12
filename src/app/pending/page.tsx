import { redirect } from 'next/navigation';
import { DashboardShell } from '@/shared/components/dashboard-shell';
import { ROLE_LABELS } from '@/shared/lib/permissions';
import { prisma } from '@/shared/lib/prisma';
import { Role } from '@/modules/auth/lib/roles';
import { authWithFreshRole } from '@/modules/auth/lib/session';

export default async function PendingPage() {
  const session = await authWithFreshRole();
  if (!session?.user) {
    redirect('/login');
  }
  if (session.user.role !== Role.PENDING) {
    redirect('/startups');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { requestedRole: true },
  });

  const requestedLabel =
    user?.requestedRole && user.requestedRole in ROLE_LABELS
      ? ROLE_LABELS[user.requestedRole as keyof typeof ROLE_LABELS]
      : null;

  return (
    <DashboardShell>
      <div className="mx-auto max-w-lg rounded-2xl border border-border bg-surface p-8 text-center shadow-xl">
        <h1 className="mb-4 text-xl font-bold text-foreground">Заявка на модерации</h1>
        {requestedLabel ? (
          <p className="text-muted">
            Вы зарегистрировались как {requestedLabel.toLowerCase()}. Администратор
            подтвердит роль и откроет доступ к платформе.
          </p>
        ) : (
          <p className="text-muted">
            Ваш аккаунт зарегистрирован. Администратор назначит вам роль
            (основатель или оценщик), после чего вы получите доступ к платформе.
          </p>
        )}
      </div>
    </DashboardShell>
  );
}
