import Link from 'next/link';
import { Plus } from 'lucide-react';
import { redirect } from 'next/navigation';
import { authWithFreshRole } from '@/modules/auth/lib/session';
import { canCreateStartup, canViewStartups, canVote } from '@/shared/lib/permissions';
import { getStartupsList, type VoteFilter } from '@/modules/startups/lib/startups';
import { DashboardShell } from '@/shared/components/dashboard-shell';
import { StartupFilters } from '@/modules/startups/components/startup-filters';
import { StartupTable } from '@/modules/startups/components/startup-table';
import { Button } from '@/shared/components/ui/button';

export default async function StartupsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    order?: string;
    vote?: string;
  }>;
}) {
  const session = await authWithFreshRole();
  if (!session?.user) redirect('/login');
  if (!canViewStartups(session.user.role)) redirect('/pending');

  const params = await searchParams;
  const voteFilter: VoteFilter =
    params.vote === 'voted' || params.vote === 'not_voted'
      ? params.vote
      : 'all';

  const startups = await getStartupsList({
    q: params.q,
    sort: params.sort,
    order: params.order,
    userId: session.user.id,
    voteFilter,
  });

  const isFounder = canCreateStartup(session.user.role);
  const isEvaluator = canVote(session.user.role) && !isFounder;

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Каталог стартапов на оценку
            </h1>
            <p className="mt-1 text-xs text-muted">
              Изучайте проекты закрытого сообщества, загружайте питч-деки и
              ставьте баллы
            </p>
          </div>

          {isFounder ? (
            <Link href="/startups/new">
              <Button className="shrink-0 text-xs font-bold">
                <Plus className="mr-1.5 h-4 w-4" />
                Подать стартап
              </Button>
            </Link>
          ) : isEvaluator ? (
            <div className="shrink-0 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-2.5 text-xs text-indigo-800">
              Вы в режиме <strong>Оценщика</strong>. Изучайте вложения и
              голосуйте ▲▼.
            </div>
          ) : null}
        </div>

        <StartupFilters
          q={params.q}
          sort={params.sort}
          order={params.order}
          vote={voteFilter}
          showVoteFilter={canVote(session.user.role)}
          totalCount={startups.length}
        />

        <StartupTable
          startups={startups}
          userRole={session.user.role}
          userId={session.user.id}
        />
      </div>
    </DashboardShell>
  );
}
