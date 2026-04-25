import React, { useEffect, useState } from 'react';
import {
  Users, CalendarDays, Receipt, Pill, TrendingUp, Activity,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, XCircle, AlertCircle,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { DashboardStats, RecentPatientRecord } from '../types';
import { format } from 'date-fns';

const COLORS = ['#B8860B', '#4A7C4E', '#8B6914', '#6aab6e', '#D4A017'];

const mockMonthlyData = [
  { month: 'Oct', patients: 42, revenue: 48000 },
  { month: 'Nov', patients: 58, revenue: 62000 },
  { month: 'Dec', patients: 51, revenue: 55000 },
  { month: 'Jan', patients: 67, revenue: 71000 },
  { month: 'Feb', patients: 73, revenue: 79000 },
  { month: 'Mar', patients: 89, revenue: 94000 },
  { month: 'Apr', patients: 95, revenue: 108000 },
];

const mockDoshaData = [
  { name: 'Vata', value: 32 },
  { name: 'Pitta', value: 28 },
  { name: 'Kapha', value: 20 },
  { name: 'Vata-Pitta', value: 12 },
  { name: 'Tridosha', value: 8 },
];

const mockAppointments = [
  { id: 1, patientName: 'Priya Sharma', time: '09:00 AM', type: 'Consultation', status: 'CONFIRMED', doctor: 'Dr. Arjun' },
  { id: 2, patientName: 'Rahul Verma', time: '10:30 AM', type: 'Panchakarma', status: 'PENDING', doctor: 'Dr. Meena' },
  { id: 3, patientName: 'Sunita Patel', time: '11:00 AM', type: 'Follow Up', status: 'CONFIRMED', doctor: 'Dr. Arjun' },
  { id: 4, patientName: 'Amit Kumar', time: '02:00 PM', type: 'Treatment', status: 'COMPLETED', doctor: 'Dr. Meena' },
  { id: 5, patientName: 'Kavya Nair', time: '03:30 PM', type: 'Consultation', status: 'CANCELLED', doctor: 'Dr. Arjun' },
];

const mockRecentPatients: RecentPatientRecord[] = [
  { patientId: 'PT001', ganId: 'GAN-001', patientName: 'Priya Sharma', dosha: 'Vata', status: 'COMPLETED' },
  { patientId: 'PT002', ganId: 'GAN-002', patientName: 'Rahul Verma', dosha: 'Pitta', status: 'COMPLETED' },
  { patientId: 'PT003', ganId: 'GAN-003', patientName: 'Sunita Patel', dosha: 'Kapha', status: 'CONFIRMED' },
  { patientId: 'PT004', ganId: 'GAN-004', patientName: 'Amit Kumar', dosha: 'Vata-Pitta', status: 'PENDING' },
];

function StatCard({
  icon: Icon, label, value, sub, trend, color,
}: {
  icon: React.ElementType; label: string; value: string | number;
  sub?: string; trend?: { value: number; up: boolean }; color: string;
}) {
  return (
    <div className="card p-5 flex items-start justify-between hover:shadow-md transition-shadow">
      <div className="flex-1">
        <p className="text-sm font-medium mb-1" style={{ color: '#9C7040' }}>{label}</p>
        <p className="text-3xl font-bold mb-1" style={{ color: '#2D1B00', fontFamily: 'Cormorant Garamond, serif' }}>
          {value}
        </p>
        {sub && <p className="text-xs" style={{ color: '#9C7040' }}>{sub}</p>}
        {trend && (
          <p className={`text-xs font-medium flex items-center gap-0.5 mt-1`}
             style={{ color: trend.up ? '#166534' : '#991b1b' }}>
            {trend.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend.value}% from last month
          </p>
        )}
      </div>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
           style={{ background: color + '20' }}>
        <Icon size={22} style={{ color }} />
      </div>
    </div>
  );
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  CONFIRMED: { label: 'Confirmed', icon: CheckCircle2, color: '#166534', bg: '#dcfce7' },
  PENDING: { label: 'Pending', icon: Clock, color: '#854d0e', bg: '#fef9c3' },
  COMPLETED: { label: 'Completed', icon: CheckCircle2, color: '#1e40af', bg: '#dbeafe' },
  CANCELLED: { label: 'Cancelled', icon: XCircle, color: '#991b1b', bg: '#fee2e2' },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardApi.getStats()
      .then((res) => setStats(res.data))
      .catch(() => {
        setStats({
          totalPatients: 1284, activePatients: 956, inactivePatients: 328, newPatientsToday: 4,
          totalAppointments: 18, confirmedAppointments: 11, cancelledAppointments: 2, followUpAppointments: 5,
          totalBilling: 108000, pendingPayments: 14000, collectedPayments: 94000, totalBillsGenerated: 143,
          totalMedicines: 64, tablets: 28, syrups: 14, powders: 12,
          recentPatientRecords: [], lowStockMedicines: Array(7).fill({ id: 0, name: '', quantity: 0, type: '' }),
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner center size="lg" />;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-auto" style={{ background: '#F5EFE0' }}>
      {/* Header */}
      <div className="bg-white border-b px-6 py-5" style={{ borderColor: '#EDE5D0' }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#2D1B00', fontFamily: 'Cormorant Garamond, serif' }}>
              {greeting()}, {user?.fullName?.split(' ')[0]} 🙏
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#9C7040' }}>
              {format(new Date(), 'EEEE, MMMM d, yyyy')} · Here's your clinic overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
                 style={{ background: '#F0E8D6', color: '#B8860B' }}>
              <Activity size={14} />
              Clinic Active
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon={Users} label="Total Patients" value={stats?.totalPatients?.toLocaleString() ?? '—'}
            sub={`${stats?.activePatients ?? 0} active`} trend={{ value: 8.2, up: true }} color="#4A7C4E"
          />
          <StatCard
            icon={CalendarDays} label="Total Appointments" value={stats?.totalAppointments ?? '—'}
            sub={`${stats?.confirmedAppointments ?? 0} confirmed`} trend={{ value: 12.5, up: true }} color="#B8860B"
          />
          <StatCard
            icon={Receipt} label="Pending Payments" value={stats ? `₹${Number(stats.pendingPayments).toLocaleString('en-IN')}` : '—'}
            sub="Awaiting collection" trend={{ value: 3.1, up: false }} color="#dc2626"
          />
          <StatCard
            icon={Pill} label="Low Stock Medicines" value={stats?.lowStockMedicines?.length ?? '—'}
            sub="Need reorder" color="#6B4C1E"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Patient & Revenue Chart */}
          <div className="card p-5 xl:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-base" style={{ color: '#2D1B00' }}>Patient Growth & Revenue</h3>
                <p className="text-xs mt-0.5" style={{ color: '#9C7040' }}>Last 7 months</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5" style={{ color: '#4A7C4E' }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#4A7C4E' }} />Patients
                </span>
                <span className="flex items-center gap-1.5" style={{ color: '#B8860B' }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#B8860B' }} />Revenue
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={mockMonthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="patientGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4A7C4E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4A7C4E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B8860B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#B8860B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E8D6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9C7040' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9C7040' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'white', border: '1px solid #EDE5D0', borderRadius: 8, fontSize: 12 }}
                />
                <Area type="monotone" dataKey="patients" stroke="#4A7C4E" strokeWidth={2} fill="url(#patientGrad)" />
                <Area type="monotone" dataKey="revenue" stroke="#B8860B" strokeWidth={2} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Dosha Distribution */}
          <div className="card p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-base" style={{ color: '#2D1B00' }}>Dosha Distribution</h3>
              <p className="text-xs mt-0.5" style={{ color: '#9C7040' }}>Patient constitution types</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={mockDoshaData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {mockDoshaData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5">
              {mockDoshaData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i] }} />
                    <span className="text-xs" style={{ color: '#6B4C1E' }}>{d.name}</span>
                  </div>
                  <span className="text-xs font-medium" style={{ color: '#2D1B00' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Today's Appointments */}
          <div className="card">
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#EDE5D0' }}>
              <div>
                <h3 className="font-semibold text-base" style={{ color: '#2D1B00' }}>Today's Appointments</h3>
                <p className="text-xs mt-0.5" style={{ color: '#9C7040' }}>{mockAppointments.length} scheduled</p>
              </div>
              <a href="/appointments" className="text-xs font-medium" style={{ color: '#B8860B' }}>View all →</a>
            </div>
            <div className="divide-y" style={{ '--tw-divide-opacity': 1 } as React.CSSProperties}>
              {mockAppointments.map((apt) => {
                const cfg = statusConfig[apt.status] || statusConfig['PENDING'];
                const StatusIcon = cfg.icon;
                return (
                  <div key={apt.id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                         style={{ background: '#B8860B' }}>
                      {apt.patientName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: '#2D1B00' }}>{apt.patientName}</p>
                      <p className="text-xs truncate" style={{ color: '#9C7040' }}>{apt.type} · {apt.doctor}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs font-medium" style={{ color: '#6B4C1E' }}>{apt.time}</span>
                      <span className="badge text-xs px-2 py-0.5 rounded-full" style={{ background: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Patients */}
          <div className="card">
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#EDE5D0' }}>
              <div>
                <h3 className="font-semibold text-base" style={{ color: '#2D1B00' }}>Recent Patients</h3>
                <p className="text-xs mt-0.5" style={{ color: '#9C7040' }}>Latest registrations</p>
              </div>
              <a href="/patients" className="text-xs font-medium" style={{ color: '#B8860B' }}>View all →</a>
            </div>
            <div className="divide-y">
              {(stats?.recentPatientRecords?.length ? stats.recentPatientRecords : mockRecentPatients).map((p, i) => (
                <div key={p.patientId + i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                       style={{ background: '#4A7C4E' }}>
                    {(p.patientName ?? '?').charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: '#2D1B00' }}>{p.patientName}</p>
                    <p className="text-xs" style={{ color: '#9C7040' }}>{p.ganId} · {p.dosha}</p>
                  </div>
                  <span className={`badge text-xs ${p.status === 'COMPLETED' || p.status === 'ACTIVE' ? 'badge-green' : p.status === 'CANCELLED' ? 'badge-red' : 'badge-yellow'}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-base" style={{ color: '#2D1B00' }}>Monthly Revenue</h3>
              <p className="text-xs mt-0.5" style={{ color: '#9C7040' }}>Financial performance overview</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: '#F0E8D6' }}>
              <TrendingUp size={14} style={{ color: '#B8860B' }} />
              <span className="text-xs font-semibold" style={{ color: '#B8860B' }}>
                ₹{Number(stats?.totalBilling ?? 108000).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Collected', amount: Number(stats?.collectedPayments ?? 94000), color: '#166534', bg: '#dcfce7' },
              { label: 'Pending', amount: Number(stats?.pendingPayments ?? 14000), color: '#991b1b', bg: '#fee2e2' },
              { label: 'Total Billed', amount: Number(stats?.totalBilling ?? 108000), color: '#1e40af', bg: '#dbeafe' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl p-4" style={{ background: item.bg }}>
                <p className="text-xs font-medium mb-1" style={{ color: item.color }}>{item.label}</p>
                <p className="text-xl font-bold" style={{ color: item.color, fontFamily: 'Cormorant Garamond, serif' }}>
                  ₹{item.amount.toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
