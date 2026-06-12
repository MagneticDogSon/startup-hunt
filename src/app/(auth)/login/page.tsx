import Link from 'next/link';
import { loginAction } from '@/modules/auth/actions/auth';
import {
  AuthPageShell,
  focusRing,
  linkTouch,
} from '@/modules/auth/components/auth-page-shell';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { cn } from '@/shared/lib/utils';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; error?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthPageShell>
      <div className="rounded-2xl border border-border bg-surface px-6 py-8 shadow-xl">
        <h1 className="mb-2 text-center text-xl font-bold text-foreground">Вход</h1>
        <p className="mb-6 text-center text-xs text-muted">
          Вход в закрытую платформу оценок
        </p>

        {params.registered === 'founder' && (
          <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-success">
            Регистрация основателя успешна. Войдите в аккаунт — администратор
            подтвердит доступ к публикации стартапов.
          </p>
        )}

        {params.error === 'rate' && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-error">
            Слишком много попыток входа. Подождите минуту.
          </p>
        )}

        {params.error && params.error !== 'rate' && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-error">
            Неверный email или пароль
          </p>
        )}

        <form action={loginAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Войти
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Нет аккаунта?{' '}
          <Link
            href="/register/founder"
            className={cn(linkTouch, 'text-primary hover:text-primary-hover', focusRing)}
          >
            Зарегистрироваться как основатель
          </Link>
        </p>
      </div>
    </AuthPageShell>
  );
}
