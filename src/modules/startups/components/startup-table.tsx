import Link from 'next/link';
import { FileText, MessageSquare } from 'lucide-react';
import type { Role } from '@/modules/auth/lib/roles';
import { StartupListItem } from '@/modules/startups/lib/startups';
import { canCreateStartup, canVote, canVoteOnStartup } from '@/shared/lib/permissions';
import { VotePanel } from '@/modules/startups/components/vote-panel';
import { Button } from '@/shared/components/ui/button';

function StartupRow({
  startup,
  rank,
  voting,
  userId,
}: {
  startup: StartupListItem;
  rank: number;
  voting: boolean;
  userId: string;
}) {
  const rowCanVote = voting && canVoteOnStartup(userId, startup.authorId);

  return (
    <tr className="startup-card-fade-in transition-colors hover:bg-gray-50/50">
      <td className="px-6 py-4 text-center font-mono text-xs font-semibold text-muted">
        {rank}
      </td>

      <td className="px-6 py-4">
        <div className="min-w-0">
          <Link
            href={`/startups/${startup.id}`}
            className="block text-sm font-bold text-foreground transition-colors hover:text-primary sm:text-base"
          >
            {startup.title}
          </Link>
          <p className="mt-1 line-clamp-1 max-w-md text-xs text-muted">
            {startup.description}
          </p>
        </div>
      </td>

      <td className="px-6 py-4 text-xs font-medium text-gray-700">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-200 bg-background text-[10px] font-bold text-muted">
            {startup.authorName.charAt(0)}
          </div>
          <span className="truncate">{startup.authorName}</span>
        </div>
      </td>

      <td className="px-6 py-4 text-center text-xs">
        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 font-mono text-[10px] text-gray-600">
          <FileText className="h-3.5 w-3.5 text-muted" />
          {startup.fileCount}
        </span>
      </td>

      <td className="px-6 py-4 text-center text-xs">
        <Link
          href={`/startups/${startup.id}#comments`}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 font-mono text-[10px] text-gray-600 hover:text-primary"
        >
          <MessageSquare className="h-3.5 w-3.5 text-muted" />
          {startup.commentCount}
        </Link>
      </td>

      <td className="px-6 py-4 text-center">
        <VotePanel
          key={startup.id}
          startupId={startup.id}
          score={startup.score}
          userVote={startup.userVote}
          canVote={rowCanVote}
          layout="compact"
        />
      </td>
    </tr>
  );
}

export function StartupTable({
  startups,
  userRole,
  userId,
}: {
  startups: StartupListItem[];
  userRole: Role;
  userId: string;
}) {
  const voting = canVote(userRole);

  if (startups.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
        <p className="text-lg font-bold text-foreground">Пока нет стартапов</p>
        <p className="mt-1 text-sm text-muted">
          {canCreateStartup(userRole)
            ? 'Создайте первую карточку — она появится в общем рейтинге.'
            : 'Загляните позже или измените фильтры поиска.'}
        </p>
        {canCreateStartup(userRole) && (
          <Link href="/startups/new" className="mt-6 inline-block">
            <Button>
              <span className="mr-1.5">+</span> Подать стартап
            </Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-background font-mono text-[11px] uppercase tracking-wider text-muted">
              <th className="w-12 px-6 py-4 text-center">Ранг</th>
              <th className="px-6 py-4">Проект</th>
              <th className="w-44 px-6 py-4">Основатель</th>
              <th className="w-28 px-6 py-4 text-center">Вложений</th>
              <th className="w-28 px-6 py-4 text-center">Отзывы</th>
              <th className="w-36 px-6 py-4 text-center">Голосование</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-foreground">
            {startups.map((startup, index) => (
              <StartupRow
                key={startup.id}
                startup={startup}
                rank={index + 1}
                voting={voting}
                userId={userId}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
