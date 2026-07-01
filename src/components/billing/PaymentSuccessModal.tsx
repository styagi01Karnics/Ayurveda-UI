import { AppIcon } from '@/components/ui/AppIcon';
import { assets } from '@/lib/assets';

interface PaymentSuccessModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
}

export function PaymentSuccessModal({
  open,
  onClose,
  amount,
}: PaymentSuccessModalProps) {
  if (!open) return null;

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
        <p className="mt-2 text-3xl font-bold text-brown">₹{amount}</p>
        <div className="mt-6 space-y-2 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Ref Number</span>
            <span className="text-brown">000085752257</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Payment Time</span>
            <span className="text-brown">15 Oct 2026, 01:05 AM</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Payment Method</span>
            <span className="text-brown">UPI</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Sender Name</span>
            <span className="text-brown">Khushi Shroff</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Amount</span>
            <span className="font-semibold text-brown">₹{amount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
