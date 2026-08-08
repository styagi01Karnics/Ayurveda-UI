import { NavLink } from 'react-router-dom';
import { Megaphone, MessageCircle, Stethoscope } from 'lucide-react';
import { assets, type NavIconKey } from '@/lib/assets';
import { NavIcon } from '@/components/ui/NavIcon';
import { cn } from '@/lib/utils';

const navItems: {
  to: string;
  label: string;
  icon?: NavIconKey;
  lucide?: 'stethoscope' | 'megaphone' | 'message';
}[] = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/patients', label: 'Patients', icon: 'patients' },
  { to: '/doctors', label: 'Doctors', lucide: 'stethoscope' },
  { to: '/appointments', label: 'Appointments', icon: 'appointments' },
  { to: '/treatments', label: 'Treatments', icon: 'treatments' },
  { to: '/medicines', label: 'Medicines', icon: 'medicines' },
  { to: '/sales', label: 'Sales', icon: 'sales' },
  { to: '/activity-logs', label: 'Activity Logs', icon: 'activityLogs' },
  { to: '/billing', label: 'Billing', icon: 'billing' },
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
        'sidebar-panel flex h-full w-full flex-col px-4 py-8',
        className,
      )}
      style={{ backgroundImage: `url(${assets.sidebarBg})` }}
    >
      <div className="mb-10 flex flex-col items-center gap-2 px-1 text-center">
        <img
          src={assets.brandLogo}
          alt="Ganesha Ayurvedaa"
          className="h-14 w-14 object-contain"
        />
        <p className="font-serif text-[11px] font-semibold tracking-[0.12em] text-brown">
          GANESHA AYURVEDAA
        </p>
        <p className="font-serif text-[11px] italic text-gold">
          A Journey of Healing
        </p>
      </div>

      <nav className="no-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto pr-1">
        {navItems.map(({ to, label, icon, lucide }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all',
                isActive
                  ? 'bg-white font-semibold text-gold shadow-[0_2px_12px_rgba(66,44,35,0.08)]'
                  : 'font-medium text-brown hover:bg-white/45',
              )
            }
          >
            {({ isActive }) => (
              <>
                {lucide === 'stethoscope' ? (
                  <Stethoscope
                    className={cn(
                      'h-[22px] w-[22px] shrink-0',
                      isActive ? 'text-gold' : 'text-brown',
                    )}
                    strokeWidth={1.5}
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
