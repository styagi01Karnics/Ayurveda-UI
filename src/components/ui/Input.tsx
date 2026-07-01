import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fieldVariant?: 'default' | 'auth';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, fieldVariant = 'default', id, ...props }, ref) => {
    const inputId = id ?? props.name;
    const labelClass =
      fieldVariant === 'auth'
        ? 'text-xs font-medium text-brown'
        : 'text-xs font-medium text-text-muted';

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className={labelClass}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-brown placeholder:text-gray-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="text-xs text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
