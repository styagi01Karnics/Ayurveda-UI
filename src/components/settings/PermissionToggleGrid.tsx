import { PAGE_CODE_LABELS, type PageCode } from '@/lib/pagePermissions';
import { cn } from '@/lib/utils';

interface PermissionToggleGridProps {
  modules: readonly PageCode[];
  selected: string[];
  onToggle?: (pageCode: string) => void;
  readOnly?: boolean;
}

export function PermissionToggleGrid({
  modules,
  selected,
  onToggle,
  readOnly = false,
}: PermissionToggleGridProps) {
  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
      {modules.map((pageCode) => {
        const on = selected.includes(pageCode);
        return (
          <PermissionSwitch
            key={pageCode}
            label={PAGE_CODE_LABELS[pageCode] ?? pageCode}
            checked={on}
            readOnly={readOnly}
            onChange={() => onToggle?.(pageCode)}
          />
        );
      })}
    </div>
  );
}

export function PermissionSwitch({
  label,
  checked,
  onChange,
  readOnly = false,
}: {
  label: string;
  checked: boolean;
  onChange?: () => void;
  readOnly?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-sans text-sm font-medium text-[#422C23]">{label}</span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          disabled={readOnly}
          onClick={onChange}
          className={cn(
            'relative h-6 w-11 shrink-0 rounded-full transition-colors',
            checked ? 'bg-[#2E7D32]' : 'bg-[#D4D4D4]',
            readOnly && 'cursor-default',
          )}
        >
          <span
            className={cn(
              'pointer-events-none absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-[left]',
              checked ? 'left-[22px]' : 'left-0.5',
            )}
          />
        </button>
        <span
          className={cn(
            'w-6 font-sans text-xs font-medium',
            checked ? 'text-[#2E7D32]' : 'text-[#838A9A]',
          )}
        >
          {checked ? 'On' : 'Off'}
        </span>
      </div>
    </div>
  );
}
