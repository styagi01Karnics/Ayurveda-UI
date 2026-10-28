import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  showStateLabel?: boolean;
}

export function Toggle({
  checked,
  onChange,
  label,
  showStateLabel = false,
}: ToggleProps) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 overflow-hidden rounded-xl bg-[#faf6ee] px-4 py-3.5">
      <span className="min-w-0 truncate text-sm text-brown">{label}</span>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          onClick={() => onChange(!checked)}
          className={cn(
            'relative h-6 w-11 shrink-0 overflow-hidden rounded-full transition-colors',
            checked ? 'bg-success' : 'bg-gray-300',
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-[left,right]',
              checked ? 'right-0.5 left-auto' : 'left-0.5 right-auto',
            )}
          />
        </button>
        {showStateLabel ? (
          <span
            className={cn(
              'w-6 shrink-0 text-xs font-medium',
              checked ? 'text-success' : 'text-text-muted',
            )}
          >
            {checked ? 'On' : 'Off'}
          </span>
        ) : null}
      </div>
    </div>
  );
}
