import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Building2, Megaphone, MessageCircle } from 'lucide-react';
import { assets, type NavIconKey } from '@/lib/assets';
import {
  getClinicDisplayName,
  getClinicLogoUrl,
  getStoredPageCodes,
  getStoredUser,
  isSuperAdmin,
} from '@/lib/auth';
import { ALL_PAGE_CODES, hasPageAccess, type PageCode } from '@/lib/pagePermissions';
import { PLATFORM_BRANDING } from '@/lib/platformBranding';
import { PLATFORM_CLINICS_PATH } from '@/app/ProtectedRoute';
import { NavIcon } from '@/components/ui/NavIcon';
import { cn } from '@/lib/utils';

const navItems: {
  to: string;
  label: string;
  pageCode?: PageCode;
  requiresSettings?: boolean;
  superAdminOnly?: boolean;
  icon?: NavIconKey;
  iconify?: { outline: string; filled: string };
  lucide?: 'megaphone' | 'message' | 'clinics';
}[] = [
  { to: '/dashboard', label: 'Dashboard', pageCode: 'DASHBOARD', icon: 'dashboard' },
  {
    to: '/patients',
    label: 'Patients',
    pageCode: 'PATIENTS',
    iconify: {
      outline: 'fluent:person-32-regular',
      filled: 'fluent:person-32-filled',
    },
  },
  {
    to: '/doctors',
    label: 'Doctors',
    pageCode: 'DOCTORS',
    iconify: {
      outline: 'fluent:doctor-24-regular',
      filled: 'fluent:doctor-24-filled',
    },
  },
  {
    to: '/appointments',
    label: 'Appointments',
    pageCode: 'APPOINTMENTS',
    iconify: {
      outline: 'fluent:calendar-person-24-regular',
      filled: 'fluent:calendar-person-32-filled',
    },
  },
  {
    to: '/treatments',
    label: 'Treatments',
    pageCode: 'TREATMENTS',
    iconify: {
      outline: 'fluent:heart-pulse-20-regular',
      filled: 'fluent:heart-pulse-20-filled',
    },
  },
  {
    to: '/medicines',
    label: 'Medicines',
    pageCode: 'MEDICINES',
    iconify: {
      outline: 'fluent:briefcase-medical-20-regular',
      filled: 'fluent:briefcase-medical-20-filled',
    },
  },
  { to: '/sales', label: 'Sales', pageCode: 'SALES', icon: 'sales' },
  {
    to: '/activity-logs',
    label: 'Activity Logs',
    pageCode: 'ACTIVITY_LOG',
    icon: 'activityLogs',
  },
  {
    to: '/billing',
    label: 'Billing',
    pageCode: 'BILLING',
    iconify: {
      outline: 'fluent:document-bullet-list-20-regular',
      filled: 'fluent:document-bullet-list-20-filled',
    },
  },
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
  {
    to: PLATFORM_CLINICS_PATH,
    label: 'Clinics',
    superAdminOnly: true,
    lucide: 'clinics',
  },
];

interface SidebarProps {
  onNavigate?: () => void;
  className?: string;
}

export function Sidebar({ onNavigate, className }: SidebarProps) {
  const user = getStoredUser();
  const superAdmin = isSuperAdmin(user);
  const pageCodes = superAdmin ? ALL_PAGE_CODES : getStoredPageCodes();
  const clinicName = superAdmin
    ? PLATFORM_BRANDING.name
    : getClinicDisplayName();
  const clinicLogo = superAdmin
    ? PLATFORM_BRANDING.logoUrl
    : getClinicLogoUrl() || assets.brandLogo;
  const visibleItems = navItems.filter((item) => {
    if (item.superAdminOnly) return superAdmin;
    if (item.pageCode) return hasPageAccess(pageCodes, item.pageCode);
    if (item.requiresSettings) {
      return hasPageAccess(pageCodes, 'SETTINGS');
    }
    return true;
  });

  return (
    <aside
      className={cn(
        'sidebar-panel flex h-full w-full flex-col py-6 pl-3 pr-0 sm:py-8 sm:pl-4',
        className,
      )}
      style={{ backgroundImage: `url(${assets.sidebarBg})` }}
    >
      <div className="relative z-[1] mb-10 shrink-0 px-1 pr-3 sm:pr-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <img
            src={clinicLogo}
            alt={clinicName}
            className="h-16 w-16 object-contain"
          />
          <p className="w-full break-words font-sans text-[20px] font-semibold uppercase leading-none tracking-normal text-[#422C23]">
            {clinicName}
          </p>
          {!superAdmin ? (
            <p className="mb-1 font-sans text-[14px] font-semibold leading-none tracking-normal text-[#BE880B] normal-case">
              A Journey of Healing
            </p>
          ) : null}
        </div>
      </div>

      <nav className="no-scrollbar flex flex-1 flex-col gap-3 overflow-y-auto pl-1">
        {visibleItems.map(({ to, label, icon, iconify, lucide }) => (
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
                ) : lucide === 'clinics' ? (
                  <Building2
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
