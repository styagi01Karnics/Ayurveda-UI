import { NavLink } from 'react-router-dom';
import {
  BriefcaseMedical,
  Building2,
  CalendarDays,
  ChartColumn,
  FileText,
  Heart,
  History,
  LayoutGrid,
  Megaphone,
  MessageCircle,
  Settings,
  User,
} from 'lucide-react';
import { assets } from '@/lib/assets';
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
import { MedicalCross, NavIcon, type NavGlyph } from '@/components/ui/NavIcon';
import { cn } from '@/lib/utils';

const navItems: {
  to: string;
  label: string;
  pageCode?: PageCode;
  requiresSettings?: boolean;
  superAdminOnly?: boolean;
  icon: NavGlyph;
}[] = [
  { to: '/dashboard', label: 'Dashboard', pageCode: 'DASHBOARD', icon: LayoutGrid },
  { to: '/patients', label: 'Patients', pageCode: 'PATIENTS', icon: User },
  { to: '/doctors', label: 'Doctors', pageCode: 'DOCTORS', icon: MedicalCross },
  {
    to: '/appointments',
    label: 'Appointments',
    pageCode: 'APPOINTMENTS',
    icon: CalendarDays,
  },
  { to: '/treatments', label: 'Treatments', pageCode: 'TREATMENTS', icon: Heart },
  { to: '/medicines', label: 'Medicines', pageCode: 'MEDICINES', icon: BriefcaseMedical },
  { to: '/sales', label: 'Sales', pageCode: 'SALES', icon: ChartColumn },
  {
    to: '/activity-logs',
    label: 'Activity Logs',
    pageCode: 'ACTIVITY_LOG',
    icon: History,
  },
  { to: '/billing', label: 'Billing', pageCode: 'BILLING', icon: FileText },
  {
    to: '/banners',
    label: 'Banners',
    requiresSettings: true,
    icon: Megaphone,
  },
  {
    to: '/communications',
    label: 'SMS & Email',
    requiresSettings: true,
    icon: MessageCircle,
  },
  { to: '/settings', label: 'Settings', pageCode: 'SETTINGS', icon: Settings },
  {
    to: PLATFORM_CLINICS_PATH,
    label: 'Clinics',
    superAdminOnly: true,
    icon: Building2,
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

      <nav className="no-scrollbar flex flex-1 flex-col gap-0.5 overflow-y-auto">
        {visibleItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 py-2.5 pl-3.5 pr-3 transition-colors',
                isActive
                  ? 'rounded-l-xl bg-cream-light font-sans text-[16px] font-semibold leading-none tracking-normal text-[#BE880B]'
                  : 'rounded-l-xl font-sans text-sm font-medium text-brown hover:bg-cream-light/50',
              )
            }
          >
            {({ isActive }) => (
              <>
                <NavIcon icon={icon} active={isActive} />
                <span className="truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
