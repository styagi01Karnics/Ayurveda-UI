import { AppIcon } from '@/components/ui/AppIcon';
import { Button } from '@/components/ui/Button';
import { DataTableShell } from '@/components/ui/DataTableShell';
import { IconActionButton } from '@/components/ui/IconActionButton';
import { assets } from '@/lib/assets';
import type { PaymentLinkDto } from '@/lib/api/payments';
import { formatCurrency } from '@/lib/utils';
import type { BillingRecord } from '@/types';

interface BillingTableProps {
  records: BillingRecord[];
  onDownload: (record: BillingRecord) => void;
  onStartInvoice?: (record: BillingRecord) => void;
  onSendPaymentLink?: (record: BillingRecord) => void;
  sendingPaymentLinkId?: string | null;
  /** Latest payment link per invoice id. */
  linkByInvoice?: Map<string, PaymentLinkDto>;
  embedded?: boolean;
}

export type PaymentLinkState = 'none' | 'sent' | 'paid' | 'partial' | 'expired';

function isDraftRecord(record: BillingRecord): boolean {
  return record.kind === 'billing-draft' || record.status === 'Pending';
}

/** Invoice still has a balance and is not a draft. */
export function canSendPaymentLink(record: BillingRecord): boolean {
  return !isDraftRecord(record) && record.leftAmount > 0;
}

export function getPaymentLinkState(
  record: BillingRecord,
  link?: PaymentLinkDto,
): PaymentLinkState {
  if (!link) return 'none';
  const status = String(link.status ?? '').toUpperCase();
  if (status === 'PAID') return record.leftAmount > 0 ? 'partial' : 'paid';
  if (status === 'EXPIRED' || status === 'SUPERSEDED') return 'expired';
  return 'sent';
}

const ACTION_LABEL: Record<PaymentLinkState, string> = {
  none: 'Send Payment Link',
  sent: 'Send Payment Link',
  paid: '',
  partial: 'Send Payment Link',
  expired: 'Send Payment Link',
};

export function BillingTable({
  records,
  onDownload,
  onStartInvoice,
  onSendPaymentLink,
  sendingPaymentLinkId = null,
  linkByInvoice,
  embedded,
}: BillingTableProps) {
  return (
    <DataTableShell embedded={embedded}>
      <table className="min-w-[960px] w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80 text-xs text-text-muted">
            <th className="px-5 py-3 font-medium">Invoice ID</th>
            <th className="px-5 py-3 font-medium">Patient ID</th>
            <th className="px-5 py-3 font-medium">Invoice Date</th>
            <th className="px-5 py-3 font-medium">Paid Amount</th>
            <th className="px-5 py-3 font-medium">Left Amount</th>
            <th className="px-5 py-3 font-medium">Payment</th>
            <th className="px-5 py-3 font-medium">Bill</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-5 py-12 text-center text-text-muted"
              >
                No billing records found matching your filters.
              </td>
            </tr>
          ) : (
            records.map((record) => {
              const isDraft =
                record.kind === 'billing-draft' || record.status === 'Pending';
              const showSend = canSendPaymentLink(record);
              const sending = sendingPaymentLinkId === record.id;
              const link = linkByInvoice?.get(record.id);
              const state = getPaymentLinkState(record, link);
              return (
                <tr
                  key={record.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50"
                >
                  <td className="px-5 py-4 text-brown">{record.invoiceId}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-brown">{record.patientId}</p>
                    {record.secondaryPatientId ? (
                      <p className="text-xs text-text-muted">
                        {record.secondaryPatientId}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-5 py-4 text-brown">{record.invoiceDate}</td>
                  <td className="px-5 py-4 text-brown">
                    {formatCurrency(record.paidAmount)}
                  </td>
                  <td className="px-5 py-4 text-brown">
                    {formatCurrency(record.leftAmount)}
                  </td>
                  <td className="px-5 py-4">
                    {isDraft ? null : (
                      <PaymentCell
                        state={state}
                        enabled={showSend}
                        sending={sending}
                        disabled={!onSendPaymentLink}
                        onSend={() => onSendPaymentLink?.(record)}
                      />
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {isDraft ? (
                      <Button
                        type="button"
                        className="px-3 py-1.5 text-xs"
                        onClick={() => onStartInvoice?.(record)}
                      >
                        Start Invoice
                      </Button>
                    ) : (
                      <IconActionButton
                        onClick={() => onDownload(record)}
                        aria-label="Download bill"
                      >
                        <AppIcon
                          src={assets.icons.download}
                          className="h-4 w-4"
                        />
                      </IconActionButton>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </DataTableShell>
  );
}

function PaymentCell({
  state,
  enabled,
  sending,
  disabled,
  onSend,
}: {
  state: PaymentLinkState;
  enabled: boolean;
  sending: boolean;
  disabled: boolean;
  onSend: () => void;
}) {
  const actionLabel = ACTION_LABEL[state];
  const actionDisabled =
    !enabled || sending || disabled || state === 'sent';

  return (
    <div className="flex flex-wrap items-center gap-2">
      {actionLabel ? (
        <Button
          type="button"
          variant="outline"
          className="rounded-full border-[#E8D9A8] bg-[#FBF3D9] px-3 py-1.5 text-xs text-brown hover:bg-[#F6E9BE] disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
          disabled={actionDisabled}
          onClick={onSend}
        >
          {sending ? 'Sending…' : actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
