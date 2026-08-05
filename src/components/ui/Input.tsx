import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
} from 'react';
import { cn } from '@/lib/utils';

export const DATE_INPUT_PLACEHOLDER = 'DD/MM/YYYY';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fieldVariant?: 'default' | 'auth';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      fieldVariant = 'default',
      id,
      type,
      value,
      defaultValue,
      onChange,
      placeholder,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? props.name;
    const isDate = type === 'date';
    const innerRef = useRef<HTMLInputElement | null>(null);
    const [filled, setFilled] = useState(() =>
      isDate ? Boolean(value ?? defaultValue) : true,
    );

    const syncFilledFromDom = useCallback(() => {
      if (!isDate || !innerRef.current) return;
      setFilled(Boolean(innerRef.current.value));
    }, [isDate]);

    useLayoutEffect(() => {
      syncFilledFromDom();
    }, [syncFilledFromDom, value, defaultValue]);

    useEffect(() => {
      if (!isDate || value === undefined) return;
      setFilled(Boolean(value));
    }, [isDate, value]);

    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
        if (isDate && node) {
          setFilled(Boolean(node.value));
        }
      },
      [ref, isDate],
    );

    const labelClass =
      fieldVariant === 'auth'
        ? 'text-xs font-medium text-brown'
        : 'text-xs font-medium text-text-muted';

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isDate) {
        setFilled(Boolean(event.target.value));
      }
      onChange?.(event);
    };

    const inputElement = (
      <input
        ref={setRefs}
        id={inputId}
        type={type}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        onInput={isDate ? syncFilledFromDom : undefined}
        placeholder={isDate ? undefined : placeholder}
        className={cn(
          'w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-brown placeholder:text-gray-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20',
          isDate && 'date-field',
          isDate && !filled && 'date-field-empty',
          error && 'border-danger focus:border-danger focus:ring-danger/20',
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
    );

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className={labelClass}>
            {label}
          </label>
        )}
        {isDate ? (
          <div className="relative">
            {inputElement}
            {!filled && (
              <span
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400"
                aria-hidden
              >
                {DATE_INPUT_PLACEHOLDER}
              </span>
            )}
          </div>
        ) : (
          inputElement
        )}
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
