import { useEffect, useMemo, useState } from 'react';
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
import {
  getDashboardBillingSummary,
  type BillingPeriod,
} from '@/lib/api/billing';
import {
  getAppointmentStats,
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
  const [patientsPeriod, setPatientsPeriod] =
    useState<BillingPeriod>('MONTHLY');
  const [appointmentsPeriod, setAppointmentsPeriod] =
    useState<BillingPeriod>('MONTHLY');
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [billingLoading, setBillingLoading] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // Base dashboard data — independent of period filters (no full remount on change).
  const { data, loading, error, reload } = useAsyncData(
    async () => {
      const [
        medStock,
        schedule,
        appointmentStats,
        patientCount,
        recentRows,
        trends,
      ] = await Promise.all([
        getDashboardMedicineStock().catch(() => null),
        getTodaysSchedule().catch(() => null),
        getAppointmentStats().catch(() => null),
        getPatientCount().catch(() => null),
        getAppointmentPatients({ statusTab: 'ACTIVE' }).catch(() => []),
        getPatientTrends().catch(() => []),
      ]);

      const nextStats = buildDashboardStats({
        patientCount,
        appointmentStats,
        billingSummary: null,
      });

      const recentPatients = recentRows
        .slice(0, 5)
        .map((row) =>
          mapPatientAppointmentListItemToPatientRecord(row, 'active'),
        );

      const patientTrends = normalizeTrendPoints(trends).filter((p) => p.month);

      return {
        medStock,
        schedule,
        baseStats: nextStats,
        recentPatients,
        patientTrends,
      };
    },
    {
      medStock: null as Awaited<
        ReturnType<typeof getDashboardMedicineStock>
      > | null,
      schedule: null,
      baseStats: EMPTY_STATS,
      recentPatients: [],
      patientTrends: [] as Array<{
        month: string;
        newPatients: number;
        followUps: number;
      }>,
    },
    [],
  );

  useEffect(() => {
    if (!loading) setHasLoadedOnce(true);
  }, [loading]);

  // Merge non-billing stats from base load; keep current billing numbers until refreshed.
  useEffect(() => {
    if (loading) return;
    setStats((prev) => ({
      ...data.baseStats,
      billingTotal: prev.billingTotal,
      billsGenerated: prev.billsGenerated,
      pendingPayments: prev.pendingPayments,
      collectedPayments: prev.collectedPayments,
    }));
  }, [loading, data.baseStats]);

  // Period filter: refresh billing card only — page stays mounted.
  useEffect(() => {
    if (!hasLoadedOnce) return;

    let active = true;
    setBillingLoading(true);
    getDashboardBillingSummary(billingPeriod)
      .then((summary) => {
        if (!active || !summary) return;
        setStats((prev) => ({
          ...prev,
          billingTotal: summary.totalRevenue ?? 0,
          billsGenerated: summary.totalBillsGenerated ?? 0,
          pendingPayments: summary.pendingPayments ?? 0,
          collectedPayments: summary.collectedPayments ?? 0,
        }));
      })
      .catch(() => {
        /* keep previous billing numbers */
      })
      .finally(() => {
        if (active) setBillingLoading(false);
      });

    return () => {
      active = false;
    };
  }, [billingPeriod, hasLoadedOnce]);

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
    <PageShell className="w-full min-w-0 space-y-3 overflow-x-hidden pb-6 pt-1">
      <AsyncStatus
        loading={loading && !hasLoadedOnce}
        error={error}
        onRetry={reload}
      >
        <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-3 lg:grid-cols-3 lg:grid-rows-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="flex h-full min-h-0 min-w-0 flex-col lg:row-span-2">
            <PatientsStatCard
              stats={stats}
              period={patientsPeriod}
              onPeriodChange={setPatientsPeriod}
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
            stats={stats}
            type="appointments"
            period={appointmentsPeriod}
            onPeriodChange={setAppointmentsPeriod}
          />
          <div
            className={
              billingLoading
                ? 'h-full opacity-80 transition-opacity'
                : 'h-full'
            }
          >
            <StatCard
              title="Billing"
              stats={stats}
              type="billing"
              period={billingPeriod}
              onPeriodChange={setBillingPeriod}
            />
          </div>
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
