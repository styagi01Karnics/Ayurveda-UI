import { useMemo, useState, type ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PageActionContext } from '@/app/PageActionContext';
import { ToastProvider } from '@/app/ToastContext';
import { ChangePasswordModal } from '@/components/auth/ChangePasswordModal';
import { LogoutModal } from '@/components/auth/LogoutModal';
import { PasswordSuccessModal } from '@/components/auth/PasswordSuccessModal';
import { RedeemCouponModal } from '@/components/dashboard/RedeemCouponModal';
import { clearStoredUser } from '@/lib/auth';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { TopBanner } from './TopBanner';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/patients': 'Patients',
  '/doctors': 'Doctors',
  '/appointments': 'Appointments',
  '/treatments': 'Treatments',
  '/medicines': 'Medicines',
  '/sales': 'Sales',
  '/activity-logs': 'Activity Logs',
  '/billing': 'Billing',
  '/settings': 'Settings',
  '/profile': 'My Profile',
};

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/patients/')) return 'Patients';
  if (pathname.startsWith('/doctors/patient/')) return 'Doctors';
  return pageTitles[pathname] ?? 'Dashboard';
}

export function DashboardLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [headerAction, setHeaderAction] = useState<ReactNode>(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [passwordSuccessOpen, setPasswordSuccessOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const { pathname } = useLocation();
  const title = getPageTitle(pathname);
  const contextValue = useMemo(
    () => ({ setHeaderAction }),
    [setHeaderAction],
  );

  const handleLogout = () => {
    clearStoredUser();
    navigate('/login');
  };

  return (
    <ToastProvider>
      <PageActionContext.Provider value={contextValue}>
        <div className="flex min-h-screen flex-col bg-cream-light">
          <TopBanner onClaimOffer={() => setCouponOpen(true)} />
          <div className="flex flex-1 overflow-hidden">
            <div className="hidden lg:block">
              <Sidebar />
            </div>

            {mobileOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <button
                  type="button"
                  className="absolute inset-0 bg-black/40"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                />
                <div className="relative z-10 h-full w-64">
                  <Sidebar onNavigate={() => setMobileOpen(false)} />
                </div>
              </div>
            )}

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center gap-3 border-b border-gray-100 bg-cream-light px-4 py-3 lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="rounded-lg p-2 hover:bg-brown/5"
                  aria-label="Open menu"
                >
                  {mobileOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
                <span className="font-semibold text-brown">{title}</span>
              </div>

              <Header
                title={title}
                action={headerAction}
                onChangePassword={() => setChangePasswordOpen(true)}
                onLogout={() => setLogoutOpen(true)}
              />
              <main className="flex-1 overflow-auto p-4 sm:p-6">
                <Outlet />
              </main>
            </div>
          </div>
        </div>

        <ChangePasswordModal
          open={changePasswordOpen}
          onClose={() => setChangePasswordOpen(false)}
          onSuccess={() => {
            setChangePasswordOpen(false);
            setPasswordSuccessOpen(true);
          }}
        />
        <PasswordSuccessModal
          open={passwordSuccessOpen}
          onClose={() => setPasswordSuccessOpen(false)}
        />
        <LogoutModal
          open={logoutOpen}
          onClose={() => setLogoutOpen(false)}
          onConfirm={handleLogout}
        />
        <RedeemCouponModal
          open={couponOpen}
          onClose={() => setCouponOpen(false)}
        />
      </PageActionContext.Provider>
    </ToastProvider>
  );
}
