import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface ListPanelProps {
  /** Left side of the header row — usually tabs. */
  tabs?: ReactNode;
  /** Right side of the header row — e.g. a view toggle. */
  toolbar?: ReactNode;
  /** Compact, right-aligned filter controls shown below the tabs. */
  filters?: ReactNode;
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
  children,
  className,
}: ListPanelProps) {
  const hasHeader = Boolean(tabs || toolbar || filters);

  return (
    <Card className={cn('overflow-hidden p-0', className)}>
      {hasHeader && (
        <div className="flex flex-col gap-1 p-4 sm:p-5">
          {(tabs || toolbar) && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              {tabs}
              {toolbar}
            </div>
          )}
          {filters && <FilterBar>{filters}</FilterBar>}
        </div>
      )}
      <div className="w-full min-w-0 overflow-x-auto">{children}</div>
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
        'flex flex-wrap items-center gap-3 sm:justify-end',
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
  return <div className={cn('w-full sm:w-44', className)}>{children}</div>;
}
