import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageAction } from '@/app/PageActionContext';
import { PageShell } from '@/components/layout/PageShell';
import { BillInvoiceModal } from '@/components/patients/BillInvoiceModal';
import { BillingTable } from '@/components/billing/BillingTable';
import { AppIcon } from '@/components/ui/AppIcon';
import { FilterControl, ListPanel } from '@/components/ui/ListPanel';
import { SearchField } from '@/components/ui/SearchField';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { assets } from '@/lib/assets';
import {
  BILLING_FILTER_OPTIONS,
  initialBillingRecords,
} from '@/data/mock/billing';
import { getPatientByRecordId } from '@/data/mock/patients';
import type { BillingRecord } from '@/types';

export function BillingPage() {
  const navigate = useNavigate();
  const [records] = useState(initialBillingRecords);
  const [patientIdQuery, setPatientIdQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [invoicePatientId, setInvoicePatientId] = useState<string | null>(null);

  const headerAction = useMemo(
    () => (
      <Button
        className="gap-1.5 px-4 py-2 text-sm"
        onClick={() => navigate('/billing/generate')}
      >
        <AppIcon src={assets.icons.add} className="h-4 w-4" />
        Generate Invoice
      </Button>
    ),
    [navigate],
  );

  usePageAction(headerAction);

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const matchesId =
        !patientIdQuery ||
        item.patientId.toLowerCase().includes(patientIdQuery.toLowerCase()) ||
        item.secondaryPatientId.toLowerCase().includes(patientIdQuery.toLowerCase());
      const matchesStatus = !statusFilter || item.status === statusFilter;
      return matchesId && matchesStatus;
    });
  }, [records, patientIdQuery, statusFilter]);

  const invoicePatient = invoicePatientId
    ? getPatientByRecordId(invoicePatientId.replace('#', ''))
    : null;

  const handleDownload = (record: BillingRecord) => {
    setInvoicePatientId(record.patientId);
  };

  return (
    <PageShell>
      <ListPanel
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
                options={[...BILLING_FILTER_OPTIONS.status]}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </FilterControl>
          </>
        }
      >
        <BillingTable embedded records={filteredRecords} onDownload={handleDownload} />
      </ListPanel>

      <BillInvoiceModal
        open={Boolean(invoicePatient)}
        onClose={() => setInvoicePatientId(null)}
        patient={invoicePatient ?? null}
      />
    </PageShell>
  );
}
