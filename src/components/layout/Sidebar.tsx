import { NavLink } from 'react-router-dom';
import {
  Activity,
  Calendar,
  CreditCard,
  FlaskConical,
  LayoutDashboard,
  Leaf,
  Pill,
  Settings,
  ShoppingCart,
  Stethoscope,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/doctors', label: 'Doctors', icon: Stethoscope },
  { to: '/appointments', label: 'Appointments', icon: Calendar },
  { to: '/treatments', label: 'Treatments', icon: FlaskConical },
  { to: '/medicines', label: 'Medicines', icon: Pill },
  { to: '/sales', label: 'Sales', icon: ShoppingCart },
  { to: '/activity-logs', label: 'Activity Logs', icon: Activity },
  { to: '/billing', label: 'Billing', icon: CreditCard },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const;

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar-texture flex h-full w-64 shrink-0 flex-col border-r border-gold/10 px-4 py-6">
      <div className="mb-8 flex flex-col items-center gap-1 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold">
          <Leaf className="h-6 w-6 text-white" strokeWidth={1.5} />
        </div>
        <p className="text-xs font-bold tracking-wider text-gold">
          GANESHA AYURVEDAA
        </p>
        <p className="font-serif text-xs italic text-brown-muted">
          A Journey of Healing
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white text-gold shadow-sm'
                  : 'text-brown-muted hover:bg-white/60 hover:text-brown',
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
