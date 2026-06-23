import { Calendar, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { CalendarEventDetail } from '@/types';

interface CalendarEventModalProps {
  open: boolean;
  event: CalendarEventDetail | null;
  onClose: () => void;
}

export function CalendarEventModal({
  open,
  event,
  onClose,
}: CalendarEventModalProps) {
  if (!open || !event) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded p-1 text-text-muted hover:bg-brown/5"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="rounded-t-2xl bg-cream px-6 py-5">
          <p className="text-xs font-medium text-text-muted">Today&apos;s Event</p>
          <h2 className="mt-1 text-lg font-bold text-brown">{event.title}</h2>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs text-brown">
            <Calendar className="h-3.5 w-3.5 text-gold" />
            {event.appointmentDate}
          </div>
        </div>

        <div className="space-y-5 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-sm font-semibold text-gold">
              {event.doctorName.charAt(4)}
            </div>
            <div>
              <p className="text-sm font-semibold text-brown">{event.doctorName}</p>
              <p className="text-xs text-text-muted">{event.doctorRole}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brown/10 text-sm font-semibold text-brown">
              {event.patientName.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-brown">
                {event.patientName} | {event.patientAge} | {event.patientGender}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="gold">{event.visitType}</Badge>
                <Badge variant="neutral">{event.dosha}</Badge>
              </div>
              <p className="mt-2 text-sm text-brown">{event.condition}</p>
              <div className="mt-3 space-y-1 text-xs text-text-muted">
                <p>Last Visit: {event.lastVisit}</p>
                <p>Next Visit: {event.nextVisit}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
