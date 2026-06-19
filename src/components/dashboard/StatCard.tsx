import { ChevronDown, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { DashboardStats } from '@/types';

interface StatCardProps {
  title: string;
  stats: DashboardStats;
  type: 'patients' | 'appointments' | 'billing';
}

export function StatCard({ title, stats, type }: StatCardProps) {
  if (type === 'billing') {
    return (
      <Card>
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-sm font-medium text-text-muted">{title}</h3>
          <PeriodDropdown />
        </div>
        <p className="text-2xl font-bold text-brown sm:text-3xl">
          {formatCurrency(stats.billingTotal)}
        </p>
        <span className="mt-2 inline-block rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold">
          Total Bills Generated: {stats.billsGenerated}
        </span>
        <div className="mt-4 space-y-2 text-sm">
          <p>
            <span className="text-text-muted">Pending Payments: </span>
            <span className="font-semibold text-gold">
              {formatCurrency(stats.pendingPayments)}
            </span>
          </p>
          <p>
            <span className="text-text-muted">Collected Payments: </span>
            <span className="font-semibold text-success">
              {formatCurrency(stats.collectedPayments)}
            </span>
          </p>
        </div>
      </Card>
    );
  }

  const isPatients = type === 'patients';
  const total = isPatients ? stats.totalPatients : stats.totalAppointments;
  const growth = isPatients ? stats.patientGrowth : stats.appointmentGrowth;
  const today = isPatients ? stats.patientsToday : stats.appointmentsToday;

  return (
    <Card>
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-sm font-medium text-text-muted">{title}</h3>
        <PeriodDropdown />
      </div>

      <div className="flex items-end gap-2">
        <p className="text-2xl font-bold text-brown sm:text-3xl">
          {formatNumber(total)}
        </p>
        <span className="mb-1 flex items-center gap-0.5 text-sm font-medium text-success">
          <TrendingUp className="h-4 w-4" />
          {growth}%
        </span>
      </div>

      <p className="mt-1 text-sm font-medium text-gold">
        +{today} Today
      </p>

      {isPatients ? (
        <div className="mt-4">
          <div className="mb-2 flex justify-between text-xs text-text-muted">
            <span>
              {stats.activePatients} Active Patients (
              {Math.round((stats.activePatients / total) * 100)}%)
            </span>
            <span>
              {stats.inactivePatients} Inactive Patients (
              {Math.round((stats.inactivePatients / total) * 100)}%)
            </span>
          </div>
          <div className="flex h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="bg-gold"
              style={{
                width: `${(stats.activePatients / total) * 100}%`,
              }}
            />
          </div>
        </div>
      ) : (
        <div className="mt-4 flex justify-between gap-2">
          {(['Confirmed', 'Cancelled', 'Follow-Up'] as const).map(
            (label, index) => (
              <GaugeMini
                key={label}
                label={label}
                color={
                  index === 0
                    ? 'text-success'
                    : index === 1
                      ? 'text-danger'
                      : 'text-gold'
                }
              />
            ),
          )}
        </div>
      )}
    </Card>
  );
}

function PeriodDropdown() {
  return (
    <button
      type="button"
      className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1 text-xs text-text-muted"
    >
      Monthly
      <ChevronDown className="h-3 w-3" />
    </button>
  );
}

function GaugeMini({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex flex-1 flex-col items-center">
      <div className="relative h-10 w-16 overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-8 rounded-t-full border-4 border-gray-100" />
        <div
          className={`absolute inset-x-0 bottom-0 h-8 rounded-t-full border-4 border-current ${color}`}
          style={{ clipPath: 'inset(40% 0 0 0)' }}
        />
      </div>
      <span className={`mt-1 text-[10px] font-medium ${color}`}>{label}</span>
      <span className="text-[10px] text-text-muted">60%</span>
    </div>
  );
}
