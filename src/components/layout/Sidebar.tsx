import { NavLink } from 'react-router-dom';
import { Megaphone, MessageCircle, Stethoscope } from 'lucide-react';
import { assets, type NavIconKey } from '@/lib/assets';
import {
  getClinicDisplayName,
  getClinicLogoUrl,
  getStoredPageCodes,
} from '@/lib/auth';
import { hasPageAccess, type PageCode } from '@/lib/pagePermissions';
import { NavIcon } from '@/components/ui/NavIcon';
import { cn } from '@/lib/utils';

const navItems: {
  to: string;
  label: string;
  pageCode?: PageCode;
  /** Extra items without a seeded pageCode — only when SETTINGS or full access. */
  requiresSettings?: boolean;
  icon?: NavIconKey;
  lucide?: 'stethoscope' | 'megaphone' | 'message';
}[] = [
  { to: '/dashboard', label: 'Dashboard', pageCode: 'DASHBOARD', icon: 'dashboard' },
  { to: '/patients', label: 'Patients', pageCode: 'PATIENTS', icon: 'patients' },
  { to: '/doctors', label: 'Doctors', pageCode: 'DOCTORS', lucide: 'stethoscope' },
  {
    to: '/appointments',
    label: 'Appointments',
    pageCode: 'APPOINTMENTS',
    icon: 'appointments',
  },
  { to: '/treatments', label: 'Treatments', pageCode: 'TREATMENTS', icon: 'treatments' },
  { to: '/medicines', label: 'Medicines', pageCode: 'MEDICINES', icon: 'medicines' },
  { to: '/sales', label: 'Sales', pageCode: 'SALES', icon: 'sales' },
  {
    to: '/activity-logs',
    label: 'Activity Logs',
    pageCode: 'ACTIVITY_LOG',
    icon: 'activityLogs',
  },
  { to: '/billing', label: 'Billing', pageCode: 'BILLING', icon: 'billing' },
  {
    to: '/banners',
    label: 'Banners',
    requiresSettings: true,
    lucide: 'megaphone',
  },
  {
    to: '/communications',
    label: 'SMS & Email',
    requiresSettings: true,
    lucide: 'message',
  },
  { to: '/settings', label: 'Settings', pageCode: 'SETTINGS', icon: 'settings' },
];

interface SidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function Sidebar({ onNavigate, className }: SidebarProps) {
  const pageCodes = getStoredPageCodes();
  const clinicName = getClinicDisplayName();
  const clinicLogo = getClinicLogoUrl() || assets.brandLogo;
  const visibleItems = navItems.filter((item) => {
    if (item.pageCode) return hasPageAccess(pageCodes, item.pageCode);
    if (item.requiresSettings) {
      return hasPageAccess(pageCodes, 'SETTINGS');
    }
    return true;
  });

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
          src={clinicLogo}
          alt={clinicName}
          className="h-14 w-14 object-contain"
        />
        <p className="font-serif text-[11px] font-semibold tracking-[0.12em] text-brown uppercase">
          {clinicName}
        </p>
        <p className="font-serif text-[11px] italic text-gold">
          A Journey of Healing
        </p>
      </div>

      <nav className="no-scrollbar flex flex-1 flex-col gap-1 overflow-y-auto pr-1">
        {visibleItems.map(({ to, label, icon, lucide }) => (
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
