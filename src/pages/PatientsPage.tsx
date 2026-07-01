import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { BillInvoiceModal } from '@/components/patients/BillInvoiceModal';
import { PatientsTable } from '@/components/patients/PatientsTable';
import { UploadReportsModal } from '@/components/patients/UploadReportsModal';
import { SearchField } from '@/components/ui/SearchField';
import { Select } from '@/components/ui/Select';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import {
  allPatients,
  FILTER_OPTIONS,
  getPatientByDetailId,
  getPatientByRecordId,
} from '@/data/mock/patients';
import type { Dosha, PatientRecord, PatientStatus, VisitType } from '@/types';

type PatientTab = 'active' | 'inactive';

export function PatientsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PatientTab>('active');
  const [patientIdQuery, setPatientIdQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [visitTypeFilter, setVisitTypeFilter] = useState('');
  const [doshaFilter, setDoshaFilter] = useState('');
  const [uploadPatient, setUploadPatient] = useState<PatientRecord | null>(null);
  const [billPatientId, setBillPatientId] = useState<string | null>(null);

  const filteredPatients = useMemo(() => {
    return allPatients.filter((patient) => {
      const matchesTab =
        activeTab === 'active' ? patient.isActive : !patient.isActive;
      const matchesId =
        !patientIdQuery ||
        patient.id.toLowerCase().includes(patientIdQuery.toLowerCase()) ||
        patient.secondaryId.toLowerCase().includes(patientIdQuery.toLowerCase()) ||
        patient.detailId.includes(patientIdQuery);
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

  const billPatient =
    billPatientId
      ? getPatientByDetailId(billPatientId) ?? getPatientByRecordId(billPatientId) ?? null
      : null;

  const handleRowClick = (record: PatientRecord) => {
    navigate(`/patients/${record.detailId}`);
  };

  const handleDownloadBill = (record: PatientRecord) => {
    setBillPatientId(record.detailId);
  };

  return (
    <PageShell>
      <UnderlineTabs
        tabs={[
          { id: 'active' as const, label: 'Active Patients' },
          { id: 'inactive' as const, label: 'Inactive Patients' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="border-none"
      />

      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <SearchField
            placeholder="Patient ID"
            value={patientIdQuery}
            onChange={(e) => setPatientIdQuery(e.target.value)}
          />
          <Select
            placeholder="Status"
            options={[...FILTER_OPTIONS.status]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Select
            placeholder="Visit type"
            options={[...FILTER_OPTIONS.visitType]}
            value={visitTypeFilter}
            onChange={(e) => setVisitTypeFilter(e.target.value)}
          />
          <Select
            placeholder="Dosha"
            options={[...FILTER_OPTIONS.dosha]}
            value={doshaFilter}
            onChange={(e) => setDoshaFilter(e.target.value)}
          />
      </div>

      <PatientsTable
        records={filteredPatients}
        onRowClick={handleRowClick}
        onDownloadBill={handleDownloadBill}
        onUploadReport={setUploadPatient}
      />

      <UploadReportsModal
        open={Boolean(uploadPatient)}
        onClose={() => setUploadPatient(null)}
        patient={uploadPatient}
      />

      <BillInvoiceModal
        open={Boolean(billPatient)}
        onClose={() => setBillPatientId(null)}
        patient={billPatient}
      />
    </PageShell>
  );
}
