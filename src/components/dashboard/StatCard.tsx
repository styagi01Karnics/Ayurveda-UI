import { TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import {
  DashDivider,
  PeriodDropdown,
  SemiCircleGauge,
} from '@/components/dashboard/DashboardPrimitives';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { DashboardStats } from '@/types';

interface StatCardProps {
  title: string;
  stats: DashboardStats;
  type: 'appointments' | 'billing';
}

export function StatCard({ title, stats, type }: StatCardProps) {
  if (type === 'billing') {
    return (
      <Card className="dashboard-card">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-base font-medium text-text-muted">{title}</h3>
          <PeriodDropdown />
        </div>
        <p className="text-2xl font-bold text-brown lg:text-[28px]">
          {formatCurrency(stats.billingTotal)}
        </p>
        <span className="mt-2 inline-block rounded-full bg-[#f3e8d4] px-3 py-1 text-xs font-medium text-gold">
          Total Bills Generated: {stats.billsGenerated}
        </span>
        <div className="mt-4 flex flex-col gap-2">
          <div className="rounded-xl bg-[#fffbf2] px-3 py-2.5">
            <p className="text-xs text-text-muted">Pending Payments</p>
            <p className="mt-0.5 text-sm font-semibold text-brown">
              {formatCurrency(stats.pendingPayments)}
            </p>
          </div>
          <div className="rounded-xl bg-[#fffbf2] px-3 py-2.5">
            <p className="text-xs text-text-muted">Collected Payments</p>
            <p className="mt-0.5 text-sm font-semibold text-brown">
              {formatCurrency(stats.collectedPayments)}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const total = stats.totalAppointments;
  const growth = stats.appointmentGrowth;
  const today = stats.appointmentsToday;

  return (
    <Card className="dashboard-card">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-base font-medium text-text-muted">{title}</h3>
        <PeriodDropdown />
      </div>

      <div className="flex items-end gap-2">
        <p className="text-2xl font-bold text-brown lg:text-[28px]">
          {formatNumber(total)}
        </p>
        <span className="mb-1 flex items-center gap-0.5 text-sm font-medium text-success">
          <TrendingUp className="h-4 w-4" />
          {growth}%
        </span>
      </div>

      <p className="mt-1 text-sm font-medium text-gold">+{today} Today</p>

      <DashDivider className="my-4" />

      <div className="flex justify-between gap-1">
        <SemiCircleGauge
          label="Confirmed"
          percent={60}
          count={60}
          stroke="#3d8f5a"
        />
        <SemiCircleGauge
          label="Cancelled"
          percent={60}
          count={60}
          stroke="#c94c4c"
        />
        <SemiCircleGauge
          label="Follow-Up"
          percent={60}
          count={60}
          stroke="#be880b"
        />
      </div>
    </Card>
  );
}
