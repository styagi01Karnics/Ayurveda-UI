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
      <div className="paper-texture relative h-screen overflow-hidden">
        <LoginDecorations />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1400px] items-center px-4 py-4 sm:px-8 lg:px-12">
          <div className="grid h-full w-full items-center gap-8 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-12 xl:gap-16">
            <div className="flex max-h-full justify-center overflow-y-auto py-2 no-scrollbar lg:justify-start">
              {children}
            </div>
            {aside && (
              <div className="hidden min-h-0 min-w-0 lg:flex lg:items-center lg:justify-center">
                {aside}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'signup') {
    return (
      <div className="paper-texture relative min-h-screen overflow-x-hidden">
        <SignupDecorations />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1060px] items-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="paper-texture relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-10">
      <div
        className={`relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-8 ${
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
