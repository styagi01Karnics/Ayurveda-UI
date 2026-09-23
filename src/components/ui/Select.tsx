import {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type SelectHTMLAttributes,
} from 'react';
import { ChevronDown } from 'lucide-react';
import { FieldLabel } from '@/components/ui/FieldLabel';
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
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref,
  ) => {
    const selectId = id ?? props.name;
    const labelClass =
      fieldVariant === 'auth'
        ? 'text-xs font-medium text-brown'
        : 'text-xs font-medium text-text-muted';
    const [selectedValue, setSelectedValue] = useState(
      () => String(value ?? defaultValue ?? ''),
    );

    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(String(value));
      }
    }, [value]);

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(event.target.value);
        onChange?.(event);
      },
      [onChange],
    );

    const setRefs = useCallback(
      (node: HTMLSelectElement | null) => {
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
        if (node && value === undefined) {
          setSelectedValue(node.value);
        }
      },
      [ref, value],
    );

    const hasValue = selectedValue !== '';

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <FieldLabel htmlFor={selectId} label={label} className={labelClass} />
        )}
        <div className="relative">
          <select
            ref={setRefs}
            id={selectId}
            {...(value !== undefined ? { value } : { defaultValue })}
            onChange={handleChange}
            className={cn(
              'w-full appearance-none rounded-lg px-4 pr-10 focus:outline-none focus:ring-2',
              fieldVariant === 'auth'
                ? 'border border-gray-200 bg-white py-2.5 text-sm focus:border-gold focus:ring-gold/20'
                : 'border border-[#EFF0F6] bg-white py-2 font-sans text-[12px] font-medium leading-6 focus:border-gold focus:ring-gold/20',
              hasValue ? 'text-[#422C23]' : fieldVariant === 'auth' ? 'text-gray-400' : 'text-[#67554D]/70',
              error && 'border-danger focus:border-danger focus:ring-danger/20',
              className,
            )}
            aria-invalid={Boolean(error)}
            {...props}
          >
            <option value="" className="bg-white text-[#422C23]">
              {placeholder}
            </option>
            {(options || []).map((option, index) => {
              if (option === null || option === undefined) return null;
              const { value, label: optionLabel } = normalizeOption(option);
              return (
                <option
                  key={`${value}-${index}`}
                  value={value}
                  className="bg-white text-[#422C23]"
                >
                  {optionLabel}
                </option>
              );
            })}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#422C23]" />
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
