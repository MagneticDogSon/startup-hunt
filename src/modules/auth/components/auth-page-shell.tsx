import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BrandLogo } from '@/shared/components/brand-logo';
import { cn } from '@/shared/lib/utils';

const focusRing =
  'rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

const linkTouch =
  'inline-flex min-h-11 items-center underline-offset-4 hover:underline';

export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-background px-4 py-12 font-sans sm:px-6 lg:px-8">
      <div className="absolute left-6 top-6">
        <Link
          href="/"
          className={cn(
            linkTouch,
            focusRing,
            'inline-flex items-center gap-2 text-sm text-muted hover:text-primary',
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Вернуться на главную
        </Link>
      </div>

      <div className="mx-auto mt-8 w-full max-w-md sm:mt-0">
        <div className="mb-6 text-center">
          <BrandLogo href="/" size="lg" className="justify-center" />
        </div>
        {children}
      </div>
    </div>
  );
}

export { focusRing, linkTouch };
