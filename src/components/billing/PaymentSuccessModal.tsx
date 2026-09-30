import { SuccessDialog } from '@/components/ui/SuccessDialog';
import { formatCurrency } from '@/lib/utils';

export interface PaymentSuccessDetails {
  amount: number;
  refNumber: string;
  paymentTime: string;
  paymentMethod: string;
  senderName: string;
  /** Online PayU link when invoice awaits remote payment. */
  payUrl?: string;
  title?: string;
  recipientEmail?: string;
  emailSent?: boolean;
}

interface PaymentSuccessModalProps {
  open: boolean;
  onClose: () => void;
  payment: PaymentSuccessDetails | null;
}

export function formatPaymentDateTime(iso?: string | null): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function mapInvoiceToPaymentSuccess(invoice: {
  invoiceId: string;
  patientName: string;
  paidAmount?: number;
  totalAmount: number;
  payments?: { paymentDate?: string; paymentMethod?: string }[];
}): PaymentSuccessDetails {
  const latestPayment = invoice.payments?.[invoice.payments.length - 1];
  return {
    amount: invoice.paidAmount ?? invoice.totalAmount,
    refNumber: invoice.invoiceId,
    paymentTime: formatPaymentDateTime(latestPayment?.paymentDate),
    paymentMethod: latestPayment?.paymentMethod ?? '—',
    senderName: invoice.patientName,
  };
}

function DetailRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-text-muted">{label}</span>
      <span className={strong ? 'text-right font-semibold text-brown' : 'text-right text-brown'}>
        {value}
      </span>
    </div>
  );
}

export function PaymentSuccessModal({
  open,
  onClose,
  payment,
}: PaymentSuccessModalProps) {
  if (!open || !payment) return null;

  return (
    <SuccessDialog
      open={open}
      onClose={onClose}
      title="Payment Success!"
      halo
      className="max-w-[420px] px-8 py-10"
    >
      <p className="mt-3 text-[32px] font-bold leading-none text-brown">
        {formatCurrency(payment.amount)}
      </p>
      <div className="mt-7 space-y-3.5 text-left text-sm">
        <DetailRow label="Ref Number" value={payment.refNumber} />
        <DetailRow label="Payment Time" value={payment.paymentTime} />
        <DetailRow label="Payment Method" value={payment.paymentMethod} />
        <DetailRow label="Sender Name" value={payment.senderName} />
        <div className="border-t border-dashed border-[#E6E0D8] pt-3.5">
          <DetailRow
            label="Amount"
            value={formatCurrency(payment.amount)}
            strong
          />
        </div>
      </div>
    </SuccessDialog>
  );
}
