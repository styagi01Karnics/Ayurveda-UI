import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, KeyRound, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStoredUser } from '@/lib/auth';
import { cn } from '@/lib/utils';

interface UserMenuProps {
  onChangePassword: () => void;
  onLogout: () => void;
}

export function UserMenu({ onChangePassword, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const user = getStoredUser();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="flex items-center gap-1">
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-xl bg-white px-2 py-1.5 shadow-sm"
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gold/20 text-sm font-semibold text-gold">
            {user?.fullName?.charAt(0) ?? 'R'}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold text-brown">
              {user?.fullName ?? 'Rahul Sharma'}
            </p>
            <p className="text-xs text-text-muted">{user?.role ?? 'Super Admin'}</p>
          </div>
          <ChevronDown
            className={cn(
              'hidden h-4 w-4 text-text-muted transition-transform sm:block',
              open && 'rotate-180',
            )}
          />
        </button>

        {open && (
          <div
            className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-gray-100 bg-white py-1 shadow-lg"
            role="menu"
          >
            <MenuItem
              icon={<User className="h-4 w-4" />}
              label="My Profile"
              onClick={() => setOpen(false)}
              as={Link}
              to="/profile"
            />
            <MenuItem
              icon={<KeyRound className="h-4 w-4" />}
              label="Change Password"
              onClick={() => {
                setOpen(false);
                onChangePassword();
              }}
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="rounded-lg p-2 text-brown-muted hover:bg-brown/5"
        aria-label="Logout"
      >
        <LogOut className="h-5 w-5" strokeWidth={1.5} />
      </button>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  as: Component = 'button',
  to,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  as?: 'button' | typeof Link;
  to?: string;
}) {
  const className =
    'flex w-full items-center gap-3 px-4 py-2.5 text-sm text-brown hover:bg-cream';

  if (Component === Link && to) {
    return (
      <Link to={to} className={className} role="menuitem" onClick={onClick}>
        <span className="text-gold">{icon}</span>
        {label}
      </Link>
    );
  }

  return (
    <button type="button" className={className} role="menuitem" onClick={onClick}>
      <span className="text-gold">{icon}</span>
      {label}
    </button>
  );
}
