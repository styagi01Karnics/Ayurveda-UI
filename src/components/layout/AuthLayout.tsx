import type { ReactNode } from 'react';
import { LoginDecorations } from '@/components/auth/LoginDecorations';

interface AuthLayoutProps {
  children: ReactNode;
  aside?: ReactNode;
  wide?: boolean;
  variant?: 'login' | 'default';
}

export function AuthLayout({
  children,
  aside,
  wide = false,
  variant = 'default',
}: AuthLayoutProps) {
  if (variant === 'login') {
    return (
      <div className="paper-texture relative min-h-screen overflow-hidden">
        <LoginDecorations />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-[1449px] flex-col items-center justify-center px-4 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-16 xl:px-20">
          <div className="flex w-full justify-center lg:w-auto lg:justify-end">
            {children}
          </div>
          {aside && (
            <div className="mt-10 hidden w-full max-w-xl flex-1 lg:mt-0 lg:block">
              {aside}
            </div>
          )}
        </div>

        {/* Dosha diagram on mobile — below card */}
        {aside && (
          <div className="relative z-10 flex justify-center px-4 pb-12 lg:hidden">
            {aside}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="paper-texture relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
      <div
        className={`relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-8 ${
          aside
            ? 'max-w-6xl lg:flex-row lg:items-center lg:justify-between'
            : wide
              ? 'max-w-4xl'
              : 'max-w-md'
        }`}
      >
        <div
          className={`w-full ${aside ? 'lg:max-w-md' : wide ? 'max-w-4xl' : 'max-w-md'}`}
        >
          {children}
        </div>
        {aside && (
          <div className="hidden w-full max-w-lg lg:block">{aside}</div>
        )}
      </div>
    </div>
  );
}
