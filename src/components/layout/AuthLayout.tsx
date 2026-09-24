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
      <div className="login-shell fixed inset-0 z-0 h-dvh overflow-hidden overscroll-none">
        <LoginDecorations />

        <div className="relative z-10 flex h-full w-full items-center overflow-hidden py-4 pl-8 pr-2 sm:pl-12 lg:pl-16 xl:pl-20">
          <div className="login-fit grid h-full max-h-full w-full items-center gap-4 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)]">
            <div className="mx-auto ml-6 flex h-full min-h-0 w-full max-w-[400px] items-center sm:ml-10 lg:mx-0 lg:ml-14 xl:ml-20">
              {children}
            </div>
            {aside ? (
              <div className="hidden h-full min-h-0 min-w-0 items-center justify-end pr-0 lg:flex">
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
