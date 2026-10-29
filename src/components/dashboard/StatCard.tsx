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
      <Card className="dashboard-card flex h-full min-h-0 flex-col p-3.5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="dashboard-card-title">{title}</h3>
          <PeriodDropdown value={period} onChange={onPeriodChange} />
        </div>

        <p className="font-sans text-[26px] font-bold leading-none tracking-tight text-[#422C23]">
          {formatCurrency(stats.billingTotal)}
        </p>

        <span className="mt-2 inline-flex w-fit items-center rounded-full bg-[#F5F0E4] px-2.5 py-1 font-sans text-[10px] font-medium leading-none tracking-normal text-[#404040]">
          Total Bills Generated:{' '}
          <span className="ml-1 font-sans text-[10px] font-medium leading-none tracking-normal text-[#BE880B]">
            {stats.billsGenerated}
          </span>
        </span>

        <div className="mt-2.5 flex min-h-0 flex-1 flex-col gap-2">
          <div className="flex flex-1 flex-col justify-center rounded-xl bg-[#FDFBF7] px-3 py-2">
            <p className="font-sans text-[12px] font-medium leading-4 tracking-normal text-[#BE880B]">
              Pending Payments
            </p>
            <p className="mt-0.5 font-sans text-[14px] font-semibold leading-7 tracking-normal text-[#0A0A0A]">
              {formatCurrency(stats.pendingPayments)}
            </p>
          </div>
          <div className="flex flex-1 flex-col justify-center rounded-xl bg-[#FDFBF7] px-3 py-2">
            <p className="font-sans text-[12px] font-medium leading-4 tracking-normal text-[#BE880B]">
              Collected Payments
            </p>
            <p className="mt-0.5 font-sans text-[14px] font-semibold leading-7 tracking-normal text-[#0A0A0A]">
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
    <Card className="dashboard-card flex h-full min-h-0 flex-col p-3.5">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="dashboard-card-title">{title}</h3>
        <PeriodDropdown value={period} onChange={onPeriodChange} />
      </div>

      <div className="flex items-end gap-2">
        <p className="font-sans text-[26px] font-bold leading-none tracking-tight text-[#422C23]">
          {formatNumber(total)}
        </p>
        <span className="mb-0.5 flex items-center gap-0.5 font-sans text-sm font-semibold text-[#2E7D32]">
          <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />
          {stats.appointmentGrowth > 0
            ? `+${stats.appointmentGrowth}`
            : stats.appointmentGrowth}
          %
        </span>
      </div>

      <p className="mt-1 font-sans text-sm font-medium text-[#BE880B]">
        +{stats.appointmentsToday} Today
      </p>

      <DashDivider className="my-2.5" />

      <div className="mt-1 flex min-h-0 flex-1 items-end justify-between gap-1">
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
