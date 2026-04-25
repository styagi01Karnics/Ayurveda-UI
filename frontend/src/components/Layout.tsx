import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, X } from 'lucide-react';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/patients': 'Patients',
  '/doctors': 'Doctors',
  '/appointments': 'Appointments',
  '/treatments': 'Treatments',
  '/medicines': 'Medicines',
  '/billing': 'Billing',
  '/sales': 'Sales',
  '/activity-logs': 'Activity Logs',
  '/settings': 'Settings',
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [promoBanner, setPromoBanner] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); };

  const pageLabel = routeLabels[location.pathname] ?? 'Dashboard';

  return (
    <div className="flex min-h-screen" style={{ background: '#F5EFE0' }}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Promo Banner */}
        {promoBanner && (
          <div
            className="flex items-center justify-between px-6 py-2.5 text-sm font-medium flex-shrink-0"
            style={{ background: '#F0E8D6', borderBottom: '1px solid #E5D5B0' }}
          >
            <div />
            <p style={{ color: '#6B4C1E' }}>
              Get Up to 50% Off on Ayurvedic Medicines &amp; Wellness Products{' '}
              <span style={{ color: '#B8860B' }}>──→</span>{' '}
              <span className="underline cursor-pointer font-semibold" style={{ color: '#B8860B' }}>
                Claim Offer
              </span>
            </p>
            <button onClick={() => setPromoBanner(false)} className="p-1 rounded-full hover:bg-black/10 transition-colors">
              <X size={14} style={{ color: '#6B4C1E' }} />
            </button>
          </div>
        )}

        {/* Top Header */}
        <div
          className="flex items-center justify-between px-6 py-3 bg-white flex-shrink-0"
          style={{ borderBottom: '1px solid #EDE5D0' }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span
              className="cursor-pointer hover:underline"
              style={{ color: '#9C7040' }}
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </span>
            {pageLabel !== 'Dashboard' && (
              <>
                <span style={{ color: '#C4A97A' }}>/</span>
                <span className="font-medium" style={{ color: '#2D1B00' }}>{pageLabel}</span>
              </>
            )}
          </div>

          {/* Right: Bell + User + Logout */}
          <div className="flex items-center gap-3">
            {/* Bell */}
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-amber-50"
              style={{ border: '1px solid #EDE5D0' }}
            >
              <Bell size={16} style={{ color: '#6B4C1E' }} />
            </button>

            {/* User info */}
            <button
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-colors hover:bg-amber-50"
              style={{ border: '1px solid #EDE5D0' }}
              onClick={() => setUserMenuOpen((v) => !v)}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ background: '#B8860B' }}
              >
                {user?.fullName?.charAt(0).toUpperCase() ?? 'A'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold leading-none" style={{ color: '#2D1B00' }}>
                  {user?.fullName ?? 'Admin'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#9C7040' }}>
                  {user?.role?.replace('_', ' ') ?? 'Admin'}
                </p>
              </div>
              <ChevronDown size={14} style={{ color: '#9C7040' }} />
            </button>

            {/* Logout icon button */}
            <button
              onClick={handleLogout}
              title="Logout"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:bg-red-50"
              style={{ border: '1px solid #EDE5D0' }}
            >
              <LogOut size={16} style={{ color: '#9C7040' }} />
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
