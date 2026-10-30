import { CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';

export interface PaymentLinkConfirmDetails {
  patientName: string;
  patientId: string;
  phone: string;
  email: string;
}

interface PaymentLinkConfirmModalProps {
  open: boolean;
  details: PaymentLinkConfirmDetails | null;
  /** Largest amount that can be requested (the invoice's left balance). */
  maxAmount: number;
  amountInput: string;
  onAmountChange: (value: string) => void;
  submitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Returns an error message, or null when the amount is valid. */
export function validatePaymentAmount(
  input: string,
  maxAmount: number,
): string | null {
  const value = Number(input);
  if (!input.trim() || Number.isNaN(value)) return 'Enter an amount.';
  if (value <= 0) return 'Amount must be greater than 0.';
  if (value > maxAmount) {
    return `Amount cannot exceed the balance of ${formatCurrency(maxAmount)}.`;
  }
  return null;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-text-muted">{label}</span>
      <span className="text-right text-brown">{value}</span>
    </div>
  );
}

export function PaymentLinkConfirmModal({
  open,
  details,
  maxAmount,
  amountInput,
  onAmountChange,
  submitting,
  onCancel,
  onConfirm,
}: PaymentLinkConfirmModalProps) {
  if (!open || !details) return null;

  const amountError = validatePaymentAmount(amountInput, maxAmount);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={submitting ? undefined : onCancel}
        aria-label="Close"
        disabled={submitting}
      />
      <div
        className="relative z-10 w-full max-w-[400px] rounded-[20px] bg-white px-8 pb-7 pt-8 text-center shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-link-confirm-title"
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="absolute right-4 top-4 rounded-md p-1 text-[#9A8C84] hover:bg-brown/5 disabled:opacity-50"
          aria-label="Close"
        >
          <X className="h-5 w-5" strokeWidth={1.75} />
        </button>

        <div className="mx-auto flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#E8F6EA]">
          <CheckCircle2 className="h-7 w-7 text-[#4CAF50]" strokeWidth={1.75} />
        </div>

        <h2
          id="payment-link-confirm-title"
          className="mt-4 text-base font-semibold text-brown"
        >
          Send Payment Link
        </h2>
        <p className="mt-2 text-[32px] font-bold leading-none text-brown">
          {amountError ? formatCurrency(maxAmount) : formatCurrency(Number(amountInput))}
        </p>
        <div className="mt-3 text-left">
          <label
            htmlFor="payment-link-amount"
            className="text-xs text-text-muted"
          >
            Amount (balance {formatCurrency(maxAmount)})
          </label>
          <input
            id="payment-link-amount"
            type="number"
            inputMode="decimal"
            min={0}
            max={maxAmount}
            step="any"
            value={amountInput}
            disabled={submitting}
            onChange={(event) => onAmountChange(event.target.value)}
            className="mt-1 h-11 w-full rounded-xl border border-[#E6E0D8] px-3 text-lg font-semibold text-brown focus:outline-none focus:ring-2 focus:ring-brown/20"
          />
          {amountError ? (
            <p className="mt-1 text-xs text-[#C62828]" role="alert">
              {amountError}
            </p>
          ) : null}
        </div>

        <div className="mt-6 space-y-3 border-t border-dashed border-[#E6E0D8] pt-5 text-left text-sm">
          <DetailRow label="Patient Name" value={details.patientName} />
          <DetailRow label="Patient ID" value={details.patientId} />
          <DetailRow label="Phone No." value={details.phone} />
          <DetailRow label="Email ID" value={details.email} />
        </div>

        <div className="mt-7 flex w-full gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={submitting}
            className="h-11 min-w-0 flex-1 rounded-xl border-[#E6E0D8] bg-white px-3 text-brown hover:bg-brown/[0.03]"
          >
            Cancel
          </Button>
          <Button
            className="h-11 min-w-0 flex-1 rounded-xl px-3"
            onClick={onConfirm}
            disabled={submitting || Boolean(amountError)}
          >
            {submitting ? 'Sending…' : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  );
}
