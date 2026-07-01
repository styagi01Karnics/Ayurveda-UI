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
        'w-full rounded-2xl bg-white shadow-[0_8px_40px_rgba(60,42,33,0.08)]',
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
    <section className="rounded-xl border border-[#e8e4dc] p-5 sm:p-6">
      <h3 className="text-base font-bold text-brown">{title}</h3>
      <p className="mb-5 text-sm text-text-muted">{subtitle}</p>
      {children}
    </section>
  );
}
