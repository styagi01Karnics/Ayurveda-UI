import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageAction } from '@/app/PageActionContext';
import { useToast } from '@/app/ToastContext';
import { PageShell } from '@/components/layout/PageShell';
import { CancelAppointmentModal } from '@/components/doctors/CancelAppointmentModal';
import { DoctorScheduleStatCards } from '@/components/doctors/DoctorScheduleStatCards';
import { DoctorScheduleTable } from '@/components/doctors/DoctorScheduleTable';
import { AppIcon } from '@/components/ui/AppIcon';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { Button } from '@/components/ui/Button';
import { FilterControl, ListPanel } from '@/components/ui/ListPanel';
import { Select } from '@/components/ui/Select';
import { DOCTOR_FILTER_OPTIONS } from '@/data/mock/doctors';
import { useAsyncData } from '@/hooks/useAsyncData';
import {
  cancelAppointment,
  getAppointmentStats,
  getTodayAppointments,
  markAppointmentInConsultation,
} from '@/lib/api/appointments';
import { ApiError } from '@/lib/api/client';
import {
  mapAppointmentStatsToDoctorStats,
  mapTodayAppointmentToScheduleItem,
} from '@/lib/api/mappers';
import { assets } from '@/lib/assets';
import type { DoctorScheduleItem, VisitType } from '@/types';

export function DoctorsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [statusFilter, setStatusFilter] = useState('');
  const [visitTypeFilter, setVisitTypeFilter] = useState('');
  const [cancelTarget, setCancelTarget] = useState<DoctorScheduleItem | null>(
    null,
  );
  const [startingId, setStartingId] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [localSchedule, setLocalSchedule] = useState<DoctorScheduleItem[]>([]);

  const { data, loading, error, reload } = useAsyncData(async () => {
    const [stats, today] = await Promise.all([
      getAppointmentStats().catch(() => null),
      getTodayAppointments().catch(() => ({ appointments: [] })),
    ]);

    const schedule = (today.appointments ?? []).map(mapTodayAppointmentToScheduleItem);

    return {
      stats: mapAppointmentStatsToDoctorStats(stats),
      schedule,
    };
  }, {
    stats: mapAppointmentStatsToDoctorStats(null),
    schedule: [] as DoctorScheduleItem[],
  });

  const schedule = useMemo(() => {
    const ids = new Set(localSchedule.map((item) => item.id));
    return [
      ...localSchedule,
      ...data.schedule.filter((item) => !ids.has(item.id)),
    ];
  }, [data.schedule, localSchedule]);

  const filteredSchedule = useMemo(() => {
    return schedule.filter((item) => {
      const matchesStatus = !statusFilter || item.status === statusFilter;
      const matchesVisit =
        !visitTypeFilter ||
        item.visitType === (visitTypeFilter as VisitType);
      return matchesStatus && matchesVisit;
    });
  }, [schedule, statusFilter, visitTypeFilter]);

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

  const handleStart = async (bookingId: string) => {
    if (startingId) return;
    const item = schedule.find((row) => row.id === bookingId);
    if (!item) return;

    if (item.status === 'In Consultation') {
      navigate(`/doctors/patient/${item.patientDetailId}`);
      return;
    }

    setStartingId(bookingId);
    try {
      await markAppointmentInConsultation(bookingId);
      setLocalSchedule((prev) =>
        prev.map((row) =>
          row.id === bookingId
            ? { ...row, status: 'In Consultation' as const }
            : row,
        ),
      );
      navigate(`/doctors/patient/${item.patientDetailId}`);
    } catch (err) {
      showToast({
        title: 'Could not start consultation',
        message:
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Please try again.',
      });
    } finally {
      setStartingId(null);
    }
  };

  const handleCancelConfirm = async () => {
    if (!cancelTarget || cancelling) return;
    setCancelling(true);
    try {
      await cancelAppointment(cancelTarget.id);
      setLocalSchedule((prev) => prev.filter((row) => row.id !== cancelTarget.id));
      showToast({
        title: 'Appointment cancelled',
        message: `${cancelTarget.patient}'s appointment was cancelled.`,
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

  return (
    <PageShell className="space-y-4">
      <AsyncStatus loading={loading} error={error} onRetry={reload}>
        <DoctorScheduleStatCards stats={data.stats} />

        <ListPanel
          filters={
            <>
              <FilterControl>
                <Select
                  placeholder="Status"
                  options={[...DOCTOR_FILTER_OPTIONS.status]}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
              </FilterControl>
              <FilterControl>
                <Select
                  placeholder="Visit type"
                  options={[...DOCTOR_FILTER_OPTIONS.visitType]}
                  value={visitTypeFilter}
                  onChange={(e) => setVisitTypeFilter(e.target.value)}
                />
              </FilterControl>
            </>
          }
        >
          <AsyncStatus
            loading={false}
            error={null}
            empty={filteredSchedule.length === 0}
            emptyMessage="No appointments scheduled for today."
          >
            <DoctorScheduleTable
              embedded
              items={filteredSchedule}
              onStart={handleStart}
              onCancel={(id) => {
                const item = schedule.find((row) => row.id === id);
                if (item) setCancelTarget(item);
              }}
              startingId={startingId}
            />
          </AsyncStatus>
        </ListPanel>
      </AsyncStatus>

      <CancelAppointmentModal
        open={Boolean(cancelTarget)}
        onClose={() => !cancelling && setCancelTarget(null)}
        onConfirm={handleCancelConfirm}
        loading={cancelling}
      />
    </PageShell>
  );
}
