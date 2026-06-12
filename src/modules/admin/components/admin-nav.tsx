'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/lib/utils';

const navItems = [
  { href: '/admin', label: 'Обзор', exact: true },
  { href: '/admin/users', label: 'Пользователи', exact: false },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      className="mb-8 flex gap-1 border-b border-border"
      aria-label="Разделы админки"
    >
      {navItems.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'border-b-2 px-4 py-2 text-sm font-medium transition-colors',
              active
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-foreground',
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
