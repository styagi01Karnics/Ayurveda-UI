import { AppIcon } from '@/components/ui/AppIcon';
import { assets } from '@/lib/assets';
import { formatCurrency } from '@/lib/utils';

export interface PaymentSuccessDetails {
  amount: number;
  refNumber: string;
  paymentTime: string;
  paymentMethod: string;
  senderName: string;
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

export function PaymentSuccessModal({
  open,
  onClose,
  payment,
}: PaymentSuccessModalProps) {
  if (!open || !payment) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white px-8 py-10 text-center shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded p-1 text-text-muted hover:bg-brown/5"
          aria-label="Close"
        >
          <AppIcon src={assets.icons.close} className="h-4 w-4" />
        </button>
        <AppIcon
          src={assets.icons.confirmSuccess}
          className="mx-auto h-16 w-16"
        />
        <h2 className="mt-5 text-xl font-bold text-brown">Payment Success!</h2>
        <p className="mt-2 text-3xl font-bold text-brown">
          {formatCurrency(payment.amount)}
        </p>
        <div className="mt-6 space-y-2 text-left text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-text-muted">Ref Number</span>
            <span className="text-right text-brown">{payment.refNumber}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-text-muted">Payment Time</span>
            <span className="text-right text-brown">{payment.paymentTime}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-text-muted">Payment Method</span>
            <span className="text-right text-brown">{payment.paymentMethod}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-text-muted">Sender Name</span>
            <span className="text-right text-brown">{payment.senderName}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-text-muted">Amount</span>
            <span className="font-semibold text-brown">
              {formatCurrency(payment.amount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
