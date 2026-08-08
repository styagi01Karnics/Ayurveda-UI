import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  message: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  message,
  description,
  icon: Icon = Inbox,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-100 bg-white text-center',
        compact ? 'px-4 py-8' : 'px-4 py-10',
        className,
      )}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brown/5">
        <Icon className="h-5 w-5 text-text-muted" strokeWidth={1.5} />
      </div>
      <p className="mt-3 text-sm font-medium text-brown">{message}</p>
      {description && (
        <p className="mt-1 text-xs text-text-muted">{description}</p>
      )}
    </div>
  );
}
