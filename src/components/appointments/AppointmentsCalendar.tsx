import { Card } from '@/components/ui/Card';
import type { CalendarEvent } from '@/types';

const DAYS = ['Sun 21', 'Mon 22', 'Tue 23', 'Wed 24', 'Thu 25', 'Fri 26', 'Sat 27'];
const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

interface AppointmentsCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (eventId: string) => void;
}

export function AppointmentsCalendar({ events, onEventClick }: AppointmentsCalendarProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex flex-1 justify-around text-xs font-medium text-brown">
          {DAYS.map((day) => (
            <span key={day} className="w-20 text-center">
              {day}
            </span>
          ))}
        </div>
        <span className="ml-4 shrink-0 text-xs text-text-muted">EST GMT-5</span>
      </div>

      <div className="overflow-x-auto">
        <div className="relative min-w-[800px]">
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-[48px_1fr_48px] border-b border-gray-100"
              style={{ minHeight: '56px' }}
            >
              <span className="px-2 py-2 text-xs text-text-muted">
                {hour <= 12 ? `${hour} AM` : `${hour - 12} PM`}
              </span>
              <div className="relative grid grid-cols-7">
                {DAYS.map((_, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`border-l border-gray-100 ${
                      dayIndex === 2 || dayIndex === 4 ? 'bg-amber-50/40' : ''
                    } ${dayIndex === 1 || dayIndex === 5 ? 'bg-sky-50/30' : ''}`}
                  />
                ))}
                {events
                  .filter((e) => e.startHour === hour)
                  .map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => onEventClick?.(event.id)}
                      className={`absolute z-10 m-0.5 overflow-hidden rounded border px-1.5 py-1 text-left text-[10px] font-medium leading-tight text-brown transition-opacity hover:opacity-90 ${event.color}`}
                      style={{
                        left: `${(event.day / 7) * 100}%`,
                        width: `calc(${100 / 7}% - 4px)`,
                        height: `${event.durationHours * 56 - 4}px`,
                      }}
                    >
                      {hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`}{' '}
                      {event.title}
                    </button>
                  ))}
              </div>
              <span className="px-2 py-2 text-xs text-text-muted">
                {hour <= 12 ? `${hour} AM` : `${hour - 12} PM`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
