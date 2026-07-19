import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageShell } from '@/components/layout/PageShell';
import { BillInvoiceModal } from '@/components/patients/BillInvoiceModal';
import { PatientsTable } from '@/components/patients/PatientsTable';
import { UploadReportsModal } from '@/components/patients/UploadReportsModal';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { FilterControl, ListPanel } from '@/components/ui/ListPanel';
import { SearchField } from '@/components/ui/SearchField';
import { Select } from '@/components/ui/Select';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { FILTER_OPTIONS, getPatientByDetailId } from '@/data/mock/patients';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getAllPatients } from '@/lib/api/patients';
import { mapPatientToDetail, mapPatientToRecord } from '@/lib/api/mappers';
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

  const {
    data: patients,
    loading,
    error,
    reload,
  } = useAsyncData(async () => {
    const rows = await getAllPatients();
    return rows.map((patient) => {
      const mapped = mapPatientToRecord(patient);
      const mock = getPatientByDetailId(patient.id);
      if (!mock) return mapped;
      return {
        ...mapped,
        doctor: mock.doctor,
        visitType: mock.visitType,
        appointmentDate: mock.appointmentDate,
        dosha: mock.dosha,
        status: mock.status,
        isActive: mock.isActive,
      };
    });
  }, []);

  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesTab =
        activeTab === 'active' ? patient.isActive : !patient.isActive;
      const matchesId =
        !patientIdQuery ||
        patient.id.toLowerCase().includes(patientIdQuery.toLowerCase()) ||
        patient.secondaryId.toLowerCase().includes(patientIdQuery.toLowerCase()) ||
        patient.detailId.includes(patientIdQuery) ||
        patient.name.toLowerCase().includes(patientIdQuery.toLowerCase());
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
    patients,
    activeTab,
    patientIdQuery,
    statusFilter,
    visitTypeFilter,
    doshaFilter,
  ]);

  const billPatient = useMemo(() => {
    if (!billPatientId) return null;
    const mock = getPatientByDetailId(billPatientId);
    if (mock) return mock;

    const record = patients.find(
      (p) => p.detailId === billPatientId || p.id === billPatientId,
    );
    if (!record) return null;
    return mapPatientToDetail({
      id: record.detailId,
      patientCode: record.secondaryId,
      fullName: record.name,
      gender: 'UNKNOWN',
      dateOfBirth: '',
      age: 0,
      preferredLanguage: '',
      email: '',
      mobileNumber: record.phone.replace(/^\+91-?/, ''),
      state: '',
      city: '',
      address: '',
      emergencyContactName: '',
      emergencyRelationship: '',
      emergencyPhoneNumber: '',
      idProofType: '',
      idProofNumber: '',
      occupation: '',
      insuranceDetails: '',
      active: record.isActive,
    });
  }, [billPatientId, patients]);

  const handleRowClick = (record: PatientRecord) => {
    navigate(`/patients/${record.detailId}`);
  };

  const handleDownloadBill = (record: PatientRecord) => {
    setBillPatientId(record.detailId);
  };

  return (
    <PageShell>
      <ListPanel
        tabs={
          <UnderlineTabs
            tabs={[
              { id: 'active' as const, label: 'Active Patients' },
              { id: 'inactive' as const, label: 'Inactive Patients' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="border-none"
          />
        }
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
                options={[...FILTER_OPTIONS.status]}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </FilterControl>
            <FilterControl>
              <Select
                placeholder="Visit type"
                options={[...FILTER_OPTIONS.visitType]}
                value={visitTypeFilter}
                onChange={(e) => setVisitTypeFilter(e.target.value)}
              />
            </FilterControl>
            <FilterControl>
              <Select
                placeholder="Dosha"
                options={[...FILTER_OPTIONS.dosha]}
                value={doshaFilter}
                onChange={(e) => setDoshaFilter(e.target.value)}
              />
            </FilterControl>
          </>
        }
      >
        <AsyncStatus
          loading={loading}
          error={error}
          onRetry={reload}
          empty={!loading && !error && filteredPatients.length === 0}
          emptyMessage="No patients found."
        >
          <PatientsTable
            embedded
            records={filteredPatients}
            onRowClick={handleRowClick}
            onUploadReport={(record) => setUploadPatient(record)}
            onDownloadBill={handleDownloadBill}
          />
        </AsyncStatus>
      </ListPanel>

      <UploadReportsModal
        open={Boolean(uploadPatient)}
        patient={uploadPatient}
        onClose={() => setUploadPatient(null)}
      />

      <BillInvoiceModal
        open={Boolean(billPatient)}
        patient={billPatient}
        onClose={() => setBillPatientId(null)}
      />
    </PageShell>
  );
}
