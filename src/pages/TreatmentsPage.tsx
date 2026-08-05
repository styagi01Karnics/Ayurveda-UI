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

import { createTreatment, getAllTreatments } from '@/lib/api/treatments';

import { mapTreatmentDtoToRecord } from '@/lib/api/mappers';

import { getAllPatients } from '@/lib/api/patients';

import { getAllTherapists } from '@/lib/api/therapists';

import { assets } from '@/lib/assets';

import type { BookTreatmentFormValues } from '@/lib/validation/patient.schema';



export function TreatmentsPage() {

  const navigate = useNavigate();

  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');

  const [statusFilter, setStatusFilter] = useState('');

  const [planFilter, setPlanFilter] = useState('');

  const [dateFilter, setDateFilter] = useState('');

  const [bookOpen, setBookOpen] = useState(false);

  const [booking, setBooking] = useState(false);



  const { data, loading, error, reload } = useAsyncData(async () => {

    const [patients, therapists, treatments] = await Promise.all([

      getAllPatients().catch(() => []),

      getAllTherapists().catch(() => []),

      getAllTreatments().catch(() => []),

    ]);



    const patientsById = new Map(patients.map((p) => [p.id, p]));



    const records = treatments.map((dto) =>

      mapTreatmentDtoToRecord(

        dto,

        patientsById.get(dto.patientId)?.fullName,

      ),

    );



    return {

      records,

      lookupOptions: {

        patients: patients.map((p) => ({

          value: p.id,

          label: p.fullName,

        })),

        therapists: therapists.map((t) => ({

          value: t.id,

          label: t.name || t.therapistName || '—',

        })),

      },

    };

  }, {
    records: [],
    lookupOptions: { patients: [], therapists: [] },
  });



  const treatments = data?.records ?? [];

  const lookupOptions = data?.lookupOptions ?? { patients: [], therapists: [] };



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

        treatmentPlanName: formData.treatmentPlanName,

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

                options={[...TREATMENT_FILTER_OPTIONS.treatmentPlan]}

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

