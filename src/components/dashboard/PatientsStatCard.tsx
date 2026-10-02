import type { ReactNode } from 'react';
import { TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { DashDivider, PeriodDropdown } from '@/components/dashboard/DashboardPrimitives';
import type { BillingPeriod } from '@/lib/api/billing';
import { cn, formatNumber } from '@/lib/utils';
import type { DashboardStats } from '@/types';

interface PatientsStatCardProps {
  stats: DashboardStats;
  period: BillingPeriod;
  onPeriodChange: (period: BillingPeriod) => void;
  footer?: ReactNode;
  className?: string;
}

export function PatientsStatCard({
  stats,
  period,
  onPeriodChange,
  footer,
  className,
}: PatientsStatCardProps) {
  const total = stats.totalPatients;
  const activePct = total > 0 ? Math.round((stats.activePatients / total) * 100) : 0;
  const inactivePct =
    total > 0 ? Math.round((stats.inactivePatients / total) * 100) : 0;

  return (
    <Card className={cn('dashboard-card flex h-full min-h-0 flex-col', className)}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-[15px] font-medium text-text-muted">Total Patients</h3>
        <PeriodDropdown value={period} onChange={onPeriodChange} />
      </div>

      <div className="flex items-end gap-2">
        <p className="text-[28px] font-bold leading-none text-brown">
          {formatNumber(total)}
        </p>
        <span className="mb-0.5 flex items-center gap-0.5 text-sm font-medium text-success">
          <TrendingUp className="h-4 w-4" />
          {stats.patientGrowth}%
        </span>
      </div>

      <p className="mt-2 text-sm font-medium text-gold">+{stats.patientsToday} Today</p>

      <DashDivider className="my-4" />

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-lg font-bold leading-none text-brown">
            {formatNumber(stats.activePatients)}
          </p>
          <p className="mt-1 text-sm text-text-muted">{activePct}%</p>
          <p className="mt-1 text-[11px] text-text-muted">Active Patients</p>
          <div className="mt-2.5 h-7 w-full rounded-sm bg-gold" />
        </div>
        <div>
          <p className="text-lg font-bold leading-none text-brown">
            {formatNumber(stats.inactivePatients)}
          </p>
          <p className="mt-1 text-sm text-text-muted">{inactivePct}%</p>
          <p className="mt-1 text-[11px] text-text-muted">Inactive Patients</p>
          <div className="patient-inactive-bar mt-2.5 h-7 w-full rounded-sm" aria-hidden />
        </div>
      </div>

      {footer ? (
        <>
          <DashDivider className="mb-4 mt-5 shrink-0" />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">{footer}</div>
        </>
      ) : null}
    </Card>
  );
}
