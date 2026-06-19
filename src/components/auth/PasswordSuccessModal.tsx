import { CheckCircle, X } from 'lucide-react';

interface PasswordSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

export function PasswordSuccessModal({ open, onClose }: PasswordSuccessModalProps) {
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
          <X className="h-4 w-4" />
        </button>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-brown">Password Updated</h2>
        <p className="mt-2 text-sm text-text-muted">
          Your password has been changed successfully.
        </p>
      </div>
    </div>
  );
}
