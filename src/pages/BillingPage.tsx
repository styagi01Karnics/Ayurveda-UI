import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageAction } from '@/app/PageActionContext';
import { PageShell } from '@/components/layout/PageShell';
import { BillInvoiceModal } from '@/components/patients/BillInvoiceModal';
import { BillingTable } from '@/components/billing/BillingTable';
import { AppIcon } from '@/components/ui/AppIcon';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { FilterControl, ListPanel } from '@/components/ui/ListPanel';
import { SearchField } from '@/components/ui/SearchField';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { assets } from '@/lib/assets';
import { BILLING_FILTER_OPTIONS } from '@/data/mock/billing';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getBillings, getInvoices, type InvoiceStatus } from '@/lib/api/billing';
import {
  mapBillingDraftToRecord,
  mapInvoiceToBillingRecord,
} from '@/lib/api/mappers';
import { getAllPatients } from '@/lib/api/patients';
import { formatPatientCode } from '@/lib/displayCodes';
import type { BillingRecord } from '@/types';

type BillingTab = 'invoices' | 'pending';

function toApiInvoiceStatus(status: string): InvoiceStatus | undefined {
  if (!status) return undefined;
  const lower = status.toLowerCase();
  if (lower === 'completed') return 'COMPLETED';
  if (lower === 'ongoing') return 'ONGOING';
  if (lower === 'unpaid') return 'UNPAID';
  if (lower === 'partial') return 'PARTIAL';
  return undefined;
}

export function BillingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<BillingTab>('invoices');
  const [patientIdQuery, setPatientIdQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [billInvoiceId, setBillInvoiceId] = useState<string | null>(null);

  const { data: records, loading, error, reload } = useAsyncData(
    async () => {
      const patients = await getAllPatients().catch(() => []);
      const codeByPatientId = new Map(
        patients.map((p) => [p.id, p.patientCode] as const),
      );

      const withPatientCode = (record: BillingRecord): BillingRecord => {
        const code = record.patientUuid
          ? codeByPatientId.get(record.patientUuid)
          : undefined;
        if (!code) return record;
        return {
          ...record,
          patientId: formatPatientCode(code),
        };
      };

      if (activeTab === 'pending') {
        const drafts = await getBillings({ status: 'PENDING' });
        return drafts.map(mapBillingDraftToRecord).map(withPatientCode);
      }

      const invoiceStatus = toApiInvoiceStatus(statusFilter);
      const invoices = await getInvoices({ status: invoiceStatus });
      return invoices.map(mapInvoiceToBillingRecord).map(withPatientCode);
    },
    [] as BillingRecord[],
    [activeTab, statusFilter],
  );

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
      const matchesStatus =
        activeTab === 'pending' || !statusFilter || item.status === statusFilter;
      return matchesId && matchesStatus;
    });
  }, [records, patientIdQuery, statusFilter, activeTab]);

  const handleDownload = (record: BillingRecord) => {
    if (record.kind === 'billing-draft') return;
    setBillInvoiceId(record.id);
  };

  const handleStartInvoice = (record: BillingRecord) => {
    navigate(`/billing/generate?billingId=${encodeURIComponent(record.id)}`);
  };

  return (
    <PageShell>
      <ListPanel
        tabs={
          <UnderlineTabs
            tabs={[
              { id: 'invoices' as const, label: 'Invoices' },
              { id: 'pending' as const, label: 'Pending' },
            ]}
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setStatusFilter('');
            }}
            className="border-none"
          />
        }
        filters={
          <>
            <FilterControl>
              <SearchField
                placeholder="Patient Code"
                value={patientIdQuery}
                onChange={(e) => setPatientIdQuery(e.target.value)}
              />
            </FilterControl>
            {activeTab === 'invoices' ? (
              <FilterControl>
                <Select
                  placeholder="Status"
                  options={BILLING_FILTER_OPTIONS.status.filter(
                    (status) => status !== 'Pending',
                  )}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
              </FilterControl>
            ) : null}
          </>
        }
      >
        <AsyncStatus
          loading={loading}
          error={error}
          onRetry={reload}
          empty={!loading && !error && filteredRecords.length === 0}
          emptyMessage="No billing records found."
        >
          <BillingTable
            embedded
            records={filteredRecords}
            onDownload={handleDownload}
            onStartInvoice={handleStartInvoice}
          />
        </AsyncStatus>
      </ListPanel>

      <BillInvoiceModal
        open={Boolean(billInvoiceId)}
        invoiceId={billInvoiceId}
        onClose={() => setBillInvoiceId(null)}
      />
    </PageShell>
  );
}
