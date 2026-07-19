import { useMemo, useState } from 'react';
import { usePageAction } from '@/app/PageActionContext';
import { useToast } from '@/app/ToastContext';
import { PageShell } from '@/components/layout/PageShell';
import { AppointmentConfirmedModal } from '@/components/appointments/AppointmentConfirmedModal';
import { AppointmentsCalendar } from '@/components/appointments/AppointmentsCalendar';
import { AppointmentsTable } from '@/components/appointments/AppointmentsTable';
import { CalendarEventModal } from '@/components/appointments/CalendarEventModal';
import {
  CreatePatientModal,
  type BookingLookupOptions,
} from '@/components/appointments/CreatePatientModal';
import { FollowUpsTable } from '@/components/appointments/FollowUpsTable';
import { ScheduleFollowUpModal } from '@/components/appointments/ScheduleFollowUpModal';
import { CancelAppointmentModal } from '@/components/doctors/CancelAppointmentModal';
import { AppIcon } from '@/components/ui/AppIcon';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { Button } from '@/components/ui/Button';
import { FilterControl, ListPanel } from '@/components/ui/ListPanel';
import { SearchField } from '@/components/ui/SearchField';
import { Select } from '@/components/ui/Select';
import { Tabs } from '@/components/ui/Tabs';
import {
  APPOINTMENT_FILTER_OPTIONS,
  calendarEventDetails,
  calendarEvents,
  initialFollowUps,
} from '@/data/mock/appointments';
import { useAsyncData } from '@/hooks/useAsyncData';
import {
  getAllAppointmentsForPatients,
  getAllDoshas,
  getAllTherapies,
  getAllTreatmentCategories,
} from '@/lib/api/appointments';
import { bookAppointmentFlow } from '@/lib/api/booking';
import { ApiError } from '@/lib/api/client';
import { getAllDoctors } from '@/lib/api/doctors';
import { mapAppointmentToRecord } from '@/lib/api/mappers';
import { getAllPatients } from '@/lib/api/patients';
import { getAllTherapists } from '@/lib/api/therapists';
import { assets } from '@/lib/assets';
import { cn } from '@/lib/utils';
import type {
  CreatePatientValues,
  FollowUpFormValues,
} from '@/lib/validation/patient.schema';
import type {
  AppointmentRecord,
  CalendarEventDetail,
  FollowUpRecord,
  VisitType,
} from '@/types';

type AppointmentTab = 'appointments' | 'followUps';
type ViewMode = 'list' | 'calendar';

