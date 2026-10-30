import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/app/ToastContext';
import { PageShell } from '@/components/layout/PageShell';
import { BillInvoiceModal } from '@/components/patients/BillInvoiceModal';
import {
  BillingTable,
  canSendPaymentLink,
} from '@/components/billing/BillingTable';
import {
  PaymentLinkConfirmModal,
} from '@/components/billing/PaymentLinkConfirmModal';
import {
  PaymentSuccessModal,
  type PaymentSuccessDetails,
} from '@/components/billing/PaymentSuccessModal';
import { AppIcon } from '@/components/ui/AppIcon';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { FilterControl, ListPanel } from '@/components/ui/ListPanel';
import { Pagination } from '@/components/ui/Pagination';
import { SearchField } from '@/components/ui/SearchField';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { assets } from '@/lib/assets';
import { BILLING_FILTER_OPTIONS } from '@/data/mock/billing';
import { useAsyncData } from '@/hooks/useAsyncData';
import { useClientPagination } from '@/hooks/useClientPagination';
import {
  getBillings,
  getInvoiceById,
  getInvoices,
  type InvoiceStatus,
} from '@/lib/api/billing';
import {
  mapBillingDraftToRecord,
  mapInvoiceToBillingRecord,
} from '@/lib/api/mappers';
import { ApiError } from '@/lib/api/client';
import { getAllPatients, getPatientById } from '@/lib/api/patients';
import {
  latestPaymentLinkByInvoice,
  listAllPaymentLinks,
  sendInvoicePaymentLink,
  type PaymentLinkDto,
} from '@/lib/api/payments';
import { formatPatientCode } from '@/lib/displayCodes';
import type { BillingRecord } from '@/types';

type BillingTab = 'invoices' | 'pending';
type LinkFilter = 'all' | 'send' | 'cannot';

