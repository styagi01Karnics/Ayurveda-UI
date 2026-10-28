import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'app-card w-full min-w-0 rounded-2xl border-0 p-5 shadow-[0_0_3px_1px_#be880b1a]',
        className,
      )}
    >
      {children}
    </div>
  );
}
