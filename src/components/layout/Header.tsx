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
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-cream-light px-4 py-4 sm:px-6">
      <h1 className="text-lg font-semibold text-brown sm:text-xl">{title}</h1>

      <div className="flex items-center gap-3 sm:gap-4">
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