interface PendingPaymentLink {
  invoiceId: string;
  invoiceRef: string;
  /** Left balance; the maximum that can be requested. */
  balance: number;
  /** Raw amount typed in the confirm modal. */
  amountInput: string;
  firstName: string;
  email: string;
  phone: string;
  senderName: string;
  patientId: string;
}

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
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<BillingTab>('invoices');
  const [patientIdQuery, setPatientIdQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [linkFilter, setLinkFilter] = useState<LinkFilter>('all');
  const [billInvoiceId, setBillInvoiceId] = useState<string | null>(null);
  const [sendingPaymentLinkId, setSendingPaymentLinkId] = useState<
    string | null
  >(null);
  const [paymentLinkDetails, setPaymentLinkDetails] =
    useState<PaymentSuccessDetails | null>(null);
  const [pendingPaymentLink, setPendingPaymentLink] =
    useState<PendingPaymentLink | null>(null);
  const [confirmingPaymentLink, setConfirmingPaymentLink] = useState(false);

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
        const drafts = await getBillings({ status: 'PENDING', page: 0, size: 100 });
        return drafts.map(mapBillingDraftToRecord).map(withPatientCode);
      }

      const invoiceStatus = toApiInvoiceStatus(statusFilter);
      const invoices = await getInvoices({
        status: invoiceStatus,
        page: 0,
        size: 100,
      });
      return invoices.map(mapInvoiceToBillingRecord).map(withPatientCode);
    },
    [] as BillingRecord[],
    [activeTab, statusFilter],
  );

  const { data: paymentLinks, reload: reloadPaymentLinks } = useAsyncData(
    () => listAllPaymentLinks().catch(() => [] as PaymentLinkDto[]),
    [] as PaymentLinkDto[],
    [],
  );

  const linkByInvoice = useMemo(
    () => latestPaymentLinkByInvoice(paymentLinks),
    [paymentLinks],
  );

  const headerAction = useMemo(
    () => (
      <Button
        className="h-9 gap-1.5 rounded-[10px] px-4 py-0 text-sm"
        onClick={() => navigate('/billing/generate')}
      >
        <AppIcon src={assets.icons.add} className="h-4 w-4" />
        Generate Invoice
      </Button>
    ),
    [navigate],
  );

  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const matchesId =
        !patientIdQuery ||
        item.patientId.toLowerCase().includes(patientIdQuery.toLowerCase()) ||
        item.secondaryPatientId
          .toLowerCase()
          .includes(patientIdQuery.toLowerCase());
      const matchesStatus =
        activeTab === 'pending' || !statusFilter || item.status === statusFilter;
      const hasLink = linkByInvoice.has(item.id);
      const matchesLink =
        activeTab === 'pending' ||
        linkFilter === 'all' ||
        (linkFilter === 'send'
          ? hasLink
          : canSendPaymentLink(item) && !hasLink);
      return matchesId && matchesStatus && matchesLink;
    });
  }, [records, patientIdQuery, statusFilter, linkFilter, activeTab, linkByInvoice]);

  const {
    page,
    setPage,
    pageSize,
    totalPages,
    totalElements,
    pageItems,
    resetPage,
  } = useClientPagination(filteredRecords);

  useEffect(() => {
    resetPage();
  }, [activeTab, patientIdQuery, statusFilter, resetPage]);

  const handleDownload = (record: BillingRecord) => {
    if (record.kind === 'billing-draft') return;
    setBillInvoiceId(record.id);
  };

  const handleStartInvoice = (record: BillingRecord) => {
    navigate(`/billing/generate?billingId=${encodeURIComponent(record.id)}`);
  };

  const handleSendPaymentLink = async (record: BillingRecord) => {
    if (sendingPaymentLinkId) return;
    setSendingPaymentLinkId(record.id);
    try {
      const invoice = await getInvoiceById(record.id);
      const due =
        invoice.leftAmount ??
        Math.max(0, (invoice.totalAmount ?? 0) - (invoice.paidAmount ?? 0));
      if (due <= 0) {
        showToast({
          title: 'Nothing due',
          message: 'This invoice has no remaining balance.',
        });
        return;
      }

      const patient = invoice.patientId
        ? await getPatientById(invoice.patientId).catch(() => null)
        : null;
      const email =
        patient?.email?.trim() ||
        invoice.patientEmail?.trim() ||
        undefined;
      const phone = (
        invoice.contactNumber ||
        patient?.mobileNumber ||
        ''
      ).replace(/\D/g, '');
      const firstName =
        (invoice.patientName || patient?.fullName || 'Patient')
          .trim()
          .split(/\s+/)[0] || 'Patient';

      if (!email || phone.length < 10) {
        showToast({
          title: 'Patient contact missing',
          message:
            'Patient needs a valid email and 10-digit phone to send a payment link.',
        });
        return;
      }

      setPendingPaymentLink({
        invoiceId: invoice.id,
        invoiceRef: invoice.invoiceNumber || invoice.invoiceId || record.invoiceId,
        balance: due,
        amountInput: String(due),
        firstName,
        email,
        phone: phone.slice(-10),
        senderName: invoice.patientName || patient?.fullName || 'Patient',
        patientId: record.patientId,
      });
    } catch (err) {
      showToast({
        title: 'Could not send link',
        message:
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Payment link request failed.',
      });
    } finally {
      setSendingPaymentLinkId(null);
    }
  };

  const handleConfirmPaymentLink = async () => {
    const pending = pendingPaymentLink;
    if (!pending) return;
    const amount = Number(pending.amountInput);
    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      amount > pending.balance
    ) {
      showToast({
        title: 'Invalid amount',
        message: 'Enter an amount between 1 and the remaining balance.',
      });
      return;
    }
    setConfirmingPaymentLink(true);
    try {
      const result = await sendInvoicePaymentLink({
        invoiceId: pending.invoiceId,
        amount,
        firstName: pending.firstName,
        email: pending.email,
        phone: pending.phone,
        sendEmail: true,
        upiQr: false,
      });

      setPendingPaymentLink(null);
      void reloadPaymentLinks();
      setPaymentLinkDetails({
        variant: 'link',
        amount: result.link.amount ?? amount,
        refNumber: pending.invoiceRef,
        paymentTime: new Date().toLocaleString('en-IN'),
        paymentMethod: 'Online',
        senderName: pending.senderName,
        payUrl: result.payUrl,
        recipientEmail: result.link.email || pending.email,
        emailSent: result.emailSent,
        title: 'Payment Link Sent',
      });

      showToast({
        title: result.resent ? 'Link resent' : 'Payment link',
        dismissible: false,
        message: result.emailSent
          ? 'Payment link emailed to the patient. Open or copy it from the dialog.'
          : result.payUrl
            ? 'Link created but email may not have sent — check hospital SMTP. You can still open/copy the link.'
            : 'Payment link request completed.',
      });
    } catch (err) {
      showToast({
        title: 'Could not send link',
        message:
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Payment link request failed.',
      });
    } finally {
      setConfirmingPaymentLink(false);
    }
  };

  return (
    <PageShell>
      <ListPanel
        actions={headerAction}
        tabs={
          <div className="flex flex-col gap-3">
            <UnderlineTabs
              variant="pill"
              tabs={[
                { id: 'invoices' as const, label: 'Invoice Generated' },
                { id: 'pending' as const, label: 'Invoice Pending' },
              ]}
              activeTab={activeTab}
              onChange={(tab) => {
                setActiveTab(tab);
                setStatusFilter('');
                setLinkFilter('all');
              }}
              className="border-none"
            />
            {activeTab === 'invoices' ? (
              <UnderlineTabs
                tabs={[
                  { id: 'all' as const, label: 'All' },
                  { id: 'send' as const, label: 'Send Payment Link' },
                  { id: 'cannot' as const, label: "Can't Send Payment Link" },
                ]}
                activeTab={linkFilter}
                onChange={setLinkFilter}
              />
            ) : null}
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
            records={pageItems}
            onDownload={handleDownload}
            onStartInvoice={handleStartInvoice}
            onSendPaymentLink={(record) => void handleSendPaymentLink(record)}
            sendingPaymentLinkId={sendingPaymentLinkId}
            linkByInvoice={linkByInvoice}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={setPage}
            disabled={loading}
          />
        </AsyncStatus>
      </ListPanel>

      <BillInvoiceModal
        open={Boolean(billInvoiceId)}
        invoiceId={billInvoiceId}
        onClose={() => setBillInvoiceId(null)}
      />

      <PaymentLinkConfirmModal
        open={Boolean(pendingPaymentLink)}
        submitting={confirmingPaymentLink}
        maxAmount={pendingPaymentLink?.balance ?? 0}
        amountInput={pendingPaymentLink?.amountInput ?? ''}
        onAmountChange={(value) =>
          setPendingPaymentLink((prev) =>
            prev ? { ...prev, amountInput: value } : prev,
          )
        }
        details={
          pendingPaymentLink
            ? {
                patientName: pendingPaymentLink.senderName,
                patientId: pendingPaymentLink.patientId,
                phone: `+91 ${pendingPaymentLink.phone}`,
                email: pendingPaymentLink.email,
              }
            : null
        }
        onCancel={() => setPendingPaymentLink(null)}
        onConfirm={() => void handleConfirmPaymentLink()}
      />

      <PaymentSuccessModal
        open={Boolean(paymentLinkDetails)}
        payment={paymentLinkDetails}
        onClose={() => setPaymentLinkDetails(null)}
      />
    </PageShell>
  );
}
