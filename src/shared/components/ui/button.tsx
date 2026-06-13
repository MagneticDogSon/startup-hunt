import { cn } from '@/shared/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'default' | 'outline' | 'ghost' | 'destructive';

const variants: Record<Variant, string> = {
  default:
    'bg-gradient-to-r from-blue-600 to-indigo-600 text-on-primary shadow-md shadow-blue-500/15 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all duration-200',
  outline:
    'border border-border-strong bg-surface text-foreground hover:bg-background-soft hover:border-primary/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-98 transition-all duration-200',
  ghost: 'hover:bg-background-soft active:scale-98 transition-all duration-200',
  destructive: 'bg-error text-on-dark hover:opacity-90 active:scale-98 transition-all duration-200',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-sm',
      md: 'h-10 px-4 text-sm rounded-sm',
      lg: 'h-11 px-6 text-sm rounded-sm',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex cursor-pointer items-center justify-center font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:transition-transform [&_svg]:duration-200',
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
