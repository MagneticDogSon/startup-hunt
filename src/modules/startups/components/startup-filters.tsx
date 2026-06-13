import { Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select } from '@/shared/components/ui/select';

export function StartupFilters({
  q,
  sort,
  order,
  vote,
  showVoteFilter = false,
  totalCount,
}: {
  q?: string;
  sort?: string;
  order?: string;
  vote?: string;
  showVoteFilter?: boolean;
  totalCount?: number;
}) {
  const activeSort = sort === 'date' ? 'newest' : 'score';
  const hasActiveFilters = Boolean(q?.trim()) || activeSort !== 'score' || vote !== 'all';

  return (
    <form
      method="GET"
      className="flex flex-col items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4 md:flex-row"
    >
      <div className="relative w-full md:w-80">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted" />
        <Input
          name="q"
          defaultValue={q ?? ''}
          placeholder="Поиск по названию, автору или описанию..."
          className="pl-9 text-xs"
        />
      </div>

      <div className="flex w-full flex-wrap items-center justify-end gap-4 md:w-auto">
        <span id="startup-sort-label" className="text-xs font-medium text-muted">
          Сортировка:
        </span>

        <div
          className="flex rounded-lg bg-background-soft p-0.5 text-xs font-semibold"
          aria-labelledby="startup-sort-label"
        >
          <button
            type="submit"
            name="sort"
            value="score"
            aria-pressed={activeSort === 'score'}
            className={`rounded-md px-3 py-1.5 transition-all ${
              activeSort === 'score'
                ? 'bg-surface text-foreground shadow-sm'
                : 'text-muted hover:text-foreground'
            }`}
          >
            По рейтингу
          </button>
          <button
            type="submit"
            name="sort"
            value="date"
            aria-pressed={activeSort === 'newest'}
            className={`rounded-md px-3 py-1.5 transition-all ${
              activeSort === 'newest'
                ? 'bg-surface text-foreground shadow-sm'
                : 'text-muted hover:text-foreground'
            }`}
          >
            По дате
          </button>
        </div>

        {showVoteFilter && (
          <Select name="vote" defaultValue={vote ?? 'all'} className="text-xs">
            <option value="all">Все стартапы</option>
            <option value="voted">Проголосовал</option>
            <option value="not_voted">Ещё не голосовал</option>
          </Select>
        )}

        <input type="hidden" name="order" value={order ?? 'desc'} />

        {totalCount !== undefined && (
          <div className="font-mono text-xs text-muted">
            Всего: <strong className="text-foreground">{totalCount}</strong>
          </div>
        )}

        <Button type="submit" size="sm" variant="outline">
          Найти
        </Button>

        {hasActiveFilters && (
          <Link
            href="/startups"
            className="inline-flex min-h-8 items-center rounded-sm px-2 text-xs font-medium text-muted transition-colors hover:text-primary"
          >
            Сбросить
          </Link>
        )}
      </div>
    </form>
  );
}
