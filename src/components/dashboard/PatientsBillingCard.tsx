import { TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import {
  DashDivider,
  PeriodDropdown,
} from '@/components/dashboard/DashboardPrimitives';
import type { BillingPeriod } from '@/lib/api/billing';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { DashboardStats } from '@/types';

interface PatientsBillingCardProps {
  stats: DashboardStats;
  period: BillingPeriod;
  onPeriodChange: (period: BillingPeriod) => void;
}

/** Single Figma-aligned card: Total Patients | Billing with vertical separator. */
export function PatientsBillingCard({
  stats,
  period,
  onPeriodChange,
}: PatientsBillingCardProps) {
  const total = stats.totalPatients;
  const activePct = total > 0 ? Math.round((stats.activePatients / total) * 100) : 0;
  const inactivePct =
    total > 0 ? Math.round((stats.inactivePatients / total) * 100) : 0;

  return (
    <Card className="dashboard-card flex h-full flex-col p-0 lg:col-span-2">
      <div className="grid h-full min-h-0 grid-cols-1 divide-y divide-[#ebe4d8] lg:grid-cols-2 lg:divide-x lg:divide-y-0">
        <div className="flex flex-col p-5">
          <div className="mb-4 flex items-start justify-between gap-2">
            <h3 className="dashboard-card-title">Total Patients</h3>
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
        </div>

        <div className="flex flex-col p-5">
          <div className="mb-4 flex items-start justify-between gap-2">
            <h3 className="dashboard-card-title">Billing</h3>
            <PeriodDropdown value={period} onChange={onPeriodChange} />
          </div>

          <p className="font-sans text-[32px] font-bold leading-none tracking-tight text-[#422C23]">
            {formatCurrency(stats.billingTotal)}
          </p>

          <span className="mt-3 inline-flex w-fit rounded-full bg-[#F5F0E4] px-3 py-1.5 font-sans text-xs font-semibold leading-none text-[#BE880B]">
            Total Bills Generated:{' '}
            <span className="ml-1 font-bold">{stats.billsGenerated}</span>
          </span>

          <div className="mt-4 flex flex-1 flex-col gap-2.5">
            <div className="rounded-xl bg-[#FDFBF7] px-4 py-3">
              <p className="font-sans text-sm font-semibold leading-none text-[#BE880B]">
                Pending Payments
              </p>
              <p className="mt-2 font-sans text-xl font-bold leading-none tracking-tight text-[#422C23]">
                {formatCurrency(stats.pendingPayments)}
              </p>
            </div>
            <div className="rounded-xl bg-[#FDFBF7] px-4 py-3">
              <p className="font-sans text-sm font-semibold leading-none text-[#BE880B]">
                Collected Payments
              </p>
              <p className="mt-2 font-sans text-xl font-bold leading-none tracking-tight text-[#422C23]">
                {formatCurrency(stats.collectedPayments)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
