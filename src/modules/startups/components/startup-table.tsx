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
  index,
  voting,
  userId,
}: {
  startup: StartupListItem;
  rank: number;
  index: number;
  voting: boolean;
  userId: string;
}) {
  const rowCanVote = voting && canVoteOnStartup(userId, startup.authorId);

  return (
    <tr
      className="startup-card-fade-in border-l-2 border-l-transparent transition-all duration-200 hover:border-l-primary hover:bg-primary/5"
      style={{ animationDelay: `${Math.min(index * 35, 240)}ms` }}
    >
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

      <td className="px-6 py-4 text-xs font-medium text-muted">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md border border-border bg-background text-[11px] font-bold text-muted">
            {startup.authorName.charAt(0)}
          </div>
          <span className="truncate">{startup.authorName}</span>
        </div>
      </td>

      <td className="px-6 py-4 text-center text-xs">
        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-muted">
          <FileText className="h-3.5 w-3.5 text-muted" />
          {startup.fileCount}
        </span>
      </td>

      <td className="px-6 py-4 text-center text-xs">
        <Link
          href={`/startups/${startup.id}#comments`}
          className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-muted transition-colors hover:text-primary"
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
  hasActiveFilters = false,
}: {
  startups: StartupListItem[];
  userRole: Role;
  userId: string;
  hasActiveFilters?: boolean;
}) {
  const voting = canVote(userRole);

  if (startups.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface px-6 py-16 text-center">
        <p className="text-lg font-bold text-foreground">
          {hasActiveFilters ? 'Ничего не найдено' : 'Пока нет стартапов'}
        </p>
        <p className="mt-1 text-sm text-muted">
          {hasActiveFilters
            ? 'Измените запрос, сортировку или сбросьте фильтры.'
            : canCreateStartup(userRole)
              ? 'Создайте первую карточку — она появится в общем рейтинге.'
              : 'Загляните позже — новые проекты появятся после публикации.'}
        </p>
        {hasActiveFilters ? (
          <Link href="/startups" className="mt-6 inline-block">
            <Button variant="outline">Сбросить фильтры</Button>
          </Link>
        ) : canCreateStartup(userRole) ? (
          <Link href="/startups/new" className="mt-6 inline-block">
            <Button>
              <span className="mr-1.5">+</span> Подать стартап
            </Button>
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">
            Каталог стартапов с рейтингом, автором, вложениями, отзывами и голосованием
          </caption>
          <thead>
            <tr className="border-b border-border bg-background font-mono text-[11px] uppercase tracking-wider text-muted">
              <th scope="col" className="w-12 px-6 py-4 text-center">Ранг</th>
              <th scope="col" className="px-6 py-4">Проект</th>
              <th scope="col" className="w-44 px-6 py-4">Основатель</th>
              <th scope="col" className="w-28 px-6 py-4 text-center">Вложений</th>
              <th scope="col" className="w-28 px-6 py-4 text-center">Отзывы</th>
              <th scope="col" className="w-36 px-6 py-4 text-center">Голосование</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-foreground">
            {startups.map((startup, index) => (
              <StartupRow
                key={startup.id}
                startup={startup}
                rank={index + 1}
                index={index}
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
