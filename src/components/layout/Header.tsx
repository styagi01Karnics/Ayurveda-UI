import type { ReactNode } from 'react';
import { NotificationBell } from './NotificationBell';
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
      <h1 className="min-w-0 truncate font-plex text-[14px] font-normal leading-[18px] tracking-[0.16px] text-[#161616]">
        {title}
      </h1>

      <div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
        {action}
        <NotificationBell />
        <UserMenu onChangePassword={onChangePassword} onLogout={onLogout} />
      </div>
    </header>
  );
}
