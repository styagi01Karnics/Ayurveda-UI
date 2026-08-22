import { Calendar, Stethoscope, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { CalendarEventDetail } from '@/types';

interface CalendarEventCardProps {
  event: CalendarEventDetail;
  className?: string;
}

export function CalendarEventCard({ event, className }: CalendarEventCardProps) {
  return (
    <div className={cn('overflow-hidden bg-white', className)}>
      <div className="bg-cream px-6 pb-10 pt-5">
        <p className="text-xs font-medium text-text-muted">Today&apos;s Event</p>
        <h2 className="mt-1 text-xl font-bold leading-snug text-brown">
          {event.title}
        </h2>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-brown shadow-sm">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-gold" />
          {event.appointmentDate}
        </div>
      </div>

      <div className="relative px-6 pb-5">
        <div className="-mt-8 flex flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-gold/15 text-gold shadow-sm">
            <Stethoscope className="h-7 w-7" aria-hidden="true" />
          </div>
          <p className="mt-3 text-sm font-bold text-brown">{event.doctorName}</p>
          <p className="mt-0.5 text-xs text-text-muted">{event.doctorRole}</p>
        </div>

        <div className="mt-5 flex items-start gap-3 border-t border-gray-100 pt-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/10 text-gold">
            <UserRound className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold leading-snug text-brown">
              {event.patientName}
              {event.patientAge !== '—' || event.patientGender !== '—' ? (
                <>
                  {' '}
                  | {event.patientAge} | {event.patientGender}
                </>
              ) : null}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="gold" className="rounded-md px-2.5 py-0.5">
                {event.visitType}
              </Badge>
              {event.dosha !== '—' ? (
                <span className="inline-flex items-center rounded-md bg-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-700">
                  {event.dosha}
                </span>
              ) : null}
            </div>
            {event.condition !== '—' ? (
              <p className="mt-2 text-sm text-brown">
                Condition:{' '}
                <span className="font-semibold">{event.condition}</span>
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
          <div>
            <p className="text-xs text-text-muted">Last Visit</p>
            <p className="mt-1 text-sm font-bold text-brown">{event.lastVisit}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Next Visit</p>
            <p className="mt-1 text-sm font-bold text-brown">{event.nextVisit}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CalendarEventCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden bg-white">
      <div className="bg-cream px-6 pb-10 pt-5">
        <div className="h-3 w-20 rounded bg-brown/10" />
        <div className="mt-2 h-6 w-52 rounded bg-brown/10" />
        <div className="mt-4 h-7 w-40 rounded-full bg-white" />
      </div>
      <div className="px-6 pb-5">
        <div className="-mt-8 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-brown/10" />
          <div className="mt-3 h-4 w-28 rounded bg-brown/10" />
          <div className="mt-1 h-3 w-20 rounded bg-brown/10" />
        </div>
        <div className="mt-5 flex gap-3 border-t border-gray-100 pt-5">
          <div className="h-11 w-11 rounded-full bg-brown/10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-44 rounded bg-brown/10" />
            <div className="h-5 w-32 rounded bg-brown/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
