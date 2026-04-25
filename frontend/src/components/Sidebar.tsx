import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, UserRound, CalendarDays,
  Stethoscope, Pill, BarChart3, ClipboardList, Receipt, Settings, LogOut,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/doctors', icon: UserRound, label: 'Doctors' },
  { to: '/appointments', icon: CalendarDays, label: 'Appointments' },
  { to: '/treatments', icon: Stethoscope, label: 'Treatments' },
  { to: '/medicines', icon: Pill, label: 'Medicines' },
  { to: '/billing', icon: Receipt, label: 'Billing' },
  { to: '/sales', icon: BarChart3, label: 'Sales' },
  { to: '/activity-logs', icon: ClipboardList, label: 'Activity Logs' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside
      className="w-64 min-h-screen flex flex-col py-6 px-4 flex-shrink-0"
      style={{ background: '#FAF6EE', borderRight: '1px solid #EDE5D0' }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center mb-8 pb-6" style={{ borderBottom: '1px solid #EDE5D0' }}>
        <div
          className="w-16 h-16 rounded-full border-2 flex items-center justify-center mb-3"
          style={{ borderColor: '#B8860B', background: '#FFF9EE' }}
        >
          <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
            <path
              d="M19 3 Q24 9 21 17 Q27 12 32 17 Q26 23 24 29 Q22 33 19 33 Q16 33 14 29 Q12 23 6 17 Q11 12 17 17 Q14 9 19 3Z"
              fill="#B8860B" opacity="0.9"
            />
            <path d="M19 7 Q21 13 19 19 Q17 13 19 7Z" fill="#8B6914" />
            <circle cx="19" cy="19" r="3" fill="#FFF9EE" opacity="0.7" />
          </svg>
        </div>
        <h2
          className="font-bold text-sm tracking-widest text-center"
          style={{ color: '#2D1B00', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.12em' }}
        >
          GANESHA AYURVEDAA
        </h2>
        <p className="text-xs font-medium mt-0.5" style={{ color: '#B8860B' }}>
          A Journey of Healing
        </p>
      </div>

      {/* User info */}
      {user && (
        <div
          className="flex items-center gap-3 mb-6 px-3 py-3 rounded-xl"
          style={{ background: '#F0E8D6' }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
            style={{ background: '#B8860B' }}
          >
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: '#2D1B00' }}>
              {user.fullName}
            </p>
            <p className="text-xs truncate" style={{ color: '#9C7040' }}>
              {user.role.replace('_', ' ')}
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
            }
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm mt-4 w-full text-left"
        style={{ color: '#dc2626' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#FEF2F2'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        <LogOut size={17} />
        Logout
      </button>
    </aside>
  );
}
