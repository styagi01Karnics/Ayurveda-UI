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
      <div className="paper-texture relative min-h-screen">
        <LoginDecorations />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1449px] items-center px-5 py-10 sm:px-8 lg:px-14 xl:px-20">
          <div className="grid w-full items-center gap-10 lg:grid-cols-[440px_1fr] lg:gap-16 xl:gap-24">
            <div className="flex justify-center lg:justify-start">{children}</div>
            {aside && (
              <div className="hidden lg:flex lg:items-center lg:justify-center">
                {aside}
              </div>
            )}
          </div>
        </div>

        {aside && (
          <div className="relative z-10 flex justify-center px-4 pb-12 lg:hidden">
            {aside}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'signup') {
    return (
      <div className="paper-texture relative min-h-screen">
        <SignupDecorations />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[980px] items-center px-4 py-10 sm:px-6 lg:px-8">
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
