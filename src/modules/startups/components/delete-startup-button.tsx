'use client';

import { useState, useTransition } from 'react';
import { deleteStartupAction } from '@/modules/startups/actions/startups';
import { Button } from '@/shared/components/ui/button';

export function DeleteStartupButton({
  startupId,
  startupTitle,
  compact = false,
}: {
  startupId: string;
  startupTitle: string;
  compact?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      try {
        await deleteStartupAction(startupId);
      } catch {
        setError('Не удалось удалить запись');
        setConfirming(false);
      }
    });
  }

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setConfirming(true)}
        className="border-error/30 text-error hover:bg-error/5"
      >
        Удалить запись
      </Button>
    );
  }

  return (
    <div className={compact ? 'space-y-2' : 'rounded-lg border border-error/20 bg-error/5 p-4 space-y-3'}>
      <p className="text-sm text-muted">
        Удалить «{startupTitle}» безвозвратно? Голоса, комментарии и файлы тоже
        исчезнут.
      </p>
      {error && <p className="text-sm text-error">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={isPending}
          onClick={handleDelete}
        >
          {isPending ? 'Удаление…' : 'Да, удалить'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={isPending}
          onClick={() => {
            setConfirming(false);
            setError(null);
          }}
        >
          Отмена
        </Button>
      </div>
    </div>
  );
}
