import { NavLink } from 'react-router-dom';
import { assets, type NavIconKey } from '@/lib/assets';
import { AppIcon } from '@/components/ui/AppIcon';
import { cn } from '@/lib/utils';

const navItems: { to: string; label: string; icon: NavIconKey }[] = [
  { to: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
  { to: '/patients', label: 'Patients', icon: 'patients' },
  { to: '/doctors', label: 'Doctors', icon: 'doctors' },
  { to: '/appointments', label: 'Appointments', icon: 'appointments' },
  { to: '/treatments', label: 'Treatments', icon: 'treatments' },
  { to: '/medicines', label: 'Medicines', icon: 'medicines' },
  { to: '/sales', label: 'Sales', icon: 'sales' },
  { to: '/activity-logs', label: 'Activity Logs', icon: 'activityLogs' },
  { to: '/billing', label: 'Billing', icon: 'billing' },
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
        'sidebar-panel flex h-full w-full flex-col px-5 py-8',
        className,
      )}
      style={{ backgroundImage: `url(${assets.sidebarBg})` }}
    >
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
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

      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#faf6ee] text-gold shadow-sm'
                  : 'text-brown-muted hover:bg-white/50 hover:text-brown',
              )
            }
          >
            {({ isActive }) => (
              <>
                <AppIcon
                  src={assets.icons.nav[icon]}
                  className="h-5 w-5 shrink-0"
                  active={isActive}
                />
                <span className="truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
