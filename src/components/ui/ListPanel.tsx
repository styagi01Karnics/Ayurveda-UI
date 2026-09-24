import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface ListPanelProps {
  /** Left side of the header row — usually tabs. */
  tabs?: ReactNode;
  /** Right side of the header row — e.g. a view toggle. */
  toolbar?: ReactNode;
  /** Search and filter controls, shown after the page action. */
  filters?: ReactNode;
  /** Primary page action (Book Appointment, Generate Invoice, …) inside the card. */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Unified list surface: tabs + filters + table all live under one white card,
 * matching the prototype. The table content should be rendered with the
 * `embedded` prop so its border doesn't double up with this card.
 */
export function ListPanel({
  tabs,
  toolbar,
  filters,
  actions,
  children,
  className,
}: ListPanelProps) {
  const hasHeader = Boolean(tabs || toolbar || filters || actions);

  return (
    <Card className={cn('dashboard-card overflow-hidden p-0', className)}>
      {hasHeader && (
        <div className="flex flex-col gap-3 p-4 sm:p-5">
          {(tabs || toolbar) && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">{tabs}</div>
              {toolbar ? <div className="shrink-0">{toolbar}</div> : null}
            </div>
          )}
          {(filters || actions) && (
            <div className="flex flex-wrap items-center justify-end gap-3">
              {actions ? (
                <div className="flex h-9 shrink-0 items-center">{actions}</div>
              ) : null}
              {filters ? <FilterBar>{filters}</FilterBar> : null}
            </div>
          )}
        </div>
      )}
      <div className="w-full min-w-0 overflow-x-auto border-t border-[#ebe4d8]">
        {children}
      </div>
    </Card>
  );
}

/** Row of compact, right-aligned filter controls. */
export function FilterBar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-wrap items-center justify-end gap-3',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Fixed-width wrapper so a filter control does not stretch full width. */
export function FilterControl({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'w-[160px] shrink-0 [&>div]:gap-0 [&_input]:h-9 [&_input]:rounded-[10px] [&_select]:h-9 [&_select]:rounded-[10px] [&_button.select-trigger]:h-9 [&_button.select-trigger]:rounded-[10px]',
        className,
      )}
    >
      {children}
    </div>
  );
}
