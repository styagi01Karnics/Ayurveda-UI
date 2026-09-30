import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Megaphone, MessageCircle } from 'lucide-react';
import { assets, type NavIconKey } from '@/lib/assets';
import { NavIcon } from '@/components/ui/NavIcon';
import { cn } from '@/lib/utils';

const navItems: {
  to: string;
  label: string;
  icon?: NavIconKey;
  iconify?: { outline: string; filled: string };
  lucide?: 'megaphone' | 'message';
}[] = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  {
    to: '/patients',
    label: 'Patients',
    iconify: {
      outline: 'fluent:person-32-regular',
      filled: 'fluent:person-32-filled',
    },
  },
  {
    to: '/doctors',
    label: 'Doctors',
    iconify: {
      outline: 'fluent:doctor-24-regular',
      filled: 'fluent:doctor-24-filled',
    },
  },
  {
    to: '/appointments',
    label: 'Appointments',
    iconify: {
      outline: 'fluent:calendar-person-24-regular',
      filled: 'fluent:calendar-person-32-filled',
    },
  },
  {
    to: '/treatments',
    label: 'Treatments',
    iconify: {
      outline: 'fluent:heart-pulse-20-regular',
      filled: 'fluent:heart-pulse-20-filled',
    },
  },
  {
    to: '/medicines',
    label: 'Medicines',
    iconify: {
      outline: 'fluent:briefcase-medical-20-regular',
      filled: 'fluent:briefcase-medical-20-filled',
    },
  },
  { to: '/sales', label: 'Sales', icon: 'sales' },
  { to: '/activity-logs', label: 'Activity Logs', icon: 'activityLogs' },
  {
    to: '/billing',
    label: 'Billing',
    iconify: {
      outline: 'fluent:document-bullet-list-20-regular',
      filled: 'fluent:document-bullet-list-20-filled',
    },
  },
  { to: '/banners', label: 'Banners', lucide: 'megaphone' },
  { to: '/communications', label: 'SMS & Email', lucide: 'message' },
  { to: '/settings', label: 'Settings', icon: 'settings' },
];

interface SidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function Sidebar({ onNavigate, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'sidebar-panel flex h-full w-full flex-col py-7 pl-3 pr-0',
        className,
      )}
      style={{ backgroundImage: `url(${assets.auth.loginBg})` }}
    >
      <div className="mb-8 flex flex-col items-center gap-1.5 px-3 pr-6 text-center">
        <img
          src={assets.brandLogo}
          alt="Ganesha Ayurvedaa"
          className="h-[72px] w-[72px] object-contain"
        />
        <p className="font-sans text-base font-semibold leading-none tracking-normal text-brown">
          GANESHA AYURVEDAA
        </p>
        <p className="font-sans text-xs font-semibold leading-none tracking-normal text-[#BE880B]">
          A Journey of Healing
        </p>
      </div>

      <nav className="no-scrollbar flex flex-1 flex-col gap-3 overflow-y-auto pl-1">
        {navItems.map(({ to, label, icon, iconify, lucide }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3.5 pl-3.5 pr-4 text-base leading-none transition-all',
                isActive
                  ? 'rounded-l-[10px] rounded-r-none bg-white py-4 font-semibold text-gold'
                  : 'rounded-l-[10px] py-3 font-medium text-brown',
              )
            }
          >
            {({ isActive }) => (
              <>
                {iconify ? (
                  <Icon
                    icon={isActive ? iconify.filled : iconify.outline}
                    className={cn(
                      'h-[22px] w-[22px] shrink-0',
                      isActive ? 'text-gold' : 'text-brown',
                    )}
                    aria-hidden
                  />
                ) : lucide === 'megaphone' ? (
                  <Megaphone
                    className={cn(
                      'h-[22px] w-[22px] shrink-0',
                      isActive ? 'text-gold' : 'text-brown',
                    )}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                ) : lucide === 'message' ? (
                  <MessageCircle
                    className={cn(
                      'h-[22px] w-[22px] shrink-0',
                      isActive ? 'text-gold' : 'text-brown',
                    )}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                ) : icon ? (
                  <NavIcon
                    outline={assets.icons.nav[icon].outline}
                    filled={assets.icons.nav[icon].filled}
                    active={isActive}
                    className="[&_svg]:h-[22px] [&_svg]:w-[22px]"
                  />
                ) : null}
                <span className="truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
