import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageAction } from '@/app/PageActionContext';
import { useToast } from '@/app/ToastContext';
import { PageShell } from '@/components/layout/PageShell';
import { CancelAppointmentModal } from '@/components/doctors/CancelAppointmentModal';
import { DoctorStatCards } from '@/components/doctors/DoctorStatCards';
import { DoctorScheduleTable } from '@/components/doctors/DoctorScheduleTable';
import { AppIcon } from '@/components/ui/AppIcon';
import { SearchField } from '@/components/ui/SearchField';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { assets } from '@/lib/assets';
import {
  doctorStats,
  DOCTOR_FILTER_OPTIONS,
  initialDoctorSchedule,
} from '@/data/mock/doctors';
import type { DoctorScheduleItem, VisitType } from '@/types';

export function DoctorsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [schedule, setSchedule] = useState(initialDoctorSchedule);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [visitTypeFilter, setVisitTypeFilter] = useState('');
  const [cancelTarget, setCancelTarget] = useState<DoctorScheduleItem | null>(null);

  const headerAction = useMemo(
    () => (
      <Button
        className="gap-1.5 px-4 py-2 text-sm"
        onClick={() => navigate('/appointments')}
      >
        <AppIcon src={assets.icons.add} className="h-4 w-4" />
        Book Appointment
      </Button>
    ),
    [navigate],
  );

  usePageAction(headerAction);

  const filteredSchedule = useMemo(() => {
    return schedule.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.patient.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        !statusFilter || item.status === statusFilter;
      const matchesVisit =
        !visitTypeFilter ||
        item.visitType === (visitTypeFilter as VisitType);
      return matchesSearch && matchesStatus && matchesVisit;
    });
  }, [schedule, searchQuery, statusFilter, visitTypeFilter]);

  const handleStart = (id: string) => {
    const item = schedule.find((s) => s.id === id);
    if (item) {
      navigate(`/doctors/patient/${item.patientDetailId}`);
    }
  };

  const handleCancelRequest = (id: string) => {
    const item = schedule.find((s) => s.id === id);
    if (item) {
      setCancelTarget(item);
    }
  };

  const handleCancelConfirm = () => {
    if (!cancelTarget) return;
    setSchedule((prev) => prev.filter((item) => item.id !== cancelTarget.id));
    showToast({
      title: 'Appointment has been cancelled',
      message: `${cancelTarget.patient}'s ${cancelTarget.time} ${cancelTarget.visitType} appointment was cancelled.`,
    });
    setCancelTarget(null);
  };

  return (
    <PageShell>
      <DoctorStatCards stats={doctorStats} />

      <div className="grid gap-3 sm:grid-cols-3">
        <SearchField
          placeholder="Search patient"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          placeholder="Status"
          options={[...DOCTOR_FILTER_OPTIONS.status]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
        <Select
          placeholder="Visit type"
          options={[...DOCTOR_FILTER_OPTIONS.visitType]}
          value={visitTypeFilter}
          onChange={(e) => setVisitTypeFilter(e.target.value)}
        />
      </div>

      <DoctorScheduleTable
        items={filteredSchedule}
        onStart={handleStart}
        onCancel={handleCancelRequest}
      />

      <CancelAppointmentModal
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelConfirm}
      />
    </PageShell>
  );
}
