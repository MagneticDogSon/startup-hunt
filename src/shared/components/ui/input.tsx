import { cn } from '@/shared/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
