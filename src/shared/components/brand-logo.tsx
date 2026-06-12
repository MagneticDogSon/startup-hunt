import Link from 'next/link';
import { cn } from '@/shared/lib/utils';

type BrandLogoProps = {
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  showPlatformBadge?: boolean;
  className?: string;
};

const sizes = {
  sm: { icon: 'h-6 w-6 text-sm', text: 'text-base' },
  md: { icon: 'h-7 w-7 text-base', text: 'text-lg' },
  lg: { icon: 'h-8 w-8 text-lg', text: 'text-xl' },
};

export function BrandLogo({
  href = '/',
  size = 'md',
  showPlatformBadge = false,
  className,
}: BrandLogoProps) {
  const s = sizes[size];

  const content = (
    <>
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-lg bg-primary font-bold text-white shadow-sm shadow-primary/30',
          s.icon,
        )}
        aria-hidden
      >
        ▲
      </div>
      <span className={cn('font-bold tracking-tight text-foreground', s.text)}>
        Startup<span className="text-primary">Hunt</span>
      </span>
      {showPlatformBadge && (
        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600">
          PLATFORM
        </span>
      )}
    </>
  );

  const classes = cn('inline-flex items-center gap-2', className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
