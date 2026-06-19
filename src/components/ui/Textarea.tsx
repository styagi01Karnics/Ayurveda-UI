import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const textareaId = id ?? props.name;

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-medium text-text-muted"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-brown placeholder:text-gray-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            className,
          )}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {error && (
          <p className="text-xs text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
