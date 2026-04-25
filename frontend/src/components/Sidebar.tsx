import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserRound, CalendarDays,
  Stethoscope, Pill, BarChart3, ClipboardList, Receipt, Settings,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patients', icon: Users, label: 'Patients' },
  { to: '/doctors', icon: UserRound, label: 'Doctors' },
  { to: '/appointments', icon: CalendarDays, label: 'Appointments' },
  { to: '/treatments', icon: Stethoscope, label: 'Treatments' },
  { to: '/medicines', icon: Pill, label: 'Medicines' },
  { to: '/sales', icon: BarChart3, label: 'Sales' },
  { to: '/activity-logs', icon: ClipboardList, label: 'Activity Logs' },
  { to: '/billing', icon: Receipt, label: 'Billing' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside
      className="w-56 min-h-screen flex flex-col py-6 px-3 flex-shrink-0"
      style={{
        background: '#FAF6EE',
        borderRight: '1px solid #EDE5D0',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A843' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }}
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
          className="font-bold text-xs tracking-widest text-center"
          style={{ color: '#2D1B00', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.15em' }}
        >
          GANESHA AYURVEDAA
        </h2>
        <p className="text-xs font-medium mt-0.5 italic" style={{ color: '#B8860B' }}>
          A Journey of Healing
        </p>
      </div>

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
    </aside>
  );
}
