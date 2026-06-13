'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

const links = [
  { href: '#how-it-works', label: 'Как это работает' },
  { href: '#audiences', label: 'Для кого' },
  { href: '#features', label: 'Преимущества' },
];

export function LandingMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="landing-mobile-menu"
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          'inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border border-border bg-surface text-foreground transition-colors duration-200 hover:bg-background',
          focusRing,
        )}
      >
        {open ? (
          <X className="h-5 w-5" aria-hidden />
        ) : (
          <Menu className="h-5 w-5" aria-hidden />
        )}
      </button>

      {open && (
        <nav
          id="landing-mobile-menu"
          aria-label="Мобильная навигация"
          className="absolute left-0 right-0 top-full border-b border-border bg-surface/95 px-4 py-3 shadow-sm backdrop-blur-md"
        >
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'block rounded-lg px-3 py-2.5 text-sm text-foreground transition-colors duration-200 hover:bg-background hover:text-primary',
                    focusRing,
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={cn(
                'block rounded-lg px-3 py-2.5 text-center text-sm font-medium text-muted transition-colors duration-200 hover:bg-background hover:text-foreground',
                focusRing,
              )}
            >
              Войти
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className={cn(
                'block rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-medium text-white transition-colors duration-200 hover:bg-primary-hover',
                focusRing,
              )}
            >
              Регистрация
            </Link>
          </div>
        </nav>
      )}
    </div>
  );
}
