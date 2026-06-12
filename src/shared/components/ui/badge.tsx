import { cn } from '@/shared/lib/utils';

const variants = {
  default: 'bg-primary/10 text-primary',
  muted: 'bg-background text-muted border border-border',
  admin: 'bg-purple-100 text-purple-800',
  founder: 'bg-orange-100 text-orange-800',
  evaluator: 'bg-blue-100 text-blue-800',
  pending: 'bg-gray-100 text-gray-600',
};

type BadgeVariant = keyof typeof variants;

export function Badge({
  className,
  variant = 'default',
  children,
}: {
  className?: string;
  variant?: BadgeVariant;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
