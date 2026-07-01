import { useState } from 'react';
import { ChartModal } from '@/components/dashboard/ChartModal';
import { MedicineStockCard } from '@/components/dashboard/MedicineStockCard';
import { PatientRecordsTable } from '@/components/dashboard/PatientRecordsTable';
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
    <PageShell className="space-y-6">
      <div className="dash-grid">
        <StatCard title="Total Patients" stats={dashboardStats} type="patients" />
        <StatCard
          title="Total Appointments"
          stats={dashboardStats}
          type="appointments"
        />
        <StatCard title="Billing" stats={dashboardStats} type="billing" />
      </div>

      <div className="dash-grid-wide">
        <PatientTrendsChart
          data={patientTrendsData}
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

      <PatientRecordsTable records={recentPatientRecords} compact />

      <ChartModal
        open={chartOpen}
        onClose={() => setChartOpen(false)}
        data={patientTrendsFullYear}
      />
    </PageShell>
  );
}
