import { TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { DashDivider, PeriodDropdown } from '@/components/dashboard/DashboardPrimitives';
import type { BillingPeriod } from '@/lib/api/billing';
import { formatNumber } from '@/lib/utils';
import type { DashboardStats } from '@/types';

interface PatientsStatCardProps {
  stats: DashboardStats;
  period: BillingPeriod;
  onPeriodChange: (period: BillingPeriod) => void;
}

export function PatientsStatCard({
  stats,
  period,
  onPeriodChange,
}: PatientsStatCardProps) {
  const total = stats.totalPatients;
  const activePct = total > 0 ? Math.round((stats.activePatients / total) * 100) : 0;
  const inactivePct =
    total > 0 ? Math.round((stats.inactivePatients / total) * 100) : 0;

  return (
    <Card className="dashboard-card flex h-full flex-col p-5">
      <div className="mb-4 flex items-start justify-between gap-2">
        <h3 className="text-[15px] font-medium text-text-muted">Total Patients</h3>
        <PeriodDropdown value={period} onChange={onPeriodChange} />
      </div>

      <div className="flex items-end gap-2">
        <p className="text-[32px] font-bold leading-none tracking-tight text-brown">
          {formatNumber(total)}
        </p>
        <span className="mb-1 flex items-center gap-0.5 text-sm font-semibold text-success">
          <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />
          {stats.patientGrowth > 0 ? `+${stats.patientGrowth}` : stats.patientGrowth}%
        </span>
      </div>

      <p className="mt-2.5 text-sm font-semibold text-gold">
        +{stats.patientsToday} Today
      </p>

      <DashDivider className="my-4" />

      <div className="mt-auto grid grid-cols-2 gap-6">
        <div>
          <p className="text-[13px] leading-snug text-brown">
            <span className="font-bold">{formatNumber(stats.activePatients)}</span>
            <span className="font-medium text-text-muted">
              {' '}
              ({activePct}%) Active Patients
            </span>
          </p>
          <div className="mt-2.5 h-3.5 w-full rounded-[3px] bg-gold" />
        </div>
        <div>
          <p className="text-[13px] leading-snug text-brown">
            <span className="font-bold">{formatNumber(stats.inactivePatients)}</span>
            <span className="font-medium text-text-muted">
              {' '}
              ({inactivePct}%) Inactive Patients
            </span>
          </p>
          <div className="patient-inactive-bar mt-2.5 h-3.5 w-full rounded-[3px]" />
        </div>
      </div>
    </Card>
  );
}
