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
import { RescheduleAppointmentModal } from '@/components/appointments/RescheduleAppointmentModal';
import { ScheduleFollowUpModal } from '@/components/appointments/ScheduleFollowUpModal';
import { CancelAppointmentModal } from '@/components/doctors/CancelAppointmentModal';
import { AppIcon } from '@/components/ui/AppIcon';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { Button } from '@/components/ui/Button';
import { FilterControl, ListPanel } from '@/components/ui/ListPanel';
import { Input } from '@/components/ui/Input';
import { SearchField } from '@/components/ui/SearchField';
import { Select } from '@/components/ui/Select';
import { Tabs } from '@/components/ui/Tabs';
import {
  APPOINTMENT_FILTER_OPTIONS,
} from '@/data/mock/appointments';
import { useAsyncData } from '@/hooks/useAsyncData';
import {
  cancelAppointment,
  getAllTherapies,
  getAllTreatmentCategories,
  getAppointmentsByStatus,
  getBookingDoshas,
  rescheduleAppointment,
} from '@/lib/api/appointments';
import { getActiveConsultationTypes } from '@/lib/api/consultationTypes';
import type { BookAppointmentResult } from '@/lib/api/booking';
import { ApiError } from '@/lib/api/client';
import { getActiveDoctors, getAllDoctors } from '@/lib/api/doctors';
import { createFollowUp, getAllFollowUps } from '@/lib/api/followUps';
import { loadCalendarEventDetail } from '@/lib/api/loadCalendarEventDetail';
import {
  mapAppointmentRecordToCalendarDetail,
  mapAppointmentToRecord,
  mapFollowUpDtoToRecord,
  normalizeSlotTimeForApi,
  toApiConsultationTypeIds,
} from '@/lib/api/mappers';
import { getAllPatients } from '@/lib/api/patients';
import { getAllTherapists, mapTherapistSelectOptions } from '@/lib/api/therapists';
import { assets } from '@/lib/assets';
import { cn } from '@/lib/utils';
import type {
  CreatePatientValues,
  FollowUpFormValues,
  RescheduleAppointmentFormValues,
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
  const [patientIdQuery, setPatientIdQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [visitTypeFilter, setVisitTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [createPatientOpen, setCreatePatientOpen] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<AppointmentRecord | null>(
    null,
  );
  const [rescheduleTarget, setRescheduleTarget] =
    useState<AppointmentRecord | null>(null);
  const [confirmedOpen, setConfirmedOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] =
    useState<CalendarEventDetail | null>(null);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [eventDetailLoading, setEventDetailLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [schedulingFollowUp, setSchedulingFollowUp] = useState(false);
  const [localAppointments, setLocalAppointments] = useState<
    AppointmentRecord[]
  >([]);

  const {
    data,
    loading,
    error,
    reload,
  } = useAsyncData(async () => {
    const [doctors, therapists, categories, therapies, doshas, consultationTypes, appointments, patients, followUpDtos] =
      await Promise.all([
        getActiveDoctors().catch(() => getAllDoctors().catch(() => [])),
        getAllTherapists().catch(() => []),
        getAllTreatmentCategories().catch(() => []),
        getAllTherapies().catch(() => []),
        getBookingDoshas().catch(() => []),
        getActiveConsultationTypes().catch(() => []),
        getAppointmentsByStatus('ALL').catch(() => []),
        getAllPatients().catch(() => []),
        getAllFollowUps().catch(() => []),
      ]);

    const doctorsById = new Map(doctors.map((d) => [d.id, d]));
    const records = appointments.map((item) =>
      mapAppointmentToRecord(item, doctorsById),
    );

    const lookupOptions: BookingLookupOptions = {
      doctors: doctors.map((d) => ({
        value: d.id,
        label: d.name || d.doctorName || '—',
      })),
      therapists: mapTherapistSelectOptions(therapists),
      categories: categories.map((c) => ({
        value: c.id,
        label: c.categoryName,
      })),
      therapies: therapies.map((t) => ({
        value: t.id,
        label: t.name || t.therapyName || '—',
        categoryId: t.categoryId,
      })),
      doshas: doshas.map((d) => ({
        value: d.id,
        label: d.name,
      })),
      consultationTypes: consultationTypes.map((type) => ({
        value: type.id,
        label: type.name,
      })),
      patients: patients.map((p) => ({
        value: p.id,
        label: p.fullName,
      })),
    };

    const followUpRecords = followUpDtos.map(mapFollowUpDtoToRecord);

    return { records, lookupOptions, doctors, followUpRecords };
  }, {
    records: [] as AppointmentRecord[],
    lookupOptions: {
      doctors: [],
      therapists: [],
      categories: [],
      therapies: [],
      doshas: [],
      consultationTypes: [],
      patients: [],
    },
    doctors: [],
    followUpRecords: [] as FollowUpRecord[],
  });

  const appointments = useMemo(() => {
    const ids = new Set(localAppointments.map((a) => a.id));
    return [
      ...localAppointments,
      ...data.records.filter((r) => !ids.has(r.id)),
    ];
  }, [data.records, localAppointments]);

  const followUps = data.followUpRecords;

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
        item.uhid.toLowerCase().includes(patientIdQuery.toLowerCase()) ||
        item.patient.toLowerCase().includes(patientIdQuery.toLowerCase());
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

  const handleCancelConfirm = async () => {
    if (!cancelTarget || cancelling) return;
    setCancelling(true);
    try {
      await cancelAppointment(cancelTarget.id);
      setLocalAppointments((prev) =>
        prev.filter((item) => item.id !== cancelTarget.id),
      );
      showToast({
        title: 'Appointment has been cancelled',
        message: `${cancelTarget.patient}'s appointment on ${cancelTarget.appointmentDate} was cancelled.`,
      });
      await reload();
    } catch (err) {
      showToast({
        title: 'Cancellation failed',
        message:
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Could not cancel appointment.',
      });
    } finally {
      setCancelling(false);
      setCancelTarget(null);
    }
  };

  const handleRescheduleRequest = (id: string) => {
    const item = appointments.find((a) => a.id === id);
    if (item) setRescheduleTarget(item);
  };

  const handleRescheduleSubmit = async (
    formData: RescheduleAppointmentFormValues,
  ) => {
    if (!rescheduleTarget || rescheduling) return;
    setRescheduling(true);
    try {
      await rescheduleAppointment(rescheduleTarget.id, {
        patientId: formData.patientId,
        registrationDate: formData.registrationDate,
        slotTime: normalizeSlotTimeForApi(formData.slotTime),
        assignedDoctorId: formData.assignedDoctorId,
        consultationTypeIds: toApiConsultationTypeIds(formData.consultationTypeIds),
      });

      const doctorLabel =
        data.lookupOptions.doctors.find(
          (d) =>
            (typeof d === 'string' ? d : d.value) === formData.assignedDoctorId,
        ) ?? rescheduleTarget.doctor;
      const doctorName =
        typeof doctorLabel === 'string' ? doctorLabel : doctorLabel.label;

      setLocalAppointments((prev) =>
        prev.filter((item) => item.id !== rescheduleTarget.id),
      );

      showToast({
        title: 'Appointment rescheduled',
        message: `${rescheduleTarget.patient}'s appointment with ${doctorName} has been rescheduled.`,
      });
      setRescheduleTarget(null);
      await reload();
    } catch (err) {
      showToast({
        title: 'Reschedule failed',
        message:
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Could not reschedule appointment.',
      });
    } finally {
      setRescheduling(false);
    }
  };

  const handleBookingComplete = async (
    result: BookAppointmentResult,
    formData: CreatePatientValues,
  ) => {
    setSubmitting(true);
    try {
      const doctorName =
        data.doctors.find((d) => d.id === formData.assignedDoctor)?.name ||
        data.doctors.find((d) => d.id === formData.assignedDoctor)?.doctorName ||
        formData.assignedDoctor;

      const patientCode =
        formData.patientId ?? result.patientId.slice(0, 8);

      const appointmentDate =
        formData.scheduleDate && formData.scheduleTime
          ? `${formData.scheduleDate}, ${formData.scheduleTime}`
          : `${formData.registrationDate}, ${formData.appointmentTime || '10:00'}`;

      const firstType = data.lookupOptions.consultationTypes.find(
        (t) =>
          (typeof t === 'string' ? t : t.value) ===
          formData.consultationTypeIds[0],
      );
      const firstTypeLabel =
        typeof firstType === 'string'
          ? firstType
          : firstType?.label ?? 'Consultation';

      const newAppointment: AppointmentRecord = {
        id: String(
          result.appointment?.id ??
            result.appointment?.bookingId ??
            `ap-${Date.now()}`,
        ),
        uhid: patientCode.startsWith('#') ? patientCode : `#${patientCode}`,
        patient: formData.fullName,
        doctor: doctorName || '—',
        visitType: (firstTypeLabel.toUpperCase().includes('THERAPY')
          ? 'Therapy'
          : 'Consultation') as VisitType,
        appointmentDate,
        dateCreated:
          formData.registrationDate ?? new Date().toISOString().slice(0, 10),
        status: 'Scheduled',
      };

      setLocalAppointments((prev) => [newAppointment, ...prev]);
      setCreatePatientOpen(false);
      setConfirmedOpen(true);
      await reload();
    } catch (err) {
      showToast({
        title: 'Error',
        message:
          err instanceof Error ? err.message : 'Could not refresh appointments.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleScheduleFollowUp = async (formData: FollowUpFormValues) => {
    setSchedulingFollowUp(true);
    try {
      const time = formData.scheduleTime.length === 5
        ? `${formData.scheduleTime}:00`
        : formData.scheduleTime;
      await createFollowUp({
        patientId: formData.patientId,
        assignedDoctorId: formData.assignedDoctorId,
        visitTypeId: formData.visitTypeId,
        appointmentDate: `${formData.scheduleDate}T${time}`,
        schedulingOption: formData.schedulingOption,
        smsReminderEnabled: formData.smsReminderEnabled ?? false,
        sourceBookingId: formData.sourceBookingId,
        status: 'UPCOMING',
      });
      showToast({
        title: 'Follow-up Scheduled',
        message: 'Follow-up has been scheduled successfully.',
      });
      await reload();
    } catch (err) {
      showToast({
        title: 'Scheduling failed',
        message:
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Could not schedule follow-up.',
      });
    } finally {
      setSchedulingFollowUp(false);
    }
  };

  const handleEventClick = async (eventId: string) => {
    const record = filteredAppointments.find((item) => item.id === eventId);
    if (!record) return;

    setEventModalOpen(true);
    setEventDetailLoading(true);
    setSelectedEvent(mapAppointmentRecordToCalendarDetail(record));

    try {
      const detail = await loadCalendarEventDetail(record);
      setSelectedEvent(detail);
    } catch {
      showToast({
        title: 'Could not load appointment details',
        message: 'Showing basic appointment information instead.',
      });
    } finally {
      setEventDetailLoading(false);
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
          viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50',
        )}
        aria-label="List view"
        aria-pressed={viewMode === 'list'}
      >
        <AppIcon
          src={assets.icons.listView}
          className={cn(
            'h-4 w-4',
            viewMode === 'list' ? 'brightness-0' : 'opacity-40',
          )}
        />
      </button>
      <button
        type="button"
        onClick={() => setViewMode('calendar')}
        className={cn(
          'rounded-md p-2 transition-colors',
          viewMode === 'calendar' ? 'bg-gray-100' : 'hover:bg-gray-50',
        )}
        aria-label="Calendar view"
        aria-pressed={viewMode === 'calendar'}
      >
        <AppIcon
          src={assets.icons.calendarView}
          className={cn(
            'h-4 w-4',
            viewMode === 'calendar' ? 'brightness-0' : 'opacity-45',
          )}
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
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
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
                onReschedule={handleRescheduleRequest}
              />
            </AsyncStatus>
          ) : (
            <AsyncStatus
              loading={loading}
              error={error}
              onRetry={reload}
              empty={!loading && !error && filteredFollowUps.length === 0}
              emptyMessage="No follow-ups found."
            >
              <FollowUpsTable embedded items={filteredFollowUps} />
            </AsyncStatus>
          )}
        </ListPanel>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {tabsNode}
            {viewToggleNode}
          </div>
          <AsyncStatus
            loading={loading}
            error={error}
            onRetry={reload}
            empty={!loading && !error && filteredAppointments.length === 0}
            emptyMessage="No appointments found for calendar."
          >
            <AppointmentsCalendar
              appointments={filteredAppointments}
              onEventClick={handleEventClick}
            />
          </AsyncStatus>
        </div>
      )}

      <CreatePatientModal
        open={createPatientOpen}
        onClose={() => setCreatePatientOpen(false)}
        onComplete={handleBookingComplete}
        lookupOptions={data.lookupOptions}
        submitting={submitting}
      />

      <ScheduleFollowUpModal
        open={followUpOpen}
        onClose={() => setFollowUpOpen(false)}
        onSubmit={handleScheduleFollowUp}
        lookupOptions={{
          patients: data.lookupOptions.patients ?? [],
          doctors: data.lookupOptions.doctors,
          visitTypes: data.lookupOptions.consultationTypes.map((type) =>
            typeof type === 'string'
              ? { value: type, label: type }
              : type,
          ),
        }}
        submitting={schedulingFollowUp}
      />

      <CancelAppointmentModal
        open={Boolean(cancelTarget)}
        onClose={() => !cancelling && setCancelTarget(null)}
        onConfirm={handleCancelConfirm}
        loading={cancelling}
      />

      <RescheduleAppointmentModal
        open={Boolean(rescheduleTarget)}
        onClose={() => !rescheduling && setRescheduleTarget(null)}
        onSubmit={handleRescheduleSubmit}
        appointment={rescheduleTarget}
        doctorOptions={data.lookupOptions.doctors}
        consultationTypeOptions={data.lookupOptions.consultationTypes}
        submitting={rescheduling}
      />

      <AppointmentConfirmedModal
        open={confirmedOpen}
        onClose={() => setConfirmedOpen(false)}
      />

      <CalendarEventModal
        open={eventModalOpen}
        event={selectedEvent}
        loading={eventDetailLoading}
        onClose={() => {
          setEventModalOpen(false);
          setSelectedEvent(null);
        }}
      />
    </PageShell>
  );
}
