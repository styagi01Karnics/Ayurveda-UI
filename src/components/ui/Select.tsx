import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SelectOption = string | { value: string; label: string };

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  placeholder?: string;
  options: readonly SelectOption[] | SelectOption[];
  fieldVariant?: 'default' | 'auth';
}

function normalizeOption(option: SelectOption): { value: string; label: string } {
  if (typeof option === 'string') {
    return { value: option, label: option };
  }
  return option;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      id,
      placeholder = 'Select',
      options,
      fieldVariant = 'default',
      ...props
    },
    ref,
  ) => {
    const selectId = id ?? props.name;
    const labelClass =
      fieldVariant === 'auth'
        ? 'text-xs font-medium text-brown'
        : 'text-xs font-medium text-text-muted';

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className={labelClass}>
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-brown focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20',
              !props.value && 'text-gray-400',
              error && 'border-danger focus:border-danger focus:ring-danger/20',
              className,
            )}
            aria-invalid={Boolean(error)}
            {...props}
          >
            <option value="">{placeholder}</option>
            {(options || []).map((option, index) => {
              if (option === null || option === undefined) return null;
              const { value, label: optionLabel } = normalizeOption(option);
              return (
                <option key={`${value}-${index}`} value={value}>
                  {optionLabel}
                </option>
              );
            })}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
        {error && (
          <p className="text-xs text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
