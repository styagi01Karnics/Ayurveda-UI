import { TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import {
  DashDivider,
  PeriodDropdown,
  SemiCircleGauge,
} from '@/components/dashboard/DashboardPrimitives';
import type { BillingPeriod } from '@/lib/api/billing';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { DashboardStats } from '@/types';

interface StatCardProps {
  title: string;
  stats: DashboardStats;
  type: 'appointments' | 'billing';
  period: BillingPeriod;
  onPeriodChange: (period: BillingPeriod) => void;
}

function gaugePercent(part: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((part / total) * 100));
}

export function StatCard({
  title,
  stats,
  type,
  period,
  onPeriodChange,
}: StatCardProps) {
  if (type === 'billing') {
    return (
      <Card className="dashboard-card flex flex-col">
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-medium text-text-muted">{title}</h3>
          <PeriodDropdown value={period} onChange={onPeriodChange} />
        </div>
        <p className="text-[28px] font-bold leading-none text-brown">
          {formatCurrency(stats.billingTotal)}
        </p>
        <span className="mt-3 inline-block w-fit rounded-full bg-[#f3e8d4] px-3 py-1 text-xs font-medium text-gold">
          Total Bills Generated: {stats.billsGenerated}
        </span>
        <div className="mt-auto flex flex-col gap-3 pt-5">
          <div>
            <p className="text-xs text-text-muted">Pending Payments</p>
            <p className="mt-0.5 text-[15px] font-semibold text-brown">
              {formatCurrency(stats.pendingPayments)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Collected Payments</p>
            <p className="mt-0.5 text-[15px] font-semibold text-brown">
              {formatCurrency(stats.collectedPayments)}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const total = stats.totalAppointments;
  const confirmed = stats.appointmentsConfirmed;
  const cancelled = stats.appointmentsCancelled;
  const followUp = stats.appointmentsFollowUp;
  const gaugeTotal = Math.max(total, confirmed + cancelled + followUp, 1);

  return (
    <Card className="dashboard-card flex flex-col">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-medium text-text-muted">{title}</h3>
        <PeriodDropdown value={period} onChange={onPeriodChange} />
      </div>

      <div className="flex items-end gap-2">
        <p className="text-[28px] font-bold leading-none text-brown">
          {formatNumber(total)}
        </p>
        <span className="mb-0.5 flex items-center gap-0.5 text-sm font-medium text-success">
          <TrendingUp className="h-4 w-4" />
          {growth}%
        </span>
      </div>

      <p className="mt-2 text-sm font-medium text-gold">+{today} Today</p>

      <DashDivider className="my-2.5" />

      <div className="mt-auto flex justify-between gap-2 px-1">
        <SemiCircleGauge
          label="Confirmed"
          percent={gaugePercent(confirmed, gaugeTotal)}
          count={confirmed}
          stroke="#3D8B40"
        />
        <SemiCircleGauge
          label="Cancelled"
          percent={gaugePercent(cancelled, gaugeTotal)}
          count={cancelled}
          stroke="#E24B4A"
        />
        <SemiCircleGauge
          label="Follow-Up"
          percent={gaugePercent(followUp, gaugeTotal)}
          count={followUp}
          stroke="#E0A020"
        />
      </div>
    </Card>
  );
}
