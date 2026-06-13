'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@/shared/components/ui/button';

function PendingSubmitButton({
  idleLabel,
  pendingLabel,
}: {
  idleLabel: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full"
      disabled={pending}
      aria-busy={pending}
    >
      {pending ? pendingLabel : idleLabel}
    </Button>
  );
}

export function LoginSubmitButton() {
  return <PendingSubmitButton idleLabel="Войти" pendingLabel="Входим..." />;
}

export function RegisterSubmitButton() {
  return (
    <PendingSubmitButton
      idleLabel="Зарегистрироваться"
      pendingLabel="Регистрируем..."
    />
  );
}
