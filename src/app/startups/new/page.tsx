import { redirect } from 'next/navigation';
import { authWithFreshRole } from '@/modules/auth/lib/session';
import { canCreateStartup } from '@/shared/lib/permissions';
import { DashboardShell } from '@/shared/components/dashboard-shell';
import { CreateStartupFlow } from '@/modules/startups/components/create-startup-flow';

export default async function NewStartupPage() {
  const session = await authWithFreshRole();
  if (!session?.user || !canCreateStartup(session.user.role)) {
    redirect('/startups');
  }

  return (
    <DashboardShell>
      <h1 className="mb-6 text-2xl font-semibold">Новый стартап</h1>
      <CreateStartupFlow authorName={session.user.name ?? 'Вы'} />
    </DashboardShell>
  );
}
