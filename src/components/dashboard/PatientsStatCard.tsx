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
  const activePct = Math.round((stats.activePatients / total) * 100);
  const inactivePct = Math.round((stats.inactivePatients / total) * 100);

  return (
    <Card className="dashboard-card flex flex-col">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="text-base font-medium text-text-muted">Total Patients</h3>
        <PeriodDropdown value={period} onChange={onPeriodChange} />
      </div>

      <div className="flex items-end gap-2">
        <p className="text-2xl font-bold text-brown lg:text-[28px]">
          {formatNumber(total)}
        </p>
        <span className="mb-1 flex items-center gap-0.5 text-sm font-medium text-success">
          <TrendingUp className="h-4 w-4" />
          {stats.patientGrowth}%
        </span>
      </div>

      <p className="mt-1 text-sm font-medium text-gold">+{stats.patientsToday} Today</p>

      <DashDivider className="my-4" />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-brown">
              {formatNumber(stats.activePatients)}
            </span>
            <span className="text-sm text-text-muted">{activePct}%</span>
          </div>
          <p className="mt-0.5 text-[11px] text-text-muted">Active Patients</p>
          <div className="mt-2 h-4.5 w-full rounded-sm bg-gold" />
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-brown">
              {formatNumber(stats.inactivePatients)}
            </span>
            <span className="text-sm text-text-muted">{inactivePct}%</span>
          </div>
          <p className="mt-0.5 text-[11px] text-text-muted">Inactive Patients</p>
          <div className="mt-2 h-4.5 w-full rounded-sm bg-[#ebe4d8] patient-inactive-bar" />
        </div>
      </div>
    </Card>
  );
}
