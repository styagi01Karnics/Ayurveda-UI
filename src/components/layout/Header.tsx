import type { ReactNode } from 'react';
import { Bell } from 'lucide-react';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  title: string;
  action?: ReactNode;
  onChangePassword: () => void;
  onLogout: () => void;
}

export function Header({
  title,
  action,
  onChangePassword,
  onLogout,
}: HeaderProps) {
  return (
    <header className="flex w-full min-w-0 shrink-0 items-center justify-between gap-3 bg-cream-light px-4 py-4 sm:px-6">
      <h1 className="min-w-0 truncate text-lg font-semibold text-brown sm:text-xl">
        {title}
      </h1>

      <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
        {action}
        <button
          type="button"
          className="rounded-lg p-2 text-brown-muted hover:bg-brown/5"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <UserMenu onChangePassword={onChangePassword} onLogout={onLogout} />
      </div>
    </header>
  );
}
