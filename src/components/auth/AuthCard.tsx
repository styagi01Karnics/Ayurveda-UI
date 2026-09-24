import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        'app-card w-full rounded-[20px] shadow-[0_10px_48px_rgba(66,44,35,0.1)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

interface AuthFormSectionProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthFormSection({ title, subtitle, children }: AuthFormSectionProps) {
  return (
    <section className="app-card rounded-xl p-5 sm:p-6">
      <h3 className="text-base font-bold text-brown">{title}</h3>
      <p className="mb-5 text-sm text-text-muted">{subtitle}</p>
      {children}
    </section>
  );
}
