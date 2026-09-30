import { ToastViewport } from '@/app/ToastContext';
import { NotificationBell } from './NotificationBell';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  title: string;
  onChangePassword: () => void;
  onLogout: () => void;
}

export function Header({
  title,
  onChangePassword,
  onLogout,
}: HeaderProps) {
  return (
    <header className="flex w-full min-w-0 shrink-0 items-center justify-between gap-3 bg-cream-light px-5 py-4 sm:px-6">
      <h1 className="min-w-0 truncate text-lg font-semibold text-brown sm:text-xl">
        {title}
      </h1>

      <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
        <NotificationBell />
        <UserMenu onChangePassword={onChangePassword} onLogout={onLogout} />
      </div>

      <div className="pointer-events-none absolute right-4 top-[calc(100%-4px)] z-50 sm:right-6">
        <ToastViewport className="pointer-events-auto" />
      </div>
    </header>
  );
}
