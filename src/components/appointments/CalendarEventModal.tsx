import { X } from 'lucide-react';
import {
  CalendarEventCard,
  CalendarEventCardSkeleton,
} from '@/components/appointments/CalendarEventCard';
import type { CalendarEventDetail } from '@/types';

interface CalendarEventModalProps {
  open: boolean;
  event: CalendarEventDetail | null;
  loading?: boolean;
  onClose: () => void;
}

export function CalendarEventModal({
  open,
  event,
  loading = false,
  onClose,
}: CalendarEventModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative z-10 w-full max-w-[22rem] overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded p-1 text-text-muted hover:bg-brown/5"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {loading || !event ? (
          <CalendarEventCardSkeleton />
        ) : (
          <CalendarEventCard event={event} />
        )}
      </div>
    </div>
  );
}
