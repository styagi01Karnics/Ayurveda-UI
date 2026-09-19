import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, KeyRound, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStoredTenant, getStoredUser } from '@/lib/auth';
import { cn, formatPersonName } from '@/lib/utils';

interface UserMenuProps {
  onChangePassword: () => void;
  onLogout: () => void;
}

export function UserMenu({ onChangePassword, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const user = getStoredUser();
  const tenant = getStoredTenant();
  const role = user?.role ?? 'Admin';
  const name = formatPersonName(user?.fullName) || 'User';
  const clinicCity = tenant?.city?.trim() || '';
  const roleLine = clinicCity ? `${role} | ${clinicCity}` : role;

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
    <div className="flex items-center gap-2 sm:gap-3">
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex max-w-[280px] items-center gap-2.5 sm:max-w-[360px]"
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#FBF6E8] text-gold">
            <User className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="hidden min-w-0 text-left sm:block">
            <p className="truncate text-sm font-semibold leading-tight text-brown">
              {name}
            </p>
            <p className="truncate text-xs leading-tight text-text-muted">
              {roleLine}
            </p>
          </div>
          <ChevronDown
            className={cn(
              'hidden h-4 w-4 shrink-0 text-brown transition-transform sm:block',
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

      <span className="hidden h-8 w-px bg-[#e8e0d4] sm:block" aria-hidden />

      <button
        type="button"
        onClick={onLogout}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FBF6E8] text-brown transition-colors hover:bg-[#f5edd9]"
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
