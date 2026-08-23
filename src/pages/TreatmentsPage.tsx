import { useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { usePageAction } from '@/app/PageActionContext';

import { useToast } from '@/app/ToastContext';

import { PageShell } from '@/components/layout/PageShell';

import { BookTreatmentModal } from '@/components/treatments/BookTreatmentModal';

import { TreatmentsTable } from '@/components/treatments/TreatmentsTable';

import { AppIcon } from '@/components/ui/AppIcon';

import { AsyncStatus } from '@/components/ui/AsyncStatus';

import { Button } from '@/components/ui/Button';

import { FilterControl, ListPanel } from '@/components/ui/ListPanel';

import { Input } from '@/components/ui/Input';

import { SearchField } from '@/components/ui/SearchField';

import { Select } from '@/components/ui/Select';

import { TREATMENT_FILTER_OPTIONS } from '@/data/mock/treatments';

import { useAsyncData } from '@/hooks/useAsyncData';

import { ApiError } from '@/lib/api/client';

import {
  getAppointmentPatients,
  updateAppointmentTherapyStatus,
} from '@/lib/api/appointments';

import { createTreatment, getAllTreatments } from '@/lib/api/treatments';
import { getActiveTreatmentPlanMasters } from '@/lib/api/treatmentPlanMasters';

import { mapTreatmentDtoToRecord } from '@/lib/api/mappers';

import { getActiveTherapists } from '@/lib/api/therapists';

import { assets } from '@/lib/assets';

import type { BookTreatmentFormValues } from '@/lib/validation/patient.schema';
import type { TreatmentRecord } from '@/types';



export function TreatmentsPage() {

  const navigate = useNavigate();

  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');

  const [statusFilter, setStatusFilter] = useState('');

  const [planFilter, setPlanFilter] = useState('');

  const [dateFilter, setDateFilter] = useState('');

  const [bookOpen, setBookOpen] = useState(false);

  const [booking, setBooking] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    () => new Set(),
  );



  const { data, loading, error, reload } = useAsyncData(async () => {

    const [patients, therapists, treatments, treatmentPlans] = await Promise.all([
      getAppointmentPatients({ statusTab: 'ACTIVE' }).catch(() => []),
      getActiveTherapists().catch(() => []),
      getAllTreatments().catch(() => []),
      getActiveTreatmentPlanMasters().catch(() => []),
    ]);



    const patientsById = new Map(patients.map((p) => [p.patientId, p]));



    const records = treatments.map((dto) =>

      mapTreatmentDtoToRecord(

        dto,

        patientsById.get(dto.patientId)?.patientFullName,

      ),

    );



    return {

      records,

      lookupOptions: {

        patients: patients.map((p) => ({

          value: p.patientId,

          label: p.patientFullName,

        })),

        therapists: therapists.map((t) => ({
          value: t.id,
          label: t.name || t.therapistName || '—',
        })),
        treatmentPlans: treatmentPlans.map((plan) => ({
          value: plan.id,
          label: plan.name,
        })),
      },
      planFilterOptions: treatmentPlans.map((plan) => ({
        value: plan.name,
        label: plan.name,
      })),
    };
  }, {
    records: [],
    lookupOptions: { patients: [], therapists: [], treatmentPlans: [] },
    planFilterOptions: [] as { value: string; label: string }[],
  });



  const treatments = (data?.records ?? []).map((record) =>
    completedIds.has(record.id)
      ? {
          ...record,
          status: 'Completed' as const,
          completedSessions: record.totalSessions,
          remainingSessions: 0,
        }
      : record,
  );

  const lookupOptions = data?.lookupOptions ?? { patients: [], therapists: [], treatmentPlans: [] };
  const planFilterOptions = data?.planFilterOptions ?? [];



  const filteredTreatments = useMemo(() => {

    return treatments.filter((item) => {

      const matchesSearch =

        !searchQuery ||

        item.patient.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !statusFilter || item.status === statusFilter;

      const matchesPlan =

        !planFilter || item.treatmentPlanName === planFilter;

      const matchesDate =

        !dateFilter ||

        item.startDate === dateFilter ||

        item.endDate === dateFilter ||

        item.dateCreated === dateFilter;

      return matchesSearch && matchesStatus && matchesPlan && matchesDate;

    });

  }, [treatments, searchQuery, statusFilter, planFilter, dateFilter]);



  const headerAction = useMemo(

    () => (

      <Button

        className="gap-1.5 px-4 py-2 text-sm"

        onClick={() => setBookOpen(true)}

      >

        <AppIcon src={assets.icons.add} className="h-4 w-4" />

        Book Treatment

      </Button>

    ),

    [],

  );



  usePageAction(headerAction);



  const handleBookTreatment = async (formData: BookTreatmentFormValues) => {

    setBooking(true);

    try {

      await createTreatment({

        patientId: formData.patientId,

        treatmentPlanId: formData.treatmentPlanId,

        startDate: formData.startDate,

        endDate: formData.endDate,

        totalSessions: Number(formData.totalSessions),

        assignedTherapistId: formData.assignedTherapistId,

        treatmentStatus: formData.treatmentStatus ?? 'SCHEDULED',

        completedSessions: 0,

      });

      showToast({

        title: 'Treatment booked',

        message: 'The treatment plan has been scheduled successfully.',

      });

      await reload();

    } catch (err) {

      showToast({

        title: 'Booking failed',

        message:

          err instanceof ApiError

            ? err.message

            : err instanceof Error

              ? err.message

              : 'Could not book treatment.',

      });

    } finally {

      setBooking(false);

    }

  };

  const handleCompleteTreatment = async (record: TreatmentRecord) => {
    if (completingId) return;
    setCompletingId(record.id);
    try {
      await updateAppointmentTherapyStatus(
        record.appointmentTherapyId ?? record.id,
        'COMPLETED',
      );
      showToast({
        title: 'Therapy completed',
        message: `${record.patient}'s therapy status is now completed.`,
      });
      setCompletedIds((current) => new Set(current).add(record.id));
      await reload();
    } catch (err) {
      showToast({
        title: 'Status update failed',
        message:
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Could not complete the therapy.',
      });
    } finally {
      setCompletingId(null);
    }
  };



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

                placeholder="Treatment plan"

                options={planFilterOptions}

                value={planFilter}

                onChange={(e) => setPlanFilter(e.target.value)}

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
            onComplete={handleCompleteTreatment}
            completingId={completingId}

            onRowClick={(record) =>

              navigate(`/treatments/patient/${record.patientDetailId}`)

            }

          />

        </AsyncStatus>

      </ListPanel>



      <BookTreatmentModal

        open={bookOpen}

        onClose={() => setBookOpen(false)}

        onSubmit={handleBookTreatment}

        lookupOptions={lookupOptions}

        submitting={booking}

      />

    </PageShell>

  );

}

