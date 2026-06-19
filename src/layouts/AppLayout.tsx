import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  Stethoscope,
  CalendarDays,
  HeartPulse,
  Pill,
  BarChart3,
  History,
  Receipt,
  Settings,
} from "lucide-react";
import { images } from "../assets/images";
import { navItems } from "../data/mockData";

const iconMap = {
  "layout-grid": LayoutGrid,
  users: Users,
  stethoscope: Stethoscope,
  "calendar-days": CalendarDays,
  "heart-pulse": HeartPulse,
  pill: Pill,
  "bar-chart-3": BarChart3,
  history: History,
  receipt: Receipt,
  settings: Settings,
} as const;

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[291px] flex-col border-r border-stroke bg-cream">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${images.sidebarBg})`,
          backgroundSize: "cover",
        }}
      />
      <div className="relative flex flex-col px-[18px] py-10">
        <div className="mb-2 flex flex-col items-center">
          <div className="mb-3 size-[47px] overflow-hidden rounded-full border border-gold">
            <img src={images.logo} alt="Ganesha Ayurvedaa" className="size-full object-cover" />
          </div>
          <p className="text-center text-base font-semibold text-brown">GANESHA AYURVEDAA</p>
          <p className="mt-1 text-xs font-semibold text-gold">A Journey of Healing</p>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          {navItems.map(({ label, path, icon }) => {
            const Icon = iconMap[icon];
            return (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-l-[10px] px-4 py-3 text-base font-medium transition-colors ${
                    isActive
                      ? "bg-cream font-semibold text-gold"
                      : "text-brown hover:bg-white/50"
                  }`
                }
              >
                <Icon className="size-6 shrink-0" strokeWidth={1.5} />
                {label}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

export function TopBanner({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gold-light px-6 py-2 text-sm text-brown">
      <p>
        Get Up to 50% Off on Ayurvedic Medicines & Wellness Products{" "}
        <NavLink to="/dashboard/offer-popup" className="font-semibold text-gold underline">
          Claim Offer
        </NavLink>
      </p>
      <button type="button" onClick={onClose} className="text-brown/60 hover:text-brown" aria-label="Close banner">
        ×
      </button>
    </div>
  );
}

export function Header({
  title,
  showProfileDropdown = false,
}: {
  title: string;
  showProfileDropdown?: boolean;
}) {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between py-4">
      <h1 className="text-xl font-semibold text-brown">{title}</h1>
      <div className="flex items-center gap-4">
        <button type="button" className="rounded-full p-2 hover:bg-white/60" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => navigate("/dashboard/profile-dropdown")}
          className="flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-white/60"
        >
          <img src={images.avatar} alt="Rahul Sharma" className="size-8 rounded-full object-cover" />
          <div className="text-left">
            <p className="text-sm font-medium text-brown">Rahul Sharma</p>
            <p className="text-xs text-text-secondary">Super Admin</p>
          </div>
          {showProfileDropdown && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6" />
            </svg>
          )}
        </button>
        <button
          type="button"
          onClick={() => navigate("/dashboard/logout-popup")}
          className="rounded-lg p-2 hover:bg-white/60"
          aria-label="Logout"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </header>
  );
}

export function AppLayout({
  title,
  children,
  showBanner = true,
}: {
  title: string;
  children: React.ReactNode;
  showBanner?: boolean;
}) {
  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <main className="ml-[291px] min-h-screen px-8 pb-8">
        {showBanner && <TopBanner />}
        <Header title={title} />
        {children}
      </main>
    </div>
  );
}
