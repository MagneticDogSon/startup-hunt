import { redirect } from 'next/navigation';
import { DashboardShell } from '@/shared/components/dashboard-shell';
import { ROLE_LABELS } from '@/shared/lib/permissions';
import { prisma } from '@/shared/lib/prisma';
import { Role } from '@/modules/auth/lib/roles';
import { authWithFreshRole } from '@/modules/auth/lib/session';
import { signOutAction } from '@/modules/auth/actions/auth';
import { Button } from '@/shared/components/ui/button';

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
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
          i
        </div>
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
        <p className="mt-5 rounded-xl border border-border bg-background-soft px-4 py-3 text-sm text-muted">
          Обычно это занимает до одного рабочего дня. Если доступ нужен срочно,
          свяжитесь с администратором проекта.
        </p>
        <form action={signOutAction} className="mt-6">
          <Button type="submit" variant="outline">
            Выйти из аккаунта
          </Button>
        </form>
      </div>
    </DashboardShell>
  );
}
