import type { ReactNode } from 'react';
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
  footer?: ReactNode;
}

export function PatientsStatCard({
  stats,
  period,
  onPeriodChange,
  footer,
}: PatientsStatCardProps) {
  const total = stats.totalPatients;
  const activePct = total > 0 ? Math.round((stats.activePatients / total) * 100) : 0;
  const inactivePct =
    total > 0 ? Math.round((stats.inactivePatients / total) * 100) : 0;

  return (
    <Card className="dashboard-card flex h-full min-h-0 flex-col p-3.5">
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="dashboard-card-title">Total Patients</h3>
        <PeriodDropdown value={period} onChange={onPeriodChange} />
      </div>

      <div className="flex items-end gap-2">
        <p className="font-sans text-[26px] font-bold leading-none tracking-tight text-[#422C23]">
          {formatNumber(total)}
        </p>
        <span className="mb-0.5 flex items-center gap-0.5 font-sans text-sm font-semibold text-[#2E7D32]">
          <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />
          {stats.patientGrowth > 0 ? `+${stats.patientGrowth}` : stats.patientGrowth}%
        </span>
      </div>

      <p className="mt-1 font-sans text-sm font-medium text-[#BE880B]">
        +{stats.patientsToday} Today
      </p>

      <div className="mt-3 grid grid-cols-2 gap-5">
        <div>
          <p className="font-sans text-[16px] font-bold leading-none text-[#422C23]">
            {formatNumber(stats.activePatients)}
          </p>
          <p className="mt-4 font-sans text-[12px] font-medium leading-4 text-[#67554d]">
            {activePct}% Active Patients
          </p>
          <div className="mt-1.5 h-3.5 w-full rounded-[4px] bg-[#BE880B]" />
        </div>
        <div>
          <p className="font-sans text-[16px] font-bold leading-none text-[#422C23]">
            {formatNumber(stats.inactivePatients)}
          </p>
          <p className="mt-4 font-sans text-[12px] font-medium leading-4 text-[#67554d]">
            {inactivePct}% Inactive Patients
          </p>
          <div className="patient-inactive-bar mt-1.5 h-3.5 w-full rounded-[4px]" />
        </div>
      </div>

      {footer ? (
        <>
          <DashDivider className="my-2.5 shrink-0" />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">{footer}</div>
        </>
      ) : null}
    </Card>
  );
}
