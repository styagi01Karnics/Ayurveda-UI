import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface UnsavedChangesModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onDiscard: () => void;
}

export function UnsavedChangesModal({
  open,
  onClose,
  onConfirm,
  onDiscard,
}: UnsavedChangesModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white px-8 py-8 text-center shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded p-1 text-text-muted hover:bg-brown/5"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
          <Save className="h-6 w-6 text-gold" />
        </div>
        <h2 className="mt-5 text-xl font-bold text-brown">Unsaved changes</h2>
        <p className="mt-2 text-sm text-text-muted">
          Do you want to save or discard changes?
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" onClick={onDiscard}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  );
}
