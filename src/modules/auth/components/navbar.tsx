import Link from 'next/link';
import { LogOut, Settings } from 'lucide-react';
import { Role } from '@/modules/auth/lib/roles';
import { canManageRoles } from '@/shared/lib/permissions';
import { signOutAction } from '@/modules/auth/actions/auth';
import { BrandLogo } from '@/shared/components/brand-logo';

function roleShortLabel(role: Role): string {
  switch (role) {
    case Role.ADMIN:
      return 'Администратор ⚙️';
    case Role.EVALUATOR:
      return 'Оценщик ▲';
    case Role.FOUNDER:
      return 'Основатель ☕';
    default:
      return 'Ожидание';
  }
}

export function Navbar({
  name,
  role,
}: {
  name: string;
  role: Role;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <BrandLogo href="/startups" size="md" showPlatformBadge />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-bold uppercase text-primary">
              {name.charAt(0)}
            </div>
            <div className="hidden text-left text-xs sm:block">
              <div className="max-w-[120px] truncate font-bold text-foreground">
                {name}
              </div>
              <div className="font-mono text-[9px] font-bold capitalize text-muted">
                {roleShortLabel(role)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 border-l border-border pl-3">
            {canManageRoles(role) && (
              <Link
                href="/admin"
                className="rounded-lg p-2 text-muted transition-colors hover:bg-purple-50 hover:text-purple-600"
                title="Управление пользователями"
              >
                <Settings className="h-[18px] w-[18px]" />
              </Link>
            )}

            <form action={signOutAction}>
              <button
                type="submit"
                className="rounded-lg p-2 text-muted transition-colors hover:bg-red-50 hover:text-primary"
                title="Выйти из аккаунта"
              >
                <LogOut className="h-[18px] w-[18px]" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
}
