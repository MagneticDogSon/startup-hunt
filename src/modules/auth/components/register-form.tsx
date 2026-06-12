import Link from 'next/link';
import {
  AuthPageShell,
  focusRing,
  linkTouch,
} from '@/modules/auth/components/auth-page-shell';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { cn } from '@/shared/lib/utils';

type RegisterFormProps = {
  title: string;
  description: string;
  action: (formData: FormData) => Promise<void>;
  error?: string;
  alternateLink?: {
    href: string;
    label: string;
  };
};

export function RegisterForm({
  title,
  description,
  action,
  error,
  alternateLink,
}: RegisterFormProps) {
  return (
    <AuthPageShell>
      <div className="rounded-2xl border border-border bg-surface px-6 py-8 shadow-xl">
        <h1 className="mb-2 text-center text-xl font-bold text-foreground">{title}</h1>
        <p className="mb-6 text-center text-xs text-muted">{description}</p>

        {error === 'exists' && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-error">
            Пользователь с таким email уже существует
          </p>
        )}

        {error === 'rate' && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-error">
            Слишком много попыток регистрации. Подождите минуту.
          </p>
        )}

        {error === 'validation' && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-error">
            Проверьте введённые данные
          </p>
        )}

        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Имя</Label>
            <Input id="name" name="name" required autoComplete="name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль (мин. 10, буква и цифра)</Label>
            <Input
              id="password"
              name="password"
              type="password"
              minLength={8}
              required
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" className="w-full">
            Зарегистрироваться
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Уже есть аккаунт?{' '}
          <Link
            href="/login"
            className={cn(linkTouch, 'text-primary hover:text-primary-hover', focusRing)}
          >
            Войти
          </Link>
        </p>

        {alternateLink && (
          <p className="mt-3 text-center text-sm text-muted">
            <Link
              href={alternateLink.href}
              className={cn(linkTouch, 'text-primary hover:text-primary-hover', focusRing)}
            >
              {alternateLink.label}
            </Link>
          </p>
        )}
      </div>
    </AuthPageShell>
  );
}
