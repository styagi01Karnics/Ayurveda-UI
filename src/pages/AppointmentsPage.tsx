import { useMemo, useState } from 'react';
import { CalendarDays, LayoutList, Plus, Search } from 'lucide-react';
import { usePageAction } from '@/app/PageActionContext';
import { AppointmentsCalendar } from '@/components/appointments/AppointmentsCalendar';
import { AppointmentsTable } from '@/components/appointments/AppointmentsTable';
import { CreatePatientModal } from '@/components/appointments/CreatePatientModal';
import { FollowUpsTable } from '@/components/appointments/FollowUpsTable';
import { ScheduleFollowUpModal } from '@/components/appointments/ScheduleFollowUpModal';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Tabs } from '@/components/ui/Tabs';
import { cn } from '@/lib/utils';
import {
  APPOINTMENT_FILTER_OPTIONS,
  calendarEvents,
  initialAppointments,
  initialFollowUps,
} from '@/data/mock/appointments';
import type { CreatePatientValues, FollowUpFormValues } from '@/lib/validation/patient.schema';
import type { FollowUpRecord, VisitType } from '@/types';

type AppointmentTab = 'appointments' | 'followUps';
type ViewMode = 'list' | 'calendar';

export function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<AppointmentTab>('appointments');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [appointments, setAppointments] = useState(initialAppointments);
  const [followUps, setFollowUps] = useState(initialFollowUps);
  const [patientIdQuery, setPatientIdQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [visitTypeFilter, setVisitTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [createPatientOpen, setCreatePatientOpen] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);

  const headerAction = useMemo(
    () =>
      activeTab === 'appointments' ? (
        <Button
          className="gap-1.5 px-4 py-2 text-sm"
          onClick={() => setCreatePatientOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Book Appointment
        </Button>
      ) : (
        <Button
          className="gap-1.5 px-4 py-2 text-sm"
          onClick={() => setFollowUpOpen(true)}
        >
          <Plus className="h-4 w-4" />
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
        item.uhid.toLowerCase().includes(patientIdQuery.toLowerCase());
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

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'Cancelled' as const } : item,
      ),
    );
  };

  const handleCreatePatient = (data: CreatePatientValues) => {
    const newAppointment = {
      id: `ap-${Date.now()}`,
      uhid: data.patientId.startsWith('#') ? data.patientId : `#${data.patientId}`,
      patient: data.fullName,
      doctor: data.assignedDoctor,
      visitType: (data.consultationTypes[0] ?? 'Consultation') as VisitType,
      appointmentDate: `${data.scheduleDate}, ${data.scheduleTime}`,
      dateCreated: data.registrationDate,
      status: 'Scheduled' as const,
    };
    setAppointments((prev) => [newAppointment, ...prev]);
  };

  const handleScheduleFollowUp = (data: FollowUpFormValues) => {
    const newFollowUp: FollowUpRecord = {
      id: `fu-${Date.now()}`,
      uhid: data.patientId.startsWith('#') ? data.patientId : `#${data.patientId}`,
      patient: data.fullName,
      doctor: data.doctor,
      visitType: data.visitType as VisitType,
      appointmentDate: `${data.scheduleDate}, ${data.scheduleTime}`,
      dateCreated: data.scheduleDate,
      status: 'Upcoming',
    };
    setFollowUps((prev) => [newFollowUp, ...prev]);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
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
            <LayoutList className="h-4 w-4" />
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
            <CalendarDays className="h-4 w-4" />
          </button>
        </div>
      </div>

      {viewMode === 'list' && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                placeholder="Patient ID"
                value={patientIdQuery}
                onChange={(e) => setPatientIdQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
            </div>
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
            <Select
              placeholder="Visit type"
              options={[...APPOINTMENT_FILTER_OPTIONS.visitType]}
              value={visitTypeFilter}
              onChange={(e) => setVisitTypeFilter(e.target.value)}
            />
            <InputDate
              value={dateFilter}
              onChange={setDateFilter}
            />
          </div>

          {activeTab === 'appointments' ? (
            <AppointmentsTable
              items={filteredAppointments}
              onCancel={handleCancelAppointment}
            />
          ) : (
            <FollowUpsTable items={filteredFollowUps} />
          )}
        </>
      )}

      {viewMode === 'calendar' && (
        <AppointmentsCalendar events={calendarEvents} />
      )}

      <CreatePatientModal
        open={createPatientOpen}
        onClose={() => setCreatePatientOpen(false)}
        onSubmit={handleCreatePatient}
      />

      <ScheduleFollowUpModal
        open={followUpOpen}
        onClose={() => setFollowUpOpen(false)}
        onSubmit={handleScheduleFollowUp}
      />
    </div>
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
        placeholder="Date Created"
      />
      {!value && (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
          Date Created
        </span>
      )}
    </div>
  );
}
