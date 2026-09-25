import { useEffect, useMemo, useState } from 'react';
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
import { Card } from '@/components/ui/Card';
import { FilterControl, ListPanel } from '@/components/ui/ListPanel';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { SearchField } from '@/components/ui/SearchField';
import { Select } from '@/components/ui/Select';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import {
  APPOINTMENT_FILTER_OPTIONS,
} from '@/data/mock/appointments';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useClientPagination } from '@/hooks/useClientPagination';
import {
  cancelAppointment,
  getAllTherapies,
  getAllTreatmentCategories,
  getAppointmentPatients,
  getAppointmentsByStatus,
  getBookingDoshas,
  rescheduleAppointment,
} from '@/lib/api/appointments';
import { getActiveConsultationTypes } from '@/lib/api/consultationTypes';
import type { BookAppointmentResult } from '@/lib/api/booking';
import { ApiError } from '@/lib/api/client';
import { getActiveDoctors, getAllDoctors } from '@/lib/api/doctors';
import {
  cancelFollowUp,
  createFollowUp,
  getAllFollowUps,
} from '@/lib/api/followUps';
import { loadCalendarEventDetail } from '@/lib/api/loadCalendarEventDetail';
import {
  mapAppointmentRecordToCalendarDetail,
  mapAppointmentToRecord,
  mapFollowUpDtoToRecord,
  normalizeSlotTimeForApi,
  toApiConsultationTypeIds,
} from '@/lib/api/mappers';
import { getAllTherapists, mapTherapistSelectOptions } from '@/lib/api/therapists';
import { assets } from '@/lib/assets';
import { resolvePatientDisplayCode } from '@/lib/displayCodes';
import { mapFollowUpToCalendarAppointment } from '@/lib/calendarUtils';
import { cn, formatPersonName } from '@/lib/utils';
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
  const [followUpRescheduleTarget, setFollowUpRescheduleTarget] =
    useState<FollowUpRecord | null>(null);
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
  const [reschedulingFollowUp, setReschedulingFollowUp] = useState(false);
  const [localAppointments, setLocalAppointments] = useState<
    AppointmentRecord[]
  >([]);
  const [recordsOverride, setRecordsOverride] = useState<
    AppointmentRecord[] | null
  >(null);

  const {
    data,
    loading,
    error,
    reload: reloadAll,
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
        getAppointmentPatients({ statusTab: 'ACTIVE' }).catch(() => []),
        getAllFollowUps().catch(() => []),
      ]);

    const doctorsById = new Map(doctors.map((d) => [d.id, d]));
    const records = appointments.map((item) =>
      mapAppointmentToRecord(item, doctorsById),
    );

    const lookupOptions: BookingLookupOptions = {
      doctors: doctors.map((d) => ({
        value: d.id,
        label: formatPersonName(d.name || d.doctorName) || '—',
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
      patients: patients.map((p) => {
        const code = resolvePatientDisplayCode(p).replace(/^#/, '');
        return {
          value: p.patientId,
          label: `${code || '—'} — ${p.patientFullName}`,
          patientId: code,
          name: p.patientFullName,
        };
      }),
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

  const reload = () => {
    setRecordsOverride(null);
    setLocalAppointments([]);
    reloadAll();
  };

  const appointments = useMemo(() => {
    const baseRecords = recordsOverride ?? data.records;
    const ids = new Set(localAppointments.map((a) => a.id));
    return [
      ...localAppointments,
      ...baseRecords.filter((r) => !ids.has(r.id)),
    ];
  }, [data.records, localAppointments, recordsOverride]);

  /** Refresh appointments list once (avoids reloading all masters). */
  const refreshAppointmentsOnce = async () => {
    const appointmentsList = await getAppointmentsByStatus('ALL');
    const doctorsById = new Map(
      (data.doctors.length ? data.doctors : []).map((d) => [d.id, d]),
    );
    const records = appointmentsList.map((item) =>
      mapAppointmentToRecord(item, doctorsById),
    );
    setRecordsOverride(records);
    setLocalAppointments([]);
  };

  const followUps = data.followUpRecords;
  const followUpRescheduleDefaults = useMemo(
    () =>
      followUpRescheduleTarget
        ? {
            patientId: followUpRescheduleTarget.patientId ?? '',
            assignedDoctorId:
              followUpRescheduleTarget.assignedDoctorId ?? '',
            visitTypeId: followUpRescheduleTarget.visitTypeId ?? '',
            schedulingOption:
              followUpRescheduleTarget.schedulingOption ?? 'AFTER_7_DAYS',
            scheduleDate: followUpRescheduleTarget.dateCreated,
            scheduleTime: followUpRescheduleTarget.scheduleTime ?? '10:00',
            smsReminderEnabled:
              followUpRescheduleTarget.smsReminderEnabled ?? false,
            sourceBookingId: followUpRescheduleTarget.sourceBookingId,
          }
        : undefined,
    [followUpRescheduleTarget],
  );

  const headerAction = useMemo(
    () =>
      activeTab === 'appointments' ? (
        <Button
          className="h-9 gap-1.5 px-4 py-0 text-sm"
          onClick={() => setCreatePatientOpen(true)}
        >
          <AppIcon src={assets.icons.add} className="h-4 w-4" />
          Book Appointment
        </Button>
      ) : (
        <Button
          className="h-9 gap-1.5 px-4 py-0 text-sm"
          onClick={() => setFollowUpOpen(true)}
        >
          <AppIcon src={assets.icons.add} className="h-4 w-4" />
          Book Follow Ups
        </Button>
      ),
    [activeTab],
  );

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

  const appointmentsPaging = useClientPagination(filteredAppointments);
  const followUpsPaging = useClientPagination(filteredFollowUps);

  useEffect(() => {
    appointmentsPaging.resetPage();
    followUpsPaging.resetPage();
  }, [
    activeTab,
    patientIdQuery,
    statusFilter,
    visitTypeFilter,
    dateFilter,
    appointmentsPaging.resetPage,
    followUpsPaging.resetPage,
  ]);

  const handleCancelRequest = (id: string) => {
    const item = appointments.find((a) => a.id === id);
    if (item) setCancelTarget(item);
  };

  const handleCancelConfirm = async (reason: string) => {
    if (!cancelTarget || cancelling) return;
    setCancelling(true);
    try {
      await cancelAppointment(cancelTarget.id, reason);
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

      const matchedPatient = data.lookupOptions.patients?.find(
        (p) => p.value === result.patientId || p.value === formData.patientId,
      );
      const patientCode =
        matchedPatient?.patientId ||
        resolvePatientDisplayCode({
          patientId: formData.patientId,
        }).replace(/^#/, '') ||
        '—';

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
        patient: formatPersonName(formData.fullName) || formData.fullName,
        doctor: formatPersonName(doctorName) || '—',
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
      await refreshAppointmentsOnce();
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

  const handleRescheduleFollowUp = async (formData: FollowUpFormValues) => {
    if (!followUpRescheduleTarget) return;
    setReschedulingFollowUp(true);
    try {
      const time =
        formData.scheduleTime.length === 5
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
      await cancelFollowUp(followUpRescheduleTarget.id);
      showToast({
        title: 'Follow-up Rescheduled',
        message: 'The follow-up date and time have been updated.',
      });
      setFollowUpRescheduleTarget(null);
      await reload();
    } catch (err) {
      showToast({
        title: 'Reschedule failed',
        message:
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Could not reschedule follow-up.',
      });
    } finally {
      setReschedulingFollowUp(false);
    }
  };

  const calendarAppointments = useMemo(() => {
    if (activeTab === 'followUps') {
      return filteredFollowUps.map(mapFollowUpToCalendarAppointment);
    }
    return filteredAppointments;
  }, [activeTab, filteredAppointments, filteredFollowUps]);

  const handleEventClick = async (eventId: string) => {
    if (activeTab === 'followUps') {
      const followUp = filteredFollowUps.find((item) => item.id === eventId);
      if (followUp) setFollowUpRescheduleTarget(followUp);
      return;
    }

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
    <UnderlineTabs
      tabs={[
        { id: 'appointments' as const, label: 'All Appointments' },
        { id: 'followUps' as const, label: 'All Follow Ups' },
      ]}
      activeTab={activeTab}
      onChange={(tab) => {
        setActiveTab(tab);
        setStatusFilter('');
      }}
      variant="pill"
      className="border-none"
    />
  );

  const viewToggleNode = (
    <div
      className="flex items-center rounded-[16px] bg-white p-0.5 shadow-[0px_0px_3px_1px_#BE880B26]"
      role="group"
      aria-label="View mode"
    >
      {(['list', 'calendar'] as const).map((mode) => {
        const selected = viewMode === mode;
        const icon =
          mode === 'list' ? assets.icons.listView : assets.icons.calendarView;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => setViewMode(mode)}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-[16px] transition-colors',
              selected && 'bg-[#BE880B] shadow-[0px_0px_3px_1px_#BE880B26]',
            )}
            aria-label={mode === 'list' ? 'List view' : 'Calendar view'}
            aria-pressed={selected}
          >
            <img
              src={icon}
              alt=""
              aria-hidden
              className={cn(
                'h-4 w-4 object-contain',
                selected && 'brightness-0 invert',
              )}
            />
          </button>
        );
      })}
    </div>
  );

  return (
    <PageShell>
      {viewMode === 'list' ? (
        <ListPanel
          tabs={tabsNode}
          toolbar={viewToggleNode}
          actions={headerAction}
          filters={
            <>
              <FilterControl>
                <SearchField
                  placeholder="Patient Code"
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
                items={appointmentsPaging.pageItems}
                onCancel={handleCancelRequest}
                onReschedule={handleRescheduleRequest}
              />
              <Pagination
                page={appointmentsPaging.page}
                totalPages={appointmentsPaging.totalPages}
                totalElements={appointmentsPaging.totalElements}
                pageSize={appointmentsPaging.pageSize}
                onPageChange={appointmentsPaging.setPage}
                disabled={loading}
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
              <FollowUpsTable
                embedded
                items={followUpsPaging.pageItems}
                onReschedule={setFollowUpRescheduleTarget}
              />
              <Pagination
                page={followUpsPaging.page}
                totalPages={followUpsPaging.totalPages}
                totalElements={followUpsPaging.totalElements}
                pageSize={followUpsPaging.pageSize}
                onPageChange={followUpsPaging.setPage}
                disabled={loading}
              />
            </AsyncStatus>
          )}
        </ListPanel>
      ) : (
        <div className="space-y-4">
          <Card className="dashboard-card p-4 sm:p-5">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">{tabsNode}</div>
                {viewToggleNode}
              </div>
              <div className="flex h-9 items-center justify-end">{headerAction}</div>
            </div>
          </Card>
          <AsyncStatus
            loading={loading}
            error={error}
            onRetry={reload}
            empty={!loading && !error && calendarAppointments.length === 0}
            emptyMessage={
              activeTab === 'followUps'
                ? 'No follow-ups found for calendar.'
                : 'No appointments found for calendar.'
            }
          >
            <AppointmentsCalendar
              appointments={calendarAppointments}
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

      <ScheduleFollowUpModal
        open={Boolean(followUpRescheduleTarget)}
        onClose={() => setFollowUpRescheduleTarget(null)}
        onSubmit={handleRescheduleFollowUp}
        lookupOptions={{
          patients: data.lookupOptions.patients ?? [],
          doctors: data.lookupOptions.doctors,
          visitTypes: data.lookupOptions.consultationTypes.map((type) =>
            typeof type === 'string'
              ? { value: type, label: type }
              : { value: type.value, label: type.label },
          ),
        }}
        initialValues={followUpRescheduleDefaults}
        mode="reschedule"
        submitting={reschedulingFollowUp}
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
