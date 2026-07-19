import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface DataTableShellProps {
  children: ReactNode;
  className?: string;
  /**
   * When embedded inside another card (e.g. ListPanel), drop the card chrome
   * and render only the horizontal-scroll container so borders don't double up.
   */
  embedded?: boolean;
}

/** Keeps wide tables scrollable inside the card, not the whole page. */
export function DataTableShell({
  children,
  className,
  embedded = false,
}: DataTableShellProps) {
  if (embedded) {
    return (
      <div className={cn('w-full min-w-0 overflow-x-auto', className)}>
        {children}
      </div>
    );
  }

  return (
    <Card className={cn('w-full min-w-0 overflow-hidden p-0', className)}>
      {children}
    </Card>
  );
}
