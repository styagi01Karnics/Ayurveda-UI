import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { PatientRecordsTable } from '@/components/dashboard/PatientRecordsTable';
import { Select } from '@/components/ui/Select';
import { Tabs } from '@/components/ui/Tabs';
import { allPatients, FILTER_OPTIONS } from '@/data/mock/patients';
import type { Dosha, PatientStatus, VisitType } from '@/types';

type PatientTab = 'active' | 'inactive';

export function PatientsPage() {
  const [activeTab, setActiveTab] = useState<PatientTab>('active');
  const [patientIdQuery, setPatientIdQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [visitTypeFilter, setVisitTypeFilter] = useState('');
  const [doshaFilter, setDoshaFilter] = useState('');

  const filteredPatients = useMemo(() => {
    return allPatients.filter((patient) => {
      const matchesTab =
        activeTab === 'active' ? patient.isActive : !patient.isActive;
      const matchesId =
        !patientIdQuery ||
        patient.id.toLowerCase().includes(patientIdQuery.toLowerCase()) ||
        patient.secondaryId.toLowerCase().includes(patientIdQuery.toLowerCase());
      const matchesStatus =
        !statusFilter || patient.status === (statusFilter as PatientStatus);
      const matchesVisit =
        !visitTypeFilter ||
        patient.visitType === (visitTypeFilter as VisitType);
      const matchesDosha =
        !doshaFilter || patient.dosha === (doshaFilter as Dosha);

      return (
        matchesTab &&
        matchesId &&
        matchesStatus &&
        matchesVisit &&
        matchesDosha
      );
    });
  }, [
    activeTab,
    patientIdQuery,
    statusFilter,
    visitTypeFilter,
    doshaFilter,
  ]);

  return (
    <div className="space-y-5">
      <Tabs
        tabs={[
          { id: 'active' as const, label: 'Active Patients' },
          { id: 'inactive' as const, label: 'Inactive Patients' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

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
          options={FILTER_OPTIONS.status}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
        <Select
          placeholder="Visit type"
          options={FILTER_OPTIONS.visitType}
          value={visitTypeFilter}
          onChange={(e) => setVisitTypeFilter(e.target.value)}
        />
        <Select
          placeholder="Dosha"
          options={FILTER_OPTIONS.dosha}
          value={doshaFilter}
          onChange={(e) => setDoshaFilter(e.target.value)}
        />
      </div>

      <PatientRecordsTable
        records={filteredPatients}
        title=""
        showActions
      />
    </div>
  );
}
