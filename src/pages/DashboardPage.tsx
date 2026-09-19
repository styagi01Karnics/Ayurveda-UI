import { useMemo, useState } from 'react';
import { ChartModal } from '@/components/dashboard/ChartModal';
import { MedicineStockCard } from '@/components/dashboard/MedicineStockCard';
import { PatientRecordsTable } from '@/components/dashboard/PatientRecordsTable';
import { PatientsStatCard } from '@/components/dashboard/PatientsStatCard';
import { PatientTrendsChart } from '@/components/dashboard/PatientTrendsChart';
import { StatCard } from '@/components/dashboard/StatCard';
import { TodayScheduleCard } from '@/components/dashboard/TodayScheduleCard';
import { PageShell } from '@/components/layout/PageShell';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import {
  patientTrendsData,
  patientTrendsFullYear,
} from '@/data/mock/dashboard';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getAppointmentPatients } from '@/lib/api/appointments';
import type { BillingPeriod } from '@/lib/api/billing';
import {
  getAppointmentStats,
  getDashboardBillingSummary,
  getDashboardMedicineStock,
  getPatientTrends,
  getTodaysSchedule,
} from '@/lib/api/dashboard';
import { getPatientCount } from '@/lib/api/patients';
import {
  buildDashboardStats,
  mapPatientAppointmentListItemToPatientRecord,
  mapScheduleAppointment,
} from '@/lib/api/mappers';
import type { DashboardStats } from '@/types';

const EMPTY_STATS: DashboardStats = {
  totalPatients: 0,
  patientGrowth: 0,
  patientsToday: 0,
  activePatients: 0,
  inactivePatients: 0,
  totalAppointments: 0,
  appointmentGrowth: 0,
  appointmentsToday: 0,
  appointmentsConfirmed: 0,
  appointmentsCancelled: 0,
  appointmentsFollowUp: 0,
  billingTotal: 0,
  billsGenerated: 0,
  pendingPayments: 0,
  collectedPayments: 0,
};

function normalizeTrendPoints(
  rows: Array<{
    month?: string;
    monthLabel?: string;
    newPatients?: number;
    followUps?: number;
    [key: string]: unknown;
  }>,
) {
  return rows.map((row) => ({
    month: String(row.monthLabel || row.month || ''),
    newPatients: Number(row.newPatients ?? 0),
    followUps: Number(row.followUps ?? 0),
  }));
}

export function DashboardPage() {
  const [chartOpen, setChartOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('MONTHLY');

  const { data, loading, error, reload } = useAsyncData(
    async () => {
      const [
        medStock,
        schedule,
        appointmentStats,
        billingSummary,
        patientCount,
        recentRows,
        trends,
      ] = await Promise.all([
        getDashboardMedicineStock().catch(() => null),
        getTodaysSchedule().catch(() => null),
        getAppointmentStats().catch(() => null),
        getDashboardBillingSummary(billingPeriod).catch(() => null),
        getPatientCount().catch(() => null),
        getAppointmentPatients({ statusTab: 'ACTIVE' }).catch(() => []),
        getPatientTrends().catch(() => []),
      ]);

      const stats = buildDashboardStats({
        patientCount,
        appointmentStats,
        billingSummary,
      });

      const recentPatients = recentRows
        .slice(0, 5)
        .map((row) => mapPatientAppointmentListItemToPatientRecord(row, 'active'));

      const patientTrends = normalizeTrendPoints(trends).filter((p) => p.month);

      return {
        medStock,
        schedule,
        stats,
        recentPatients,
        patientTrends,
      };
    },
    {
      medStock: null as Awaited<ReturnType<typeof getDashboardMedicineStock>> | null,
      schedule: null,
      stats: EMPTY_STATS,
      recentPatients: [],
      patientTrends: [] as Array<{
        month: string;
        newPatients: number;
        followUps: number;
      }>,
    },
    [billingPeriod],
  );

  const medStock = data.medStock;
  const breakdown = medStock?.statusBreakdown;
  const totalStatus =
    (breakdown?.inStock ?? 0) +
    (breakdown?.outOfStock ?? 0) +
    (breakdown?.lowStock ?? 0);

  const inStockPct = totalStatus
    ? Math.round(((breakdown?.inStock ?? 0) / totalStatus) * 100)
    : medStock?.totalStock
      ? 100
      : 0;
  const outOfStockPct = totalStatus
    ? Math.round(((breakdown?.outOfStock ?? 0) / totalStatus) * 100)
    : 0;
  const lowStockPct = totalStatus
    ? Math.round(((breakdown?.lowStock ?? 0) / totalStatus) * 100)
    : 0;

  const lowStockList =
    medStock?.lowStockItems?.map((item) => ({
      name: item.medicineName,
      quantity: item.stockQuantity,
    })) ?? [];

  const scheduleDateLabel = useMemo(() => {
    if (data.schedule?.currentDateTime) {
      return new Date(data.schedule.currentDateTime).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [data.schedule?.currentDateTime]);

  const ongoing = mapScheduleAppointment(data.schedule?.ongoingAppointment);
  const next = mapScheduleAppointment(data.schedule?.nextAppointment);

  const trendData =
    data.patientTrends.length > 0 ? data.patientTrends : patientTrendsData;

  return (
    <PageShell className="w-full min-w-0 space-y-4 overflow-x-hidden pb-6 pt-1">
      <AsyncStatus loading={loading} error={error} onRetry={reload}>
        {/*
          5 cards — Total Patients spans full height of the other 4:
          [ Patients ] [ Appointments ] [ Billing  ]
          [ Patients ] [ Medicine     ] [ Schedule ]
        */}
        <div className="grid w-full min-w-0 grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-[auto_auto]">
          <div className="flex h-full min-h-0 min-w-0 flex-col lg:row-span-2">
            <PatientsStatCard
              stats={data.stats}
              period={billingPeriod}
              onPeriodChange={setBillingPeriod}
              footer={
                <PatientTrendsChart
                  data={trendData}
                  compact
                  embedded
                  onExpand={() => setChartOpen(true)}
                />
              }
            />
          </div>

          <StatCard
            title="Total Appointments"
            stats={data.stats}
            type="appointments"
            period={billingPeriod}
            onPeriodChange={setBillingPeriod}
          />
          <StatCard
            title="Billing"
            stats={data.stats}
            type="billing"
            period={billingPeriod}
            onPeriodChange={setBillingPeriod}
          />
          <MedicineStockCard
            totalStock={medStock?.totalStock ?? 0}
            tablets={medStock?.tablets ?? 0}
            syrups={medStock?.syrups ?? 0}
            powder={medStock?.powder ?? 0}
            lowStockItems={lowStockList}
            inStockPct={inStockPct}
            outOfStockPct={outOfStockPct}
            lowStockPct={lowStockPct}
            viewAllTo="/medicines"
          />
          <TodayScheduleCard
            dateLabel={scheduleDateLabel}
            ongoing={ongoing}
            next={next}
            remaining={data.schedule?.remainingToday ?? 0}
            viewFullScheduleTo="/appointments"
          />
        </div>
      </AsyncStatus>

      <PatientRecordsTable
        records={data.recentPatients}
        compact
        viewAllTo="/patients"
      />

      <ChartModal
        open={chartOpen}
        onClose={() => setChartOpen(false)}
        data={
          data.patientTrends.length > 0
            ? data.patientTrends
            : patientTrendsFullYear
        }
      />
    </PageShell>
  );
}
