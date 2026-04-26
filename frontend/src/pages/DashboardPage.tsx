import React, { useEffect, useRef, useState } from 'react';
import {
  Users, CalendarDays, Receipt, Pill, ChevronDown, ArrowUpRight,
  Package, Check,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { DashboardStats } from '../types';
import { format } from 'date-fns';
import { PERIOD_OPTIONS, CHART_DATA_BY_PERIOD, Period } from '../constants/dashboard';
import { MOCK_SCHEDULE, MOCK_RECENT_RECORDS, MOCK_LOW_STOCK, MOCK_DASHBOARD_STATS } from '../mocks/dashboard';
import mortarImg from '../assets/mortar.png';

/* ── Dropdown component ── */
function PeriodDropdown({ value, onChange }: { value: Period; onChange: (p: Period) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg"
        style={{ background: '#F7EFE2', color: '#838A9A', border: '1px solid #EDE2CA' }}
        onClick={() => setOpen((v) => !v)}
      >
        {value} <ChevronDown size={11} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: '0.15s' }} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 rounded-xl shadow-lg overflow-hidden"
          style={{ background: 'white', border: '1px solid #EDE2CA', minWidth: 110 }}>
          {PERIOD_OPTIONS.map((opt) => (
            <button key={opt}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-amber-50 transition-colors"
              style={{ color: opt === value ? '#BE880B' : '#422C23' }}
              onClick={() => { onChange(opt); setOpen(false); }}>
              {opt}
              {opt === value && <Check size={11} style={{ color: '#BE880B' }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Small donut chart ── */
function SmallDonut({ pct, color, label, count }: { pct: number; color: string; label: string; count: number }) {
  const data = [{ value: pct }, { value: Math.max(0, 100 - pct) }];
  return (
    <div className="flex flex-col items-center gap-1">
      <div style={{ width: 76, height: 76 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={24} outerRadius={34}
              startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
              <Cell fill={color} />
              <Cell fill="#F7EFE2" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm font-bold leading-none" style={{ color: '#BE880B' }}>{count}</p>
      <p className="text-xs" style={{ color: '#727983' }}>{label}</p>
      <p className="text-xs" style={{ color: '#727983' }}>{pct}%</p>
    </div>
  );
}

/* ── Badge helpers ── */
const visitTypeBadge = (type: string) => (
  <span className="text-xs font-medium" style={{ color: '#BE880B' }}>
    {(type ?? '—').replace('_', ' ')}
  </span>
);

const statusBadge = (status: string) => {
  const cfg: Record<string, { bg: string; color: string; border: string }> = {
    COMPLETED: { bg: '#E6EFE3', color: '#2E7D32', border: '#036F4B' },
    CONFIRMED: { bg: '#E6EFE3', color: '#2E7D32', border: '#036F4B' },
    PENDING:   { bg: '#FEF9C3', color: '#EAB308', border: '#EAB308' },
    CANCELLED: { bg: '#FAE3E2', color: '#DC2626', border: '#DC2626' },
    ACTIVE:    { bg: '#E6EFE3', color: '#2E7D32', border: '#036F4B' },
    INACTIVE:  { bg: '#F3F4F6', color: '#737373', border: '#D1D5DB' },
  };
  const c = cfg[status] ?? cfg['PENDING'];
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.color, border: `0.5px solid ${c.border}` }}>{status}</span>
  );
};

/* ══════════════════════════════════════════════════ */
export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats]       = useState<DashboardStats | null>(null);
  const [loading, setLoading]   = useState(true);
  const [patientPeriod, setPatientPeriod]     = useState<Period>('Monthly');
  const [apptPeriod, setApptPeriod]           = useState<Period>('Monthly');
  const [billingPeriod, setBillingPeriod]     = useState<Period>('Monthly');

  useEffect(() => {
    dashboardApi.getStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats(MOCK_DASHBOARD_STATS))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner center size="lg" />;

  const s = stats!;
  const totalPat   = s.totalPatients || 1;
  const activeRatio   = Math.round((s.activePatients   / totalPat) * 100);
  const inactiveRatio = 100 - activeRatio;

  const totalAppt     = s.totalAppointments || 1;
  const confirmedPct  = Math.round((s.confirmedAppointments  / totalAppt) * 100);
  const cancelledPct  = Math.round((s.cancelledAppointments  / totalAppt) * 100);
  const followUpPct   = Math.round((s.followUpAppointments   / totalAppt) * 100);

  const totalMed  = (s.tablets + s.syrups + s.powders) || s.totalMedicines || 442;
  const tabletPct = totalMed > 0 ? (s.tablets / totalMed) * 100 : 68;
  const syrupPct  = totalMed > 0 ? (s.syrups  / totalMed) * 100 : 22;
  const powderPct = totalMed > 0 ? (s.powders / totalMed) * 100 : 10;

  const chartData     = CHART_DATA_BY_PERIOD[patientPeriod];
  const recentRecords = s.recentPatientRecords?.length ? s.recentPatientRecords : MOCK_RECENT_RECORDS;
  const lowStockList  = s.lowStockMedicines?.length    ? s.lowStockMedicines    : MOCK_LOW_STOCK;

  const card = "rounded-[10px] p-5 flex flex-col";
  const cardStyle = {
    background: 'rgba(255,255,255,0.85)',
    boxShadow: '0px 0px 3px 1px rgba(190,136,11,0.1)',
  };

  return (
    <div className="flex-1 overflow-auto" style={{ background: '#FFFEF7' }}>
      <div className="p-5 space-y-4">

        {/* ══ Main grid: [Total Patients row-span-2] | [Appts][Billing] / [MedStock][Schedule] ══ */}
        <div className="grid gap-4" style={{
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: 'auto auto',
        }}>

          {/* ─── Total Patients (row-span 2) ─── */}
          <div className={card} style={{ ...cardStyle, gridRow: 'span 2' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#E8F5E9' }}>
                  <Users size={16} style={{ color: '#4A7C4E' }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: '#838A9A' }}>Total Patients</span>
              </div>
              <PeriodDropdown value={patientPeriod} onChange={setPatientPeriod} />
            </div>

            {/* Count + trend */}
            <div className="flex items-end gap-3 mb-4">
              <span className="text-4xl font-bold" style={{ color: '#422C23', fontFamily: 'Cormorant Garamond, serif' }}>
                {s.totalPatients.toLocaleString()}
              </span>
              <div className="mb-1">
                <span className="flex items-center gap-0.5 text-xs font-semibold" style={{ color: '#166534' }}>
                  <ArrowUpRight size={12} />+20%
                </span>
                <span className="text-xs" style={{ color: '#737373' }}>+{s.newPatientsToday} Today</span>
              </div>
            </div>

            {/* Active / Inactive — side by side */}
            <div style={{ display: 'flex', flexDirection: 'row', gap: 0, marginBottom: 14 }}>
              {/* Active */}
              <div style={{ flex: 1, paddingRight: 12, borderRight: '1px solid #EDE2CA' }}>
                <p style={{ fontSize: 26, fontWeight: 700, color: '#422C23', fontFamily: 'Cormorant Garamond, serif', lineHeight: 1.1, marginBottom: 2 }}>
                  {s.activePatients.toLocaleString()}
                </p>
                <p style={{ fontSize: 11, color: '#737373', marginBottom: 2 }}>{activeRatio}%</p>
                <p style={{ fontSize: 11, color: '#737373', marginBottom: 8 }}>Active Patients</p>
                <div style={{ height: 5, borderRadius: 999, background: '#F7EFE2' }}>
                  <div style={{ height: 5, borderRadius: 999, width: `${activeRatio}%`, background: '#BE880B' }} />
                </div>
              </div>
              {/* Inactive */}
              <div style={{ flex: 1, paddingLeft: 12 }}>
                <p style={{ fontSize: 26, fontWeight: 700, color: '#422C23', fontFamily: 'Cormorant Garamond, serif', lineHeight: 1.1, marginBottom: 2 }}>
                  {s.inactivePatients.toLocaleString()}
                </p>
                <p style={{ fontSize: 11, color: '#737373', marginBottom: 2 }}>{inactiveRatio}%</p>
                <p style={{ fontSize: 11, color: '#737373', marginBottom: 8 }}>Inactive Patients</p>
                {/* Segmented inactive bar */}
                <div style={{ display: 'flex', gap: 2, height: 5 }}>
                  {Array.from({ length: Math.round(inactiveRatio / 10) }).map((_, i) => (
                    <div key={i} style={{ flex: 1, height: 5, borderRadius: 2, background: '#D9D9D9', opacity: 0.6 }} />
                  ))}
                  {Array.from({ length: 10 - Math.round(inactiveRatio / 10) }).map((_, i) => (
                    <div key={'e' + i} style={{ flex: 1, height: 5, borderRadius: 2, background: '#F7EFE2' }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Chart legend */}
            <div className="flex items-center gap-5 mb-2">
              <div className="flex items-center gap-1.5">
                <svg width="18" height="6"><line x1="0" y1="3" x2="18" y2="3" stroke="#4CAF50" strokeWidth="2" /></svg>
                <span className="text-xs" style={{ color: '#737373' }}>New Patients</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="18" height="6"><line x1="0" y1="3" x2="18" y2="3" stroke="#E6A23C" strokeWidth="2" strokeDasharray="4 3" /></svg>
                <span className="text-xs" style={{ color: '#737373' }}>Follow Ups</span>
              </div>
            </div>

            {/* Chart — fills remaining height */}
            <div className="flex-1" style={{ minHeight: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 6, right: 8, left: 4, bottom: 4 }}>
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#737373' }} axisLine={false} tickLine={false} />
                  <YAxis hide width={0} domain={['dataMin - 5', 'dataMax + 10']} />
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #EDE2CA', background: 'white' }}
                    itemStyle={{ color: '#737373' }}
                  />
                  <Line type="monotone" dataKey="newPatients" stroke="#4CAF50" strokeWidth={2}
                    dot={{ r: 3, fill: '#4CAF50', strokeWidth: 0 }} activeDot={{ r: 5 }} name="New Patients" />
                  <Line type="monotone" dataKey="followUps"   stroke="#E6A23C" strokeWidth={2} strokeDasharray="5 3"
                    dot={{ r: 3, fill: '#E6A23C', strokeWidth: 0 }} activeDot={{ r: 5 }} name="Follow Ups" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ─── Total Appointments ─── */}
          <div className={card} style={cardStyle}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FDF4D8' }}>
                  <CalendarDays size={16} style={{ color: '#BE880B' }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: '#838A9A' }}>Total Appointments</span>
              </div>
              <PeriodDropdown value={apptPeriod} onChange={setApptPeriod} />
            </div>

            <div className="flex items-end gap-3 mb-5">
              <span className="text-4xl font-bold" style={{ color: '#422C23', fontFamily: 'Cormorant Garamond, serif' }}>
                {s.totalAppointments.toLocaleString()}
              </span>
              <span className="mb-1 flex items-center gap-0.5 text-xs font-semibold" style={{ color: '#166534' }}>
                <ArrowUpRight size={12} />+20%
              </span>
            </div>

            <div className="flex items-center justify-around flex-1">
              <SmallDonut pct={confirmedPct} color="#4CAF50" label="Confirmed"  count={s.confirmedAppointments} />
              <SmallDonut pct={cancelledPct} color="#D92D20" label="Cancelled"  count={s.cancelledAppointments} />
              <SmallDonut pct={followUpPct}  color="#E6A23C" label="Follow-Up"  count={s.followUpAppointments}  />
            </div>
          </div>

          {/* ─── Billing ─── */}
          <div className={card} style={cardStyle}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FEE2E2' }}>
                  <Receipt size={16} style={{ color: '#dc2626' }} />
                </div>
                <span className="text-sm font-semibold" style={{ color: '#838A9A' }}>Billing</span>
              </div>
              <PeriodDropdown value={billingPeriod} onChange={setBillingPeriod} />
            </div>

            <div className="mb-4">
              <p className="text-3xl font-bold" style={{ color: '#422C23', fontFamily: 'Cormorant Garamond, serif' }}>
                ₹{Number(s.totalBilling).toLocaleString('en-IN')}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#737373' }}>Total revenue collected</p>
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between py-2.5 px-3 rounded-xl" style={{ background: '#F9FAFB' }}>
                <div>
                  <p className="text-xs" style={{ color: '#737373' }}>Total Bills Generated</p>
                  <p className="text-xl font-bold mt-0.5" style={{ color: '#422C23' }}>{s.totalBillsGenerated}</p>
                </div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#DBEAFE' }}>
                  <Receipt size={16} style={{ color: '#1e40af' }} />
                </div>
              </div>

              <div className="py-2.5 px-3 rounded-xl" style={{ background: '#FEF9C3' }}>
                <p className="text-xs font-medium" style={{ color: '#854d0e' }}>Pending Payments</p>
                <p className="text-lg font-bold mt-0.5" style={{ color: '#854d0e' }}>
                  ₹{Number(s.pendingPayments).toLocaleString('en-IN')}
                </p>
              </div>

              <div className="py-2.5 px-3 rounded-xl" style={{ background: '#DCFCE7' }}>
                <p className="text-xs font-medium" style={{ color: '#166534' }}>Collected Payments</p>
                <p className="text-lg font-bold mt-0.5" style={{ color: '#166534' }}>
                  ₹{Number(s.collectedPayments).toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          </div>

          {/* ─── Medicine Stock Availability ─── */}
          <div className={card} style={cardStyle}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#F0FDF4' }}>
                  <Pill size={16} style={{ color: '#4A7C4E' }} />
                </div>
                <h3 className="text-sm font-semibold" style={{ color: '#422C23' }}>Medicine Stock Availability</h3>
              </div>
              <button className="text-xs font-medium" style={{ color: '#BE880B' }}
                onClick={() => navigate('/medicines')}>View All →</button>
            </div>

            {/* Total + type mini-cards */}
            <div className="flex items-center gap-3 mb-3">
              <div className="mr-2">
                <p className="text-3xl font-bold" style={{ color: '#422C23', fontFamily: 'Cormorant Garamond, serif' }}>
                  {totalMed.toLocaleString()}
                </p>
                <p className="text-xs" style={{ color: '#737373' }}>Total in stock</p>
              </div>
              {[
                { label: 'Tablets', count: s.tablets,  color: '#6AC6C5' },
                { label: 'Syrups',  count: s.syrups,   color: '#F3BB40' },
                { label: 'Powder',  count: s.powders,  color: '#EA5075' },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center px-2 py-1.5 rounded-lg"
                  style={{ background: 'rgba(237,226,202,0.15)', border: '1px solid #EDE2CA', minWidth: 52 }}>
                  <span className="text-sm font-bold" style={{ color: '#422C23' }}>{t.count}</span>
                  <span className="text-xs" style={{ color: '#737373' }}>{t.label}</span>
                </div>
              ))}
            </div>

            {/* Segmented color bar */}
            <div className="flex overflow-hidden mb-2" style={{ height: 14, borderRadius: 2 }}>
              <div style={{ width: `${tabletPct}%`, background: '#6AC6C5' }} />
              <div style={{ width: `${syrupPct}%`,  background: '#F3BB40' }} />
              <div style={{ width: `${powderPct}%`, background: '#EA5075' }} />
            </div>
            <div className="flex gap-4 mb-4">
              {[
                { label: 'In Stock',     color: '#6AC6C5' },
                { label: 'Out of Stock', color: '#F3BB40' },
                { label: 'Low Stock',    color: '#EA5075' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-sm" style={{ background: l.color }} />
                  <span className="text-xs" style={{ color: '#737373' }}>{l.label}</span>
                </div>
              ))}
            </div>

            {/* Low stock list */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold" style={{ color: '#737373' }}>Low Stock</span>
              <button className="text-xs" style={{ color: '#BE880B' }} onClick={() => navigate('/medicines')}>View All</button>
            </div>
            <div className="space-y-1.5">
              {lowStockList.slice(0, 3).map((med: { id: number; name: string; type: string; quantity: number }) => (
                <div key={med.id} className="flex items-center justify-between py-2 px-3 rounded"
                  style={{ background: 'rgba(237,226,202,0.15)' }}>
                  <div className="flex items-center gap-2">
                    <Package size={13} style={{ color: '#737373' }} />
                    <span className="text-xs font-medium" style={{ color: '#422C23' }}>{med.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs" style={{ color: '#737373' }}>Qty: {med.quantity}</span>
                    <span style={{ margin: '0 8px', borderLeft: '0.5px solid #6A4739', height: 14, display: 'inline-block' }} />
                    <span className="text-xs font-semibold" style={{ color: '#BE880B', cursor: 'pointer' }}>Order</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Today's Schedule ─── */}
          <div className={card} style={{ ...cardStyle, background: '#F5F0E4', position: 'relative', overflow: 'hidden' }}>

            {/* Mortar image — top right */}
            <img src={mortarImg} alt="" style={{ position: 'absolute', top: -6, right: -6, width: 96, height: 96, objectFit: 'contain', pointerEvents: 'none' }} />

            {/* Header */}
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3 className="text-base font-bold flex items-center gap-1.5" style={{ color: '#422C23', fontFamily: 'Cormorant Garamond, serif' }}>
                  <span>🩺</span> Today's Schedule
                </h3>
                <p className="text-xs font-semibold mt-0.5" style={{ color: '#BE880B' }}>
                  {format(new Date(), 'd MMM yyyy, EEE, hh:mm a')}
                </p>
              </div>
              {/* space so header text doesn't overlap the image */}
              <div style={{ width: 80, flexShrink: 0 }} />
            </div>

            <div className="mb-3">
              <p className="text-xs font-semibold mb-2" style={{ color: '#737373' }}>Ongoing Appointment:</p>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.8)' }}>
                <p className="text-sm font-semibold" style={{ color: '#422C23' }}>{MOCK_SCHEDULE[0].patientName}</p>
                <p className="text-xs mt-0.5" style={{ color: '#737373' }}>{MOCK_SCHEDULE[0].complaint}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs font-semibold mb-2" style={{ color: '#737373' }}>Next Appointment:</p>
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.8)' }}>
                <p className="text-sm font-semibold" style={{ color: '#422C23' }}>
                  {MOCK_SCHEDULE[1].patientName}
                  <span className="font-normal text-xs ml-1" style={{ color: '#737373' }}>· {MOCK_SCHEDULE[1].time}</span>
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#737373' }}>{MOCK_SCHEDULE[1].complaint}</p>
              </div>
            </div>

            <div className="mt-auto space-y-3">
              <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.8)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color: '#737373' }}>Remaining Today:</p>
                <p className="text-xl font-bold" style={{ color: '#422C23', fontFamily: 'Cormorant Garamond, serif' }}>12</p>
              </div>
              <button
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ background: 'rgba(255,255,255,0.8)', color: '#BE880B', border: '1px solid #BE880B' }}
                onClick={() => navigate('/appointments')}>
                View Full Schedule
              </button>
            </div>
          </div>

        </div>{/* end main grid */}

        {/* ══ Recent Patient Records ══ */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={cardStyle}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={cardStyle}>
            <div>
              <h3 className="text-sm font-semibold" style={{ color: '#422C23' }}>Recent Patient Records</h3>
              <p className="text-xs mt-0.5" style={{ color: '#737373' }}>Latest appointments and visits</p>
            </div>
            <button className="text-xs font-medium" style={{ color: '#BE880B' }}
              onClick={() => navigate('/patients')}>View All →</button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#F7EFE2' }}>
                  {['Patient ID', 'Patient', 'Doctor', 'Visit Type', 'Appointment Date', 'Dosha | Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap"
                      style={{ color: '#737373' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentRecords.map((r: import('../types').RecentPatientRecord, i: number) => (
                  <tr key={r.patientId + i}
                    className="border-t hover:bg-amber-50 transition-colors"
                    style={{ borderColor: '#EDE2CA' }}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-mono px-2 py-0.5 rounded"
                        style={{ background: '#F7EFE2', color: '#737373' }}>
                        #{r.patientId}
                      </span>
                      <p className="text-xs mt-0.5" style={{ color: '#737373' }}>{r.ganId}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-sm" style={{ color: '#422C23' }}>{r.patientName}</p>
                      {r.phone && <p className="text-xs" style={{ color: '#737373' }}>{r.phone}</p>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: '#737373' }}>
                      {r.doctorName ? r.doctorName.replace('Dr. Sheekha Verma', 'Dr. Sheekha').replace('Dr. Arjun Mehta', 'Dr. Arjun') : '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {visitTypeBadge(r.visitType ?? '—')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: '#737373' }}>
                      {r.appointmentDate ? format(new Date(r.appointmentDate), 'dd MMM yyyy, hh:mm a') : '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs mr-2" style={{ color: '#BE880B' }}>{r.dosha ?? '—'}</span>
                      <span style={{ color: '#EDE2CA' }}>|</span>
                      <span className="ml-2">{statusBadge(r.status ?? 'PENDING')}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
