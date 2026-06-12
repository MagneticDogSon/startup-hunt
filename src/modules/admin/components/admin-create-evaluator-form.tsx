'use client';

import { useActionState } from 'react';
import { createEvaluatorAction } from '@/modules/admin/actions/admin';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

const initialState = { error: undefined as string | undefined, success: false };

export function AdminCreateEvaluatorForm() {
  const [state, formAction, pending] = useActionState(
    createEvaluatorAction,
    initialState,
  );

  return (
    <div className="rounded-lg border border-border bg-surface p-6">
      <h2 className="text-lg font-semibold">Создать оценщика</h2>
      <p className="mt-1 text-sm text-muted">
        Оценщики не регистрируются сами — аккаунт создаёт администратор.
      </p>

      {state.success && (
        <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm text-success">
          Оценщик создан. Передайте ему email и пароль для входа.
        </p>
      )}

      {state.error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-error">
          {state.error}
        </p>
      )}

      <form action={formAction} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="eval-name">Имя</Label>
          <Input id="eval-name" name="name" required autoComplete="off" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eval-email">Email</Label>
          <Input
            id="eval-email"
            name="email"
            type="email"
            required
            autoComplete="off"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eval-password">Пароль (мин. 10, буква и цифра)</Label>
          <Input
            id="eval-password"
            name="password"
            type="password"
            minLength={10}
            required
            autoComplete="new-password"
          />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? 'Создание…' : 'Создать оценщика'}
        </Button>
      </form>
    </div>
  );
}
