import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface DataTableShellProps {
  children: ReactNode;
  className?: string;
}

/** Keeps wide tables scrollable inside the card, not the whole page. */
export function DataTableShell({ children, className }: DataTableShellProps) {
  return (
    <Card
      className={cn(
        'w-full min-w-0 overflow-hidden p-0',
        className,
      )}
    >
      {children}
    </Card>
  );
}
