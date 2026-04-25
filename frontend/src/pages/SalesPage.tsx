import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, Receipt, BarChart3 } from 'lucide-react';

const monthlyRevenue = [
  { month: 'Oct 23', revenue: 48000, expenses: 18000, profit: 30000 },
  { month: 'Nov 23', revenue: 62000, expenses: 22000, profit: 40000 },
  { month: 'Dec 23', revenue: 55000, expenses: 20000, profit: 35000 },
  { month: 'Jan 24', revenue: 71000, expenses: 25000, profit: 46000 },
  { month: 'Feb 24', revenue: 79000, expenses: 28000, profit: 51000 },
  { month: 'Mar 24', revenue: 94000, expenses: 32000, profit: 62000 },
  { month: 'Apr 24', revenue: 108000, expenses: 38000, profit: 70000 },
];

const serviceRevenue = [
  { name: 'Panchakarma', value: 42000, color: '#B8860B' },
  { name: 'Consultations', value: 28000, color: '#4A7C4E' },
  { name: 'Medicines', value: 18000, color: '#8B6914' },
  { name: 'Shirodhara', value: 12000, color: '#6aab6e' },
  { name: 'Other Treatments', value: 8000, color: '#D4A017' },
];

const weeklyData = [
  { day: 'Mon', patients: 12, revenue: 8400 },
  { day: 'Tue', patients: 15, revenue: 10500 },
  { day: 'Wed', patients: 18, revenue: 12600 },
  { day: 'Thu', patients: 14, revenue: 9800 },
  { day: 'Fri', patients: 22, revenue: 15400 },
  { day: 'Sat', patients: 28, revenue: 19600 },
  { day: 'Sun', patients: 8, revenue: 5600 },
];

const StatCard = ({
  icon: Icon, label, value, change, up, color,
}: {
  icon: React.ElementType; label: string; value: string; change: string; up: boolean; color: string;
}) => (
  <div className="card p-5">
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '20' }}>
        <Icon size={20} style={{ color }} />
      </div>
      <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${up ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>
        {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}{change}
      </span>
    </div>
    <p className="text-3xl font-bold mb-1" style={{ color: '#2D1B00', fontFamily: 'Cormorant Garamond, serif' }}>{value}</p>
    <p className="text-sm" style={{ color: '#9C7040' }}>{label}</p>
  </div>
);

export default function SalesPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-auto" style={{ background: '#F5EFE0' }}>
      <div className="bg-white border-b px-6 py-4" style={{ borderColor: '#EDE5D0' }}>
        <h1 className="text-2xl font-bold" style={{ color: '#2D1B00', fontFamily: 'Cormorant Garamond, serif' }}>Sales & Revenue</h1>
        <p className="text-sm mt-0.5" style={{ color: '#9C7040' }}>Financial performance and analytics</p>
      </div>

      <div className="flex-1 p-6 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={DollarSign} label="Monthly Revenue" value="₹1,08,000" change="+14.9%" up={true} color="#B8860B" />
          <StatCard icon={TrendingUp} label="Monthly Profit" value="₹70,000" change="+12.9%" up={true} color="#4A7C4E" />
          <StatCard icon={Users} label="Paying Patients" value="89" change="+6.6%" up={true} color="#6B4C1E" />
          <StatCard icon={Receipt} label="Avg. Bill Value" value="₹1,213" change="+3.2%" up={true} color="#8B6914" />
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Revenue vs Expenses */}
          <div className="card p-5 xl:col-span-2">
            <div className="mb-5">
              <h3 className="font-semibold text-base" style={{ color: '#2D1B00' }}>Revenue vs Expenses vs Profit</h3>
              <p className="text-xs mt-0.5" style={{ color: '#9C7040' }}>Last 7 months comparison</p>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyRevenue} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E8D6" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9C7040' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9C7040' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'white', border: '1px solid #EDE5D0', borderRadius: 8, fontSize: 12 }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
                />
                <Bar dataKey="revenue" name="Revenue" fill="#B8860B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#EDE5D0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="Profit" fill="#4A7C4E" radius={[4, 4, 0, 0]} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Service Revenue Breakdown */}
          <div className="card p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-base" style={{ color: '#2D1B00' }}>Revenue by Service</h3>
              <p className="text-xs mt-0.5" style={{ color: '#9C7040' }}>This month breakdown</p>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={serviceRevenue} cx="50%" cy="50%" outerRadius={75} paddingAngle={3} dataKey="value">
                  {serviceRevenue.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {serviceRevenue.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-xs truncate" style={{ color: '#6B4C1E' }}>{item.name}</span>
                  </div>
                  <span className="text-xs font-medium" style={{ color: '#2D1B00' }}>
                    ₹{item.value.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Overview */}
        <div className="card p-5">
          <div className="mb-5">
            <h3 className="font-semibold text-base" style={{ color: '#2D1B00' }}>This Week's Performance</h3>
            <p className="text-xs mt-0.5" style={{ color: '#9C7040' }}>Daily patients and revenue</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="weeklyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#B8860B" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#B8860B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E8D6" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9C7040' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9C7040' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'white', border: '1px solid #EDE5D0', borderRadius: 8, fontSize: 12 }}
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? `₹${value.toLocaleString('en-IN')}` : value,
                  name === 'revenue' ? 'Revenue' : 'Patients',
                ]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#B8860B" strokeWidth={2} fill="url(#weeklyGrad)" />
              <Area type="monotone" dataKey="patients" stroke="#4A7C4E" strokeWidth={2} fill="none" strokeDasharray="4 2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Services Table */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b" style={{ borderColor: '#EDE5D0' }}>
            <h3 className="font-semibold text-base" style={{ color: '#2D1B00' }}>Top Revenue Services</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ background: '#FAF6EE', borderBottom: '1px solid #EDE5D0' }}>
                <th className="th">Service</th>
                <th className="th">Patients</th>
                <th className="th">Revenue</th>
                <th className="th">Avg. Per Patient</th>
                <th className="th">Growth</th>
              </tr>
            </thead>
            <tbody>
              {[
                { service: 'Panchakarma', patients: 32, revenue: 42000, avg: 1313, growth: '+18%', up: true },
                { service: 'Consultations', patients: 58, revenue: 28000, avg: 483, growth: '+12%', up: true },
                { service: 'Medicines', patients: 89, revenue: 18000, avg: 202, growth: '+8%', up: true },
                { service: 'Shirodhara', patients: 18, revenue: 12000, avg: 667, growth: '-3%', up: false },
                { service: 'Other', patients: 24, revenue: 8000, avg: 333, growth: '+5%', up: true },
              ].map((row) => (
                <tr key={row.service} className="tr">
                  <td className="td font-medium text-sm" style={{ color: '#2D1B00' }}>{row.service}</td>
                  <td className="td text-sm" style={{ color: '#6B4C1E' }}>{row.patients}</td>
                  <td className="td font-semibold text-sm" style={{ color: '#2D1B00' }}>₹{row.revenue.toLocaleString('en-IN')}</td>
                  <td className="td text-sm" style={{ color: '#6B4C1E' }}>₹{row.avg}</td>
                  <td className="td">
                    <span className={`text-xs font-medium flex items-center gap-1`}
                          style={{ color: row.up ? '#166534' : '#991b1b' }}>
                      {row.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {row.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
