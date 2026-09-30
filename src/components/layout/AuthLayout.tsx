import type { ReactNode } from 'react';
import { LoginDecorations } from '@/components/auth/LoginDecorations';
import { SignupDecorations } from '@/components/auth/SignupDecorations';
import { assets } from '@/lib/assets';

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
      <div
        className="relative h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${assets.auth.loginBg})` }}
      >
        <LoginDecorations />

        <div className="relative z-10 flex h-full w-full items-center justify-center px-8 pb-28 pt-8 sm:px-12 lg:px-16">
          <div className="flex w-full max-w-[1340px] items-center gap-12 lg:gap-16 xl:gap-20">
            <div className="flex w-full max-w-[510px] shrink-0 justify-start">
              {children}
            </div>
            {aside && (
              <div className="hidden min-w-0 flex-1 lg:flex lg:items-center lg:justify-center">
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
      <div
        className="relative min-h-screen overflow-x-hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${assets.auth.loginBg})` }}
      >
        <SignupDecorations />

        <div className="relative z-10 flex min-h-screen w-full items-start justify-center px-4 py-16 sm:px-6 lg:justify-start lg:px-0 lg:pl-20 lg:pr-16 lg:pt-[139px] lg:pb-16">
          <div className="w-full max-w-[1159px]">{children}</div>
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
