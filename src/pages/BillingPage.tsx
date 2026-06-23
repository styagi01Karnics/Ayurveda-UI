import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePageAction } from '@/app/PageActionContext';
import { BillInvoiceModal } from '@/components/patients/BillInvoiceModal';
import { BillingTable } from '@/components/billing/BillingTable';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
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
        <Plus className="h-4 w-4" />
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
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
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
          options={[...BILLING_FILTER_OPTIONS.status]}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </div>

      <BillingTable records={filteredRecords} onDownload={handleDownload} />

      <BillInvoiceModal
        open={Boolean(invoicePatient)}
        onClose={() => setInvoicePatientId(null)}
        patient={invoicePatient ?? null}
      />
    </div>
  );
}
