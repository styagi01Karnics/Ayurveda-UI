import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type SelectHTMLAttributes,
} from 'react';
import { createPortal } from 'react-dom';
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
  const value = String(option.value ?? '');
  const label = String(option.label ?? '').trim() || value;
  return { value, label };
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
      onBlur,
      disabled,
      ...props
    },
    ref,
  ) => {
    const selectId = id ?? props.name;
    const labelClass =
      fieldVariant === 'auth'
        ? 'align-middle font-sans text-[13px] font-medium leading-none tracking-normal text-[#404040]'
        : 'field-label';
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(
      () => String(value ?? defaultValue ?? ''),
    );
    const [menuBox, setMenuBox] = useState<{
      top: number;
      left: number;
      width: number;
    }>({ top: 0, left: 0, width: 0 });
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const menuRef = useRef<HTMLUListElement | null>(null);
    const hiddenRef = useRef<HTMLSelectElement | null>(null);

    useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(String(value));
      }
    }, [value]);

    const updateMenuBox = useCallback(() => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const box = trigger.getBoundingClientRect();
      setMenuBox({
        top: box.bottom + 4,
        left: box.left,
        width: box.width,
      });
    }, []);

    useLayoutEffect(() => {
      if (!open) return;
      updateMenuBox();
    }, [open, updateMenuBox, options]);

    useEffect(() => {
      if (!open) return;
      const onWin = () => updateMenuBox();
      window.addEventListener('resize', onWin);
      window.addEventListener('scroll', onWin, true);
      return () => {
        window.removeEventListener('resize', onWin);
        window.removeEventListener('scroll', onWin, true);
      };
    }, [open, updateMenuBox]);

    useEffect(() => {
      const handleClick = (event: MouseEvent) => {
        const target = event.target as Node;
        if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) {
          return;
        }
        setOpen(false);
      };
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const setRefs = useCallback(
      (node: HTMLSelectElement | null) => {
        hiddenRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
        if (node && value === undefined) {
          setSelectedValue(node.value);
        }
      },
      [ref, value],
    );

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(event.target.value);
        onChange?.(event);
      },
      [onChange],
    );

    const pick = (next: string) => {
      setSelectedValue(next);
      setOpen(false);
      const node = hiddenRef.current;
      if (!node) {
        onChange?.({
          target: { value: next, name: props.name },
          currentTarget: { value: next, name: props.name },
        } as ChangeEvent<HTMLSelectElement>);
        return;
      }
      const setter = Object.getOwnPropertyDescriptor(
        HTMLSelectElement.prototype,
        'value',
      )?.set;
      setter?.call(node, next);
      node.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const normalized = (options || [])
      .filter((option) => option != null)
      .map(normalizeOption)
      .filter((option) => option.value !== '');
    const selectedLabel =
      normalized.find((option) => option.value === selectedValue)?.label ?? '';
    const hasValue = selectedValue !== '';

    const menu = open ? (
      <ul
        ref={menuRef}
        className="max-h-56 overflow-auto rounded-lg border border-[#EFF0F6] bg-white py-1.5 shadow-[0_0_3px_1px_#BE880B26]"
        role="listbox"
        style={{
          position: 'fixed',
          top: menuBox.top,
          left: menuBox.left,
          width: menuBox.width,
          zIndex: 80,
        }}
      >
        <li role="option" aria-selected={!hasValue}>
          <button
            type="button"
            className={cn(
              'w-full px-4 py-2.5 text-left font-sans text-xs font-semibold',
              !hasValue
                ? 'bg-[#422C23] text-white'
                : 'text-[#422C23] hover:bg-[#FBF6E8]',
            )}
            onClick={() => pick('')}
          >
            {placeholder}
          </button>
        </li>
        {normalized.map((option, index) => {
          const active = option.value === selectedValue;
          return (
            <li
              key={`${option.value}-${index}`}
              role="option"
              aria-selected={active}
            >
              <button
                type="button"
                className={cn(
                  'w-full px-4 py-2.5 text-left font-sans text-xs font-semibold',
                  active
                    ? 'bg-[#422C23] text-white'
                    : 'text-[#422C23] hover:bg-[#FBF6E8]',
                )}
                onClick={() => pick(option.value)}
              >
                {option.label}
              </button>
            </li>
          );
        })}
      </ul>
    ) : null;

    return (
      <div ref={rootRef} className="relative flex w-full flex-col gap-1.5">
        {label && (
          <FieldLabel htmlFor={selectId} label={label} className={labelClass} />
        )}
        <select
          {...props}
          ref={setRefs}
          id={selectId}
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          disabled={disabled}
          onChange={handleChange}
          onBlur={onBlur}
          {...(value !== undefined ? { value } : {})}
          {...(value === undefined && defaultValue !== undefined
            ? { defaultValue }
            : {})}
        >
          <option value="">{placeholder}</option>
          {normalized.map((option, index) => (
            <option key={`${option.value}-${index}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={selectId}
          onBlur={() => {
            const node = hiddenRef.current;
            if (!node) return;
            onBlur?.({
              target: node,
              currentTarget: node,
            } as Parameters<NonNullable<typeof onBlur>>[0]);
          }}
          onClick={() => !disabled && setOpen((current) => !current)}
          className={cn(
            'select-trigger flex w-full items-center justify-between rounded-lg px-4 pr-3 text-left focus:outline-none focus:ring-2',
            fieldVariant === 'auth'
              ? 'border border-gray-200 bg-white py-2.5 text-[13px] focus:border-gold focus:ring-gold/20'
              : 'border border-[#EFF0F6] bg-white py-2 font-sans text-[12px] font-medium leading-6 focus:border-gold focus:ring-gold/20',
            hasValue
              ? 'text-[#161616]'
              : fieldVariant === 'auth'
                ? 'text-gray-400'
                : 'text-[#67554D]/70',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            disabled && 'cursor-not-allowed opacity-60',
            className,
          )}
        >
          <span className="min-w-0 truncate">
            {hasValue ? selectedLabel : placeholder}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-[#422C23]" />
        </button>

        {open && typeof document !== 'undefined'
          ? createPortal(menu, document.body)
          : null}

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
