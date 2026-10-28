import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageShellProps {
  children: ReactNode;
  className?: string;
}

/** Constrains page content to the available main area — prevents horizontal page scroll. */
export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cn('w-full min-w-0', className)}>{children}</div>
  );
}
