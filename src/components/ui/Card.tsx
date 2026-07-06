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
        'w-full min-w-0 rounded-2xl border border-[#f0ebe3] bg-white p-5',
        className,
      )}
    >
      {children}
    </div>
  );
}
