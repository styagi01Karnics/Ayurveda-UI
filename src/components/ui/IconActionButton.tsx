import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IconActionButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function IconActionButton({
  children,
  className,
  type = 'button',
  ...props
}: IconActionButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#FBF6E8] hover:bg-[#F3EAD4]',
        className,
      )}
      style={{ border: '0.23px solid #BE880B' }}
      {...props}
    >
      {children}
    </button>
  );
}
