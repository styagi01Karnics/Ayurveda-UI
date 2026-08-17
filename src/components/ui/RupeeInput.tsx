import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface RupeeInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const RupeeInput = forwardRef<HTMLInputElement, RupeeInputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label ? (
          <label htmlFor={inputId} className="text-xs font-medium text-text-muted">
            {label}
          </label>
        ) : null}
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-text-muted">
            ₹
          </span>
          <input
            ref={ref}
            id={inputId}
            type="text"
            inputMode="decimal"
            className={cn(
              'w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-8 pr-4 text-sm text-brown placeholder:text-gray-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20',
              error && 'border-danger focus:border-danger focus:ring-danger/20',
              props.disabled && 'cursor-not-allowed bg-gray-50 text-text-muted',
              className,
            )}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

RupeeInput.displayName = 'RupeeInput';
