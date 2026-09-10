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
      <Card className="dashboard-card flex h-full flex-col p-5">
        <div className="mb-4 flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-medium text-text-muted">{title}</h3>
          <PeriodDropdown value={period} onChange={onPeriodChange} />
        </div>

        <p className="text-[32px] font-bold leading-none tracking-tight text-brown">
          {formatCurrency(stats.billingTotal)}
        </p>

        <p className="mt-3 text-sm font-medium text-gold">
          Total Bills Generated: {stats.billsGenerated}
        </p>

        <div className="mt-auto space-y-3 pt-6">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-text-muted">Pending Payments:</span>
            <span className="text-sm font-semibold text-brown">
              {formatCurrency(stats.pendingPayments)}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm text-text-muted">Collected Payments:</span>
            <span className="text-sm font-semibold text-brown">
              {formatCurrency(stats.collectedPayments)}
            </span>
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
    <Card className="dashboard-card flex h-full flex-col p-5">
      <div className="mb-4 flex items-start justify-between gap-2">
        <h3 className="text-[15px] font-medium text-text-muted">{title}</h3>
        <PeriodDropdown value={period} onChange={onPeriodChange} />
      </div>

      <div className="flex items-end gap-2">
        <p className="text-[32px] font-bold leading-none tracking-tight text-brown">
          {formatNumber(total)}
        </p>
        <span className="mb-1 flex items-center gap-0.5 text-sm font-semibold text-success">
          <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />
          {stats.appointmentGrowth > 0
            ? `+${stats.appointmentGrowth}`
            : stats.appointmentGrowth}
          %
        </span>
      </div>

      <p className="mt-2.5 text-sm font-semibold text-gold">
        +{stats.appointmentsToday} Today
      </p>

      <DashDivider className="my-4" />

      <div className="mt-auto flex justify-between gap-1">
        <SemiCircleGauge
          label="Confirmed"
          percent={gaugePercent(confirmed, gaugeTotal)}
          count={confirmed}
          stroke="#3d8f5a"
        />
        <SemiCircleGauge
          label="Cancelled"
          percent={gaugePercent(cancelled, gaugeTotal)}
          count={cancelled}
          stroke="#c94c4c"
        />
        <SemiCircleGauge
          label="Follow-Up"
          percent={gaugePercent(followUp, gaugeTotal)}
          count={followUp}
          stroke="#e8943a"
        />
      </div>
    </Card>
  );
}
