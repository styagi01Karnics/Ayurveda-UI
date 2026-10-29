import { assets } from '@/lib/assets';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  className?: string;
  label?: string;
  /** Compact inline loader (smaller logo). */
  compact?: boolean;
}

/** Shared loading UI — shows app logo everywhere while data loads. */
export function LoadingState({
  className,
  label = 'Loading…',
  compact = false,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 text-center',
        compact ? 'px-3 py-6' : 'px-4 py-12',
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <img
        src={assets.appLogo}
        alt=""
        className={cn(
          'object-contain opacity-90',
          compact ? 'h-12 w-12' : 'h-16 w-16 sm:h-20 sm:w-20',
        )}
      />
      <p className="text-sm text-text-muted">{label}</p>
    </div>
  );
}
