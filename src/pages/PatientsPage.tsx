import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/app/ToastContext';
import { PageShell } from '@/components/layout/PageShell';
import { BillInvoiceModal } from '@/components/patients/BillInvoiceModal';
import { PatientsTable } from '@/components/patients/PatientsTable';
import { UploadReportsModal } from '@/components/patients/UploadReportsModal';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { FilterControl, ListPanel } from '@/components/ui/ListPanel';
import { SearchField } from '@/components/ui/SearchField';
import { Select } from '@/components/ui/Select';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { FILTER_OPTIONS } from '@/data/mock/patients';
import { useAsyncData } from '@/hooks/useAsyncData';
import {
  getAppointmentPatients,
  getBookingDoshas,
  type PatientListTab,
} from '@/lib/api/appointments';
import { getActiveConsultationTypes } from '@/lib/api/consultationTypes';
import { getInvoices } from '@/lib/api/billing';
import { mapPatientAppointmentListItemToPatientRecord } from '@/lib/api/mappers';
import { resolveErrorMessage, UI_MESSAGES } from '@/lib/uiMessages';
import type { PatientRecord, PatientStatus, VisitType } from '@/types';

type PatientTab = 'active' | 'inactive';

function toApiConsultationTypeId(
  visitType: string,
  consultationTypes: { id: string; name: string }[],
): string | undefined {
  if (!visitType) return undefined;
  const upper = visitType.toUpperCase();
  const match = consultationTypes.find((type) => {
    const name = type.name.toUpperCase();
    return upper.includes('THERAPY')
      ? name.includes('THERAPY')
      : name.includes('CONSULTATION');
  });
  return match?.id;
}

function toApiBookingStatus(status: string): string | undefined {
  if (!status) return undefined;
  const map: Record<string, string> = {
    Pending: 'SCHEDULED',
    Completed: 'COMPLETED',
    Cancelled: 'CANCELLED',
    'In Progress': 'IN_CONSULTATION',
  };
  return map[status] ?? status.toUpperCase().replace(/\s+/g, '_');
}

export function PatientsPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<PatientTab>('active');
  const [patientIdQuery, setPatientIdQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [visitTypeFilter, setVisitTypeFilter] = useState('');
  const [doshaFilter, setDoshaFilter] = useState('');
  const [uploadPatient, setUploadPatient] = useState<PatientRecord | null>(null);
  const [billInvoiceId, setBillInvoiceId] = useState<string | null>(null);

  const statusTab: PatientListTab = activeTab === 'active' ? 'ACTIVE' : 'INACTIVE';

  const {
    data,
    loading,
    error,
    reload,
  } = useAsyncData(
    async () => {
      const consultationTypes = await getActiveConsultationTypes().catch(() => []);
      const [rows, doshas] = await Promise.all([
        getAppointmentPatients({
          statusTab,
          search: patientIdQuery.trim() || undefined,
          bookingStatus: toApiBookingStatus(statusFilter),
          consultationTypeId: toApiConsultationTypeId(
            visitTypeFilter,
            consultationTypes,
          ),
          doshaId: doshaFilter || undefined,
        }),
        getBookingDoshas().catch(() => []),
      ]);

      return {
        patients: rows.map((row) =>
          mapPatientAppointmentListItemToPatientRecord(row, activeTab),
        ),
        doshaOptions: doshas.map((d) => ({ value: d.id, label: d.name })),
      };
    },
    { patients: [] as PatientRecord[], doshaOptions: [] as { value: string; label: string }[] },
    [statusTab, patientIdQuery, statusFilter, visitTypeFilter, doshaFilter, activeTab],
  );

  const filteredPatients = useMemo(() => {
    return data.patients.filter((patient) => {
      const matchesStatus =
        !statusFilter || patient.status === (statusFilter as PatientStatus);
      const matchesVisit =
        !visitTypeFilter ||
        patient.visitType === (visitTypeFilter as VisitType);
      return matchesStatus && matchesVisit;
    });
  }, [data.patients, statusFilter, visitTypeFilter]);

  const handleRowClick = (record: PatientRecord) => {
    navigate(`/patients/${record.detailId}`);
  };

  const handleDownloadBill = async (record: PatientRecord) => {
    try {
      const invoices = await getInvoices({ patientId: record.detailId });
      const latest = invoices[0];
      if (!latest?.id) {
        showToast({
          title: 'No invoice found',
          message: 'This patient does not have a bill to download yet.',
        });
        return;
      }
      setBillInvoiceId(latest.id);
    } catch (err) {
      showToast({
        title: 'Error',
        message: resolveErrorMessage(err, UI_MESSAGES.error.loadFailed),
      });
    }
  };

  return (
    <PageShell>
      <ListPanel
        tabs={
          <div>
            <UnderlineTabs
              tabs={[
                { id: 'active' as const, label: 'Active Patients' },
                { id: 'inactive' as const, label: 'Inactive Patients' },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
              className="border-none"
            />
            
          </div>
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
                options={data.doshaOptions}
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
        open={Boolean(billInvoiceId)}
        invoiceId={billInvoiceId}
        onClose={() => setBillInvoiceId(null)}
      />
    </PageShell>
  );
}
