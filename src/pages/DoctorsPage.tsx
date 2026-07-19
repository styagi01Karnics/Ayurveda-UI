import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageAction } from '@/app/PageActionContext';
import { PageShell } from '@/components/layout/PageShell';
import { DoctorStatCards } from '@/components/doctors/DoctorStatCards';
import { DoctorsTable } from '@/components/doctors/DoctorsTable';
import { AppIcon } from '@/components/ui/AppIcon';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { FilterControl, ListPanel } from '@/components/ui/ListPanel';
import { SearchField } from '@/components/ui/SearchField';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getAllDoctors } from '@/lib/api/doctors';
import { mapDoctorToDirectoryRecord } from '@/lib/api/mappers';
import { assets } from '@/lib/assets';
import type { ClinicStatus } from '@/types';

const STATUS_OPTIONS = ['Active', 'Inactive'] as const;

export function DoctorsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const {
    data: doctors,
    loading,
    error,
    reload,
  } = useAsyncData(async () => {
    const rows = await getAllDoctors();
    return rows.map(mapDoctorToDirectoryRecord);
  }, []);

  const departmentOptions = useMemo(
    () => [...new Set(doctors.map((d) => d.department))].sort(),
    [doctors],
  );

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doctor) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        doctor.name.toLowerCase().includes(query) ||
        doctor.doctorCode.toLowerCase().includes(query) ||
        doctor.specialization.toLowerCase().includes(query) ||
        doctor.email.toLowerCase().includes(query);
      const matchesStatus =
        !statusFilter || doctor.status === (statusFilter as ClinicStatus);
      const matchesDepartment =
        !departmentFilter || doctor.department === departmentFilter;
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [doctors, searchQuery, statusFilter, departmentFilter]);

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

  return (
    <PageShell className="space-y-4">
      <AsyncStatus loading={loading} error={error} onRetry={reload}>
        <DoctorStatCards doctors={doctors} />

        <ListPanel
          filters={
            <>
              <FilterControl>
                <SearchField
                  placeholder="Search doctor"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </FilterControl>
              <FilterControl>
                <Select
                  placeholder="Status"
                  options={[...STATUS_OPTIONS]}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
              </FilterControl>
              <FilterControl>
                <Select
                  placeholder="Department"
                  options={departmentOptions}
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                />
              </FilterControl>
            </>
          }
        >
          <AsyncStatus
            loading={false}
            error={null}
            empty={filteredDoctors.length === 0}
            emptyMessage="No doctors found."
          >
            <DoctorsTable embedded records={filteredDoctors} />
          </AsyncStatus>
        </ListPanel>
      </AsyncStatus>
    </PageShell>
  );
}
