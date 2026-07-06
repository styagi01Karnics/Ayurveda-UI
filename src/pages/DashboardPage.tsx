import { useState } from 'react';
import { ChartModal } from '@/components/dashboard/ChartModal';
import { MedicineStockCard } from '@/components/dashboard/MedicineStockCard';
import { PatientRecordsTable } from '@/components/dashboard/PatientRecordsTable';
import { PatientsStatCard } from '@/components/dashboard/PatientsStatCard';
import { PatientTrendsChart } from '@/components/dashboard/PatientTrendsChart';
import { StatCard } from '@/components/dashboard/StatCard';
import { TodayScheduleCard } from '@/components/dashboard/TodayScheduleCard';
import { PageShell } from '@/components/layout/PageShell';
import {
  dashboardStats,
  lowStockItems,
  nextAppointment,
  ongoingAppointment,
  patientTrendsData,
  patientTrendsFullYear,
  recentPatientRecords,
} from '@/data/mock/dashboard';

export function DashboardPage() {
  const [chartOpen, setChartOpen] = useState(false);

  return (
    <PageShell className="w-full space-y-4">
      <div className="w-full space-y-4">
        <div className="grid w-full min-w-0 grid-cols-1 gap-4 lg:grid-cols-3">
          <PatientsStatCard stats={dashboardStats} />
          <StatCard
            title="Total Appointments"
            stats={dashboardStats}
            type="appointments"
          />
          <StatCard title="Billing" stats={dashboardStats} type="billing" />
        </div>

        <div className="grid w-full min-w-0 grid-cols-1 gap-4 lg:grid-cols-3">
          <PatientTrendsChart
            data={patientTrendsData}
            compact
            onExpand={() => setChartOpen(true)}
          />
          <MedicineStockCard
            totalStock={442}
            tablets={300}
            syrups={100}
            powder={42}
            lowStockItems={lowStockItems}
          />
          <TodayScheduleCard
            dateLabel="15 Oct 2026, Wed, 01:05 AM"
            ongoing={ongoingAppointment}
            next={nextAppointment}
            remaining={12}
          />
        </div>
      </div>

      <PatientRecordsTable records={recentPatientRecords} compact />

      <ChartModal
        open={chartOpen}
        onClose={() => setChartOpen(false)}
        data={patientTrendsFullYear}
      />
    </PageShell>
  );
}
