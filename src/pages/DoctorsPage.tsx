import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePageAction } from '@/app/PageActionContext';
import { useToast } from '@/app/ToastContext';
import { DoctorStatCards } from '@/components/doctors/DoctorStatCards';
import { DoctorScheduleTable } from '@/components/doctors/DoctorScheduleTable';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import {
  doctorStats,
  DOCTOR_FILTER_OPTIONS,
  initialDoctorSchedule,
} from '@/data/mock/doctors';
import type { VisitType } from '@/types';

export function DoctorsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [schedule, setSchedule] = useState(initialDoctorSchedule);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [visitTypeFilter, setVisitTypeFilter] = useState('');

  const headerAction = useMemo(
    () => (
      <Button
        className="gap-1.5 px-4 py-2 text-sm"
        onClick={() => navigate('/appointments')}
      >
        <Plus className="h-4 w-4" />
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
    setSchedule((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'Completed' as const } : item,
      ),
    );
  };

  const handleCancel = (id: string) => {
    const item = schedule.find((s) => s.id === id);
    setSchedule((prev) => prev.filter((item) => item.id !== id));
    if (item) {
      showToast({
        title: 'Appointment Cancelled',
        message: `${item.patient} has cancelled her ${item.time} appointment for ${item.visitType}.`,
        time: '3 Minutes Ago',
      });
    }
  };

  return (
    <div className="space-y-5">
      <DoctorStatCards stats={doctorStats} />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search patient"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </div>
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
        onCancel={handleCancel}
      />
    </div>
  );
}
