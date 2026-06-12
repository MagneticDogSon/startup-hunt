'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Role, type Role as RoleType } from '@/modules/auth/lib/roles';
import { canCreateStartup, canManageRoles } from '@/shared/lib/permissions';
import { cn } from '@/shared/lib/utils';

const linkClass =
  'rounded-sm px-1 py-0.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

export function AppNavLinks({ role }: { role: RoleType }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === '/startups') {
      return (
        pathname === '/startups' ||
        (/^\/startups\/[^/]+$/.test(pathname) && !pathname.endsWith('/new'))
      );
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  if (role === Role.PENDING) return null;

  const items = [
    { href: '/startups', label: 'Стартапы', show: true },
    { href: '/startups/new', label: 'Создать', show: canCreateStartup(role) },
    { href: '/admin', label: 'Админ', show: canManageRoles(role) },
  ].filter((item) => item.show);

  return (
    <nav className="flex gap-4 text-sm" aria-label="Основная навигация">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(item.href) ? 'page' : undefined}
          className={cn(
            linkClass,
            isActive(item.href)
              ? 'font-medium text-primary'
              : 'text-foreground hover:text-primary',
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
