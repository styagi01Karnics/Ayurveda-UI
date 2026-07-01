import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { TreatmentsTable } from '@/components/treatments/TreatmentsTable';
import { SearchField } from '@/components/ui/SearchField';
import { Select } from '@/components/ui/Select';
import {
  initialTreatments,
  TREATMENT_FILTER_OPTIONS,
} from '@/data/mock/treatments';

export function TreatmentsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [visitTypeFilter, setVisitTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredTreatments = useMemo(() => {
    return initialTreatments.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.patient.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || item.status === statusFilter;
      const matchesVisit =
        !visitTypeFilter || item.therapyType === visitTypeFilter;
      const matchesDate = !dateFilter || item.dateCreated === dateFilter;
      return matchesSearch && matchesStatus && matchesVisit && matchesDate;
    });
  }, [searchQuery, statusFilter, visitTypeFilter, dateFilter]);

  return (
    <PageShell>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SearchField
          placeholder="Patient"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Select
          placeholder="Status"
          options={[...TREATMENT_FILTER_OPTIONS.status]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
        <Select
          placeholder="Visit type"
          options={[...TREATMENT_FILTER_OPTIONS.visitType]}
          value={visitTypeFilter}
          onChange={(e) => setVisitTypeFilter(e.target.value)}
        />
        <div className="relative">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
          {!dateFilter && (
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              Date Created
            </span>
          )}
        </div>
      </div>

      <TreatmentsTable
        records={filteredTreatments}
        onRowClick={(record) =>
          navigate(`/treatments/patient/${record.patientDetailId}`)
        }
      />
    </PageShell>
  );
}
