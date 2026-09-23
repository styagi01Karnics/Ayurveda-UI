import type { ReactNode } from 'react';
import { LoginDecorations } from '@/components/auth/LoginDecorations';
import { SignupDecorations } from '@/components/auth/SignupDecorations';

interface AuthLayoutProps {
  children: ReactNode;
  aside?: ReactNode;
  variant?: 'login' | 'signup' | 'default';
}

export function AuthLayout({
  children,
  aside,
  variant = 'default',
}: AuthLayoutProps) {
  if (variant === 'login') {
    return (
      <div className="login-shell fixed inset-0 z-0 overflow-hidden">
        <LoginDecorations />

        <div className="relative z-10 flex h-full w-full items-center justify-center px-4 py-3 sm:px-6 lg:px-8 lg:py-4 xl:px-12">
          <div className="login-fit grid max-h-full w-full max-w-[1280px] items-center gap-6 lg:grid-cols-[minmax(0,520px)_minmax(0,1fr)] lg:gap-10 xl:grid-cols-[minmax(0,560px)_minmax(0,1fr)] xl:gap-14">
            <div className="mx-auto w-full max-w-[560px] lg:mx-0">
              {children}
            </div>
            {aside ? (
              <div className="hidden min-h-0 min-w-0 items-center justify-center overflow-visible lg:flex">
                {aside}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'signup') {
    return (
      <div className="paper-texture relative min-h-svh overflow-x-hidden overflow-y-auto">
        <SignupDecorations />

        <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-[1060px] items-center px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="paper-texture relative min-h-svh overflow-x-hidden overflow-y-auto px-4 py-8 sm:px-6 lg:px-10">
      <div
        className={`relative z-10 mx-auto flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center gap-8 ${
          aside ? 'max-w-6xl lg:flex-row lg:items-center lg:justify-between' : 'max-w-md'
        }`}
      >
        <div className={`w-full ${aside ? 'lg:max-w-md' : 'max-w-md'}`}>
          {children}
        </div>
        {aside && (
          <div className="hidden w-full max-w-lg lg:block">{aside}</div>
        )}
      </div>
    </div>
  );
}
