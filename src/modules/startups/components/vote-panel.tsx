'use client';

import { ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';

type VotePanelProps = {
  startupId: string;
  score: number;
  userVote: number | null;
  canVote: boolean;
  layout?: 'panel' | 'inline' | 'stack' | 'compact';
};

export function VotePanel({
  startupId,
  score,
  userVote,
  canVote,
  layout = 'panel',
}: VotePanelProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [localScore, setLocalScore] = useState(score);
  const [localVote, setLocalVote] = useState(userVote);

  async function vote(value: 1 | -1) {
    if (!canVote || loading) return;

    const prevScore = localScore;
    const prevVote = localVote;

    let newVote: number | null = value;
    let delta: number = value;

    if (localVote === value) {
      newVote = null;
      delta = -value;
    } else if (localVote !== null) {
      delta = value - localVote;
    }

    setLocalVote(newVote);
    setLocalScore(prevScore + delta);
    setLoading(true);

    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startupId, value }),
      });

      if (!res.ok) {
        setLocalVote(prevVote);
        setLocalScore(prevScore);
      } else {
        router.refresh();
      }
    } catch {
      setLocalVote(prevVote);
      setLocalScore(prevScore);
    } finally {
      setLoading(false);
    }
  }

  const stopNav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const hasVoted = localVote !== null;

  if (layout === 'stack') {
    return (
      <div
        className={cn(
          'flex shrink-0 flex-col items-center gap-0.5 rounded-lg px-1 py-0.5 transition-colors',
          hasVoted
            ? localVote === 1
              ? 'bg-upvote/15 ring-2 ring-upvote/40'
              : 'bg-downvote/10 ring-2 ring-downvote/30'
            : 'opacity-70',
        )}
        title={
          hasVoted
            ? localVote === 1
              ? 'Вы проголосовали за'
              : 'Вы проголосовали против'
            : canVote
              ? 'Ещё не голосовали'
              : undefined
        }
      >
        <button
          type="button"
          aria-label="Голосовать за"
          aria-pressed={localVote === 1}
          disabled={!canVote || loading}
          onClick={(e) => {
            stopNav(e);
            vote(1);
          }}
          className={cn(
            'flex min-h-11 min-w-11 items-center justify-center rounded-md transition-all disabled:opacity-40',
            localVote === 1
              ? 'bg-upvote/25 text-upvote shadow-sm'
              : hasVoted
                ? 'text-muted/50'
                : 'text-muted hover:bg-upvote/10 hover:text-upvote',
          )}
        >
          <ChevronUp className="h-5 w-5 stroke-[2.5]" />
        </button>
        <span
          className={cn(
            'min-w-[2ch] text-center text-sm font-semibold tabular-nums leading-none',
            localVote === 1 && 'text-upvote',
            localVote === -1 && 'text-downvote',
            !hasVoted && 'text-muted',
          )}
        >
          {localScore}
        </span>
        <button
          type="button"
          aria-label="Голосовать против"
          aria-pressed={localVote === -1}
          disabled={!canVote || loading}
          onClick={(e) => {
            stopNav(e);
            vote(-1);
          }}
          className={cn(
            'flex min-h-11 min-w-11 items-center justify-center rounded-md transition-all disabled:opacity-40',
            localVote === -1
              ? 'bg-downvote/20 text-downvote shadow-sm'
              : hasVoted
                ? 'text-muted/50'
                : 'text-muted hover:bg-downvote/10 hover:text-downvote',
          )}
        >
          <ChevronDown className="h-5 w-5 stroke-[2.5]" />
        </button>
      </div>
    );
  }

  if (layout === 'compact' || layout === 'inline') {
    const compact = layout === 'compact';
    return (
      <div
        className={cn(
          'inline-flex items-center gap-0.5 rounded-lg border border-gray-200 bg-background p-0.5',
          hasVoted && !compact && localVote === 1 && 'ring-2 ring-upvote/40',
          hasVoted && !compact && localVote === -1 && 'ring-2 ring-downvote/30',
        )}
      >
        <button
          type="button"
          aria-label="Голосовать за"
          aria-pressed={localVote === 1}
          disabled={!canVote || loading}
          onClick={(e) => {
            if (compact) stopNav(e);
            vote(1);
          }}
          className={cn(
            'rounded p-1.5 transition-all disabled:opacity-40',
            localVote === 1
              ? 'bg-primary/15 text-primary'
              : 'text-muted hover:bg-gray-200/50 hover:text-foreground',
          )}
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <span
          className={cn(
            'min-w-[20px] px-2 text-center font-mono text-xs font-bold tabular-nums',
            localScore > 0 && 'text-success',
            localScore < 0 && 'text-red-500',
            localScore === 0 && 'text-muted',
          )}
        >
          {localScore}
        </span>
        <button
          type="button"
          aria-label="Голосовать против"
          aria-pressed={localVote === -1}
          disabled={!canVote || loading}
          onClick={(e) => {
            if (compact) stopNav(e);
            vote(-1);
          }}
          className={cn(
            'rounded p-1.5 transition-all disabled:opacity-40',
            localVote === -1
              ? 'bg-red-500/10 text-red-500'
              : 'text-muted hover:bg-gray-200/50 hover:text-red-500',
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex w-[4.5rem] shrink-0 flex-col items-center rounded-xl border-2 bg-surface py-2 transition-colors',
        localVote === 1
          ? 'border-primary/40 shadow-sm'
          : localVote === -1
            ? 'border-border shadow-sm'
            : 'border-border',
      )}
    >
      <button
        type="button"
        aria-label="Голосовать за"
        disabled={!canVote || loading}
        onClick={(e) => {
          stopNav(e);
          vote(1);
        }}
        className={cn(
          'flex h-10 w-full items-center justify-center rounded-t-lg transition-colors disabled:opacity-40',
          localVote === 1
            ? 'bg-primary/10 text-upvote'
            : 'text-muted hover:bg-background hover:text-upvote',
        )}
      >
        <ChevronUp className="h-6 w-6 stroke-[2.5]" />
      </button>

      <span
        className={cn(
          'py-1 text-xl font-bold tabular-nums leading-none',
          localVote === 1 && 'text-upvote',
          localVote === -1 && 'text-downvote',
        )}
      >
        {localScore}
      </span>

      <button
        type="button"
        aria-label="Голосовать против"
        disabled={!canVote || loading}
        onClick={(e) => {
          stopNav(e);
          vote(-1);
        }}
        className={cn(
          'flex h-10 w-full items-center justify-center rounded-b-lg transition-colors disabled:opacity-40',
          localVote === -1
            ? 'bg-gray-100 text-downvote'
            : 'text-muted hover:bg-background hover:text-downvote',
        )}
      >
        <ChevronDown className="h-6 w-6 stroke-[2.5]" />
      </button>
    </div>
  );
}
