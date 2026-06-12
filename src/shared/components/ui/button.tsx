import { cn } from '@/shared/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'default' | 'outline' | 'ghost' | 'destructive';

const variants: Record<Variant, string> = {
  default:
    'bg-primary text-white shadow-sm shadow-primary/10 hover:bg-primary-hover',
  outline: 'border border-border bg-surface hover:bg-background',
  ghost: 'hover:bg-background',
  destructive: 'bg-error text-white hover:opacity-90',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-11 px-6',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex cursor-pointer items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';