export function AppointmentsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<AppointmentTab>('appointments');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [followUps, setFollowUps] = useState(initialFollowUps);
  const [patientIdQuery, setPatientIdQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [visitTypeFilter, setVisitTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [createPatientOpen, setCreatePatientOpen] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<AppointmentRecord | null>(
    null,
  );
  const [confirmedOpen, setConfirmedOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] =
    useState<CalendarEventDetail | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [localAppointments, setLocalAppointments] = useState<
    AppointmentRecord[]
  >([]);

  const {
    data,
    loading,
    error,
    reload,
  } = useAsyncData(async () => {
    const [patients, doctors, therapists, categories, therapies, doshas] =
      await Promise.all([
        getAllPatients(),
        getAllDoctors(),
        getAllTherapists(),
        getAllTreatmentCategories(),
        getAllTherapies(),
        getAllDoshas(),
      ]);

    const doctorsById = new Map(doctors.map((d) => [d.id, d]));
    const appointments = await getAllAppointmentsForPatients(
      patients.map((p) => p.id),
    );

    const records = appointments.map((appt) =>
      mapAppointmentToRecord(appt, doctorsById),
    );

    const lookupOptions: BookingLookupOptions = {
      doctors: doctors.map((d) => ({
        value: d.id,
        label: d.doctorName,
      })),
      therapists: therapists.map((t) => ({
        value: t.id,
        label: t.therapistName,
      })),
      categories: categories.map((c) => ({
        value: c.id,
        label: c.categoryName,
      })),
      therapies: therapies.map((t) => ({
        value: t.id,
        label: t.therapyName,
        categoryId: t.categoryId,
      })),
      doshas: doshas.map((d) => ({
        value: d.name,
        label: d.name,
      })),
    };

    return { records, lookupOptions, doctors };
  }, {
    records: [] as AppointmentRecord[],
    lookupOptions: {
      doctors: [],
      therapists: [],
      categories: [],
      therapies: [],
      doshas: [],
    },
    doctors: [],
  });

  const appointments = useMemo(() => {
    const ids = new Set(localAppointments.map((a) => a.id));
    return [
      ...localAppointments,
      ...data.records.filter((r) => !ids.has(r.id)),
    ];
  }, [data.records, localAppointments]);

  const headerAction = useMemo(
    () =>
      activeTab === 'appointments' ? (
        <Button
          className="gap-1.5 px-4 py-2 text-sm"
          onClick={() => setCreatePatientOpen(true)}
        >
          <AppIcon src={assets.icons.add} className="h-4 w-4" />
          Book Appointment
        </Button>
      ) : (
        <Button
          className="gap-1.5 px-4 py-2 text-sm"
          onClick={() => setFollowUpOpen(true)}
        >
          <AppIcon src={assets.icons.add} className="h-4 w-4" />
          Book Follow Ups
        </Button>
      ),
    [activeTab],
  );

  usePageAction(headerAction);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((item) => {
      const matchesId =
        !patientIdQuery ||
        item.uhid.toLowerCase().includes(patientIdQuery.toLowerCase()) ||
        item.patient.toLowerCase().includes(patientIdQuery.toLowerCase());
      const matchesStatus = !statusFilter || item.status === statusFilter;
      const matchesVisit =
        !visitTypeFilter ||
        item.visitType === (visitTypeFilter as VisitType);
      const matchesDate = !dateFilter || item.dateCreated === dateFilter;
      return matchesId && matchesStatus && matchesVisit && matchesDate;
    });
  }, [appointments, patientIdQuery, statusFilter, visitTypeFilter, dateFilter]);

  const filteredFollowUps = useMemo(() => {
    return followUps.filter((item) => {
      const matchesId =
        !patientIdQuery ||
        item.uhid.toLowerCase().includes(patientIdQuery.toLowerCase());
      const matchesStatus = !statusFilter || item.status === statusFilter;
      const matchesVisit =
        !visitTypeFilter ||
        item.visitType === (visitTypeFilter as VisitType);
      const matchesDate = !dateFilter || item.dateCreated === dateFilter;
      return matchesId && matchesStatus && matchesVisit && matchesDate;
    });
  }, [followUps, patientIdQuery, statusFilter, visitTypeFilter, dateFilter]);

  const handleCancelRequest = (id: string) => {
    const item = appointments.find((a) => a.id === id);
    if (item) setCancelTarget(item);
  };

  const handleCancelConfirm = () => {
    if (!cancelTarget) return;
    setLocalAppointments((prev) =>
      prev.filter((item) => item.id !== cancelTarget.id),
    );
    showToast({
      title: 'Appointment has been cancelled',
      message: `${cancelTarget.patient}'s appointment on ${cancelTarget.appointmentDate} was cancelled.`,
    });
    setCancelTarget(null);
  };

  const handleCreatePatient = async (formData: CreatePatientValues) => {
    setSubmitting(true);
    try {
      const result = await bookAppointmentFlow(formData);
      const doctorName =
        data.doctors.find((d) => d.id === formData.assignedDoctor)
          ?.doctorName ?? formData.assignedDoctor;

      const patientCode =
        formData.patientId ?? result.patientId.slice(0, 8);

      const appointmentDate =
        formData.scheduleDate && formData.scheduleTime
          ? `${formData.scheduleDate}, ${formData.scheduleTime}`
          : formData.registrationDate;

      const newAppointment: AppointmentRecord = {
        id: String(
          result.appointment?.id ??
            result.appointment?.bookingId ??
            `ap-${Date.now()}`,
        ),
        uhid: patientCode.startsWith('#') ? patientCode : `#${patientCode}`,
        patient: formData.fullName,
        doctor: doctorName,
        visitType: (formData.consultationTypes[0] ??
          'Consultation') as VisitType,
        appointmentDate,
        dateCreated: formData.registrationDate,
        status: 'Scheduled',
      };

      setLocalAppointments((prev) => [newAppointment, ...prev]);
      setCreatePatientOpen(false);
      setConfirmedOpen(true);
      reload();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Failed to book appointment.';
      showToast({
        title: 'Booking failed',
        message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleScheduleFollowUp = (formData: FollowUpFormValues) => {
    const newFollowUp: FollowUpRecord = {
      id: `fu-${Date.now()}`,
      uhid: formData.patientId.startsWith('#')
        ? formData.patientId
        : `#${formData.patientId}`,
      patient: formData.fullName,
      doctor: formData.doctor,
      visitType: formData.visitType as VisitType,
      appointmentDate: `${formData.scheduleDate}, ${formData.scheduleTime}`,
      dateCreated: formData.scheduleDate,
      status: 'Upcoming',
    };
    setFollowUps((prev) => [newFollowUp, ...prev]);
    showToast({
      title: 'Follow-up Scheduled',
      message: `Follow-up for ${formData.fullName} has been scheduled successfully.`,
    });
  };

  const handleEventClick = (eventId: string) => {
    const detail = calendarEventDetails[eventId];
    if (detail) {
      setSelectedEvent(detail);
      return;
    }
    const event = calendarEvents.find((e) => e.id === eventId);
    if (event) {
      setSelectedEvent({
        id: event.id,
        title: event.title,
        appointmentDate: '15 Oct 2026, 01:05 AM',
        doctorName: 'Dr. Sheekha',
        doctorRole: 'Ayurvedic Physician',
        patientName: 'Khushi Shroff',
        patientAge: '23yrs',
        patientGender: 'Female',
        visitType: 'Consultation',
        dosha: 'Vata',
        condition: 'Joint Pain',
        lastVisit: '10 Sep, 2025',
        nextVisit: '10 Oct, 2025',
      });
    }
  };

  const tabsNode = (
    <Tabs
      tabs={[
        { id: 'appointments' as const, label: 'All Appointments' },
        { id: 'followUps' as const, label: 'All Follow Ups' },
      ]}
      activeTab={activeTab}
      onChange={(tab) => {
        setActiveTab(tab);
        setStatusFilter('');
      }}
    />
  );

  const viewToggleNode = (
    <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
      <button
        type="button"
        onClick={() => setViewMode('list')}
        className={cn(
          'rounded-md p-2 transition-colors',
          viewMode === 'list' ? 'bg-gold/15 text-gold' : 'text-text-muted',
        )}
        aria-label="List view"
      >
        <AppIcon
          src={assets.icons.listView}
          className="h-4 w-4"
          active={viewMode === 'list'}
        />
      </button>
      <button
        type="button"
        onClick={() => setViewMode('calendar')}
        className={cn(
          'rounded-md p-2 transition-colors',
          viewMode === 'calendar' ? 'bg-gold/15 text-gold' : 'text-text-muted',
        )}
        aria-label="Calendar view"
      >
        <AppIcon
          src={assets.icons.calendarView}
          className="h-4 w-4"
          active={viewMode === 'calendar'}
        />
      </button>
    </div>
  );

  return (
    <PageShell>
      {viewMode === 'list' ? (
        <ListPanel
          tabs={tabsNode}
          toolbar={viewToggleNode}
          filters={
            <>
              <FilterControl>
                <SearchField
                  placeholder="Patient ID"
                  value={patientIdQuery}
                  onChange={(e) => setPatientIdQuery(e.target.value)}
                />
              </FilterControl>
              <FilterControl>
                <Select
                  placeholder="Status"
                  options={
                    activeTab === 'appointments'
                      ? [...APPOINTMENT_FILTER_OPTIONS.status]
                      : [...APPOINTMENT_FILTER_OPTIONS.followUpStatus]
                  }
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
              </FilterControl>
              <FilterControl>
                <Select
                  placeholder="Visit type"
                  options={[...APPOINTMENT_FILTER_OPTIONS.visitType]}
                  value={visitTypeFilter}
                  onChange={(e) => setVisitTypeFilter(e.target.value)}
                />
              </FilterControl>
              <FilterControl>
                <InputDate value={dateFilter} onChange={setDateFilter} />
              </FilterControl>
            </>
          }
        >
          {activeTab === 'appointments' ? (
            <AsyncStatus
              loading={loading}
              error={error}
              onRetry={reload}
              empty={!loading && !error && filteredAppointments.length === 0}
              emptyMessage="No appointments found."
            >
              <AppointmentsTable
                embedded
                items={filteredAppointments}
                onCancel={handleCancelRequest}
              />
            </AsyncStatus>
          ) : (
            <FollowUpsTable embedded items={filteredFollowUps} />
          )}
        </ListPanel>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {tabsNode}
            {viewToggleNode}
          </div>
          <AppointmentsCalendar
            events={calendarEvents}
            onEventClick={handleEventClick}
          />
        </div>
      )}

      <CreatePatientModal
        open={createPatientOpen}
        onClose={() => setCreatePatientOpen(false)}
        onSubmit={handleCreatePatient}
        lookupOptions={data.lookupOptions}
        submitting={submitting}
      />

      <ScheduleFollowUpModal
        open={followUpOpen}
        onClose={() => setFollowUpOpen(false)}
        onSubmit={handleScheduleFollowUp}
        doctorOptions={
          data.lookupOptions.doctors.length > 0
            ? data.lookupOptions.doctors.map((d) =>
                typeof d === 'string' ? d : d.label,
              )
            : undefined
        }
      />

      <CancelAppointmentModal
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelConfirm}
      />

      <AppointmentConfirmedModal
        open={confirmedOpen}
        onClose={() => setConfirmedOpen(false)}
      />

      <CalendarEventModal
        open={Boolean(selectedEvent)}
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </PageShell>
  );
}

function InputDate({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
      />
      {!value && (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
          Date Created
        </span>
      )}
    </div>
  );
}
