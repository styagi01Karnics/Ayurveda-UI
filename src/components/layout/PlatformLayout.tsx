import { useState, type ReactNode } from 'react';
import { LogOut } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ToastProvider } from '@/app/ToastContext';
import { ChangePasswordModal } from '@/components/auth/ChangePasswordModal';
import { PasswordSuccessModal } from '@/components/auth/PasswordSuccessModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { assets } from '@/lib/assets';
import { clearAuthSession, getStoredUser } from '@/lib/auth';
import { UI_MESSAGES } from '@/lib/uiMessages';

export function PlatformLayout({ children }: { children?: ReactNode }) {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [passwordSuccessOpen, setPasswordSuccessOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login');
  };

  return (
    <ToastProvider>
      <div className="min-h-screen bg-cream-light">
        <header className="border-b border-[#f0ebe3] bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <img
                src={assets.brandLogo}
                alt="Ganesha Ayurvedaa"
                className="h-10 w-10 object-contain"
              />
              <div>
                <p className="font-serif text-sm font-semibold tracking-wide text-brown">
                  Platform Admin
                </p>
                <p className="text-xs text-text-muted">
                  {user?.fullName ?? 'Super Admin'} · {user?.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setChangePasswordOpen(true)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-brown hover:bg-cream"
              >
                Change password
              </button>
              <button
                type="button"
                onClick={() => setLogoutOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-cream px-3 py-2 text-sm font-medium text-brown hover:bg-gold/10"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
          {children ?? <Outlet />}
        </main>
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
      <ConfirmDialog
        open={logoutOpen}
        title="Log out?"
        message={UI_MESSAGES.confirm.logoutMessage}
        confirmLabel="Logout"
        onConfirm={handleLogout}
        onClose={() => setLogoutOpen(false)}
      />
    </ToastProvider>
  );
}
