import { Minimize2, X } from 'lucide-react';
import { PatientTrendsChart } from './PatientTrendsChart';

interface ChartModalProps {
  open: boolean;
  onClose: () => void;
  data: { month: string; newPatients: number; followUps: number }[];
}

export function ChartModal({ open, onClose, data }: ChartModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative z-10 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brown">Total Patients</h2>
          <div className="flex gap-2">
            <button
              type="button"
              className="rounded p-1 text-text-muted hover:bg-brown/5"
              aria-label="Minimize"
            >
              <Minimize2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-text-muted hover:bg-brown/5"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <PatientTrendsChart data={data} />
      </div>
    </div>
  );
}
