import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { TreatmentsTable } from '@/components/treatments/TreatmentsTable';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { FilterControl, ListPanel } from '@/components/ui/ListPanel';
import { Input } from '@/components/ui/Input';
import { SearchField } from '@/components/ui/SearchField';
import { Select } from '@/components/ui/Select';
import { TREATMENT_FILTER_OPTIONS } from '@/data/mock/treatments';
import { useAsyncData } from '@/hooks/useAsyncData';
import {
  getAllAppointmentTherapiesForPatients,
  getAllTreatmentCategories,
  getAllTherapies,
} from '@/lib/api/appointments';
import { mapAppointmentTherapyToTreatment } from '@/lib/api/mappers';
import { getAllPatients } from '@/lib/api/patients';
import { getAllTherapists } from '@/lib/api/therapists';

export function TreatmentsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [visitTypeFilter, setVisitTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const { data: treatments, loading, error, reload } = useAsyncData(
    async () => {
      const [patients, therapists, categories, therapies] = await Promise.all([
        getAllPatients(),
        getAllTherapists(),
        getAllTreatmentCategories(),
        getAllTherapies(),
      ]);

      const patientsById = new Map(patients.map((p) => [p.id, p]));
      const therapistsById = new Map(therapists.map((t) => [t.id, t]));
      const categoriesById = new Map(categories.map((c) => [c.id, c]));
      const therapiesById = new Map(therapies.map((t) => [t.id, t]));

      const rows = await getAllAppointmentTherapiesForPatients(
        patients.map((p) => p.id),
      );

      return rows.map((row) => {
        const patient = row.patientId
          ? patientsById.get(row.patientId)
          : undefined;
        const therapist = row.assignedTherapistId
          ? therapistsById.get(row.assignedTherapistId)
          : undefined;
        const category = row.treatmentCategoryId
          ? categoriesById.get(row.treatmentCategoryId)
          : undefined;
        const therapyNames =
          row.therapyIds
            ?.map((id) => therapiesById.get(id)?.therapyName)
            .filter(Boolean) ?? [];

        return mapAppointmentTherapyToTreatment(
          {
            ...row,
            patientName: patient?.fullName ?? row.patientName,
            therapistName: therapist?.therapistName ?? row.therapistName,
            treatmentCategoryName:
              category?.categoryName ?? row.treatmentCategoryName,
            therapyNames: therapyNames.length
              ? (therapyNames as string[])
              : row.therapyNames,
          },
          patient?.fullName,
        );
      });
    },
    [],
  );

  const filteredTreatments = useMemo(() => {
    return treatments.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.patient.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || item.status === statusFilter;
      const matchesVisit =
        !visitTypeFilter || item.therapyType === visitTypeFilter;
      const matchesDate = !dateFilter || item.dateCreated === dateFilter;
      return matchesSearch && matchesStatus && matchesVisit && matchesDate;
    });
  }, [treatments, searchQuery, statusFilter, visitTypeFilter, dateFilter]);

  return (
    <PageShell>
      <ListPanel
        filters={
          <>
            <FilterControl>
              <SearchField
                placeholder="Patient"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </FilterControl>
            <FilterControl>
              <Select
                placeholder="Status"
                options={[...TREATMENT_FILTER_OPTIONS.status]}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </FilterControl>
            <FilterControl>
              <Select
                placeholder="Visit type"
                options={[...TREATMENT_FILTER_OPTIONS.visitType]}
                value={visitTypeFilter}
                onChange={(e) => setVisitTypeFilter(e.target.value)}
              />
            </FilterControl>
            <FilterControl>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </FilterControl>
          </>
        }
      >
        <AsyncStatus
          loading={loading}
          error={error}
          onRetry={reload}
          empty={!loading && !error && filteredTreatments.length === 0}
          emptyMessage="No treatments found."
        >
          <TreatmentsTable
            embedded
            records={filteredTreatments}
            onRowClick={(record) =>
              navigate(`/treatments/patient/${record.patientDetailId}`)
            }
          />
        </AsyncStatus>
      </ListPanel>
    </PageShell>
  );
}
