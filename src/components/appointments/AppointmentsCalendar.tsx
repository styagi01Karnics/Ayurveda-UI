import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  addDays,
  formatWeekRangeLabel,
  getCalendarHourRange,
  getLocalTimezoneLabel,
  getWeekDays,
  getWeekStart,
  mapAppointmentsToCalendarEvents,
} from '@/lib/calendarUtils';
import { cn } from '@/lib/utils';
import type { AppointmentRecord } from '@/types';

const ROW_HEIGHT_PX = 56;
const DEFAULT_HOURS = Array.from({ length: 12 }, (_, i) => i + 7);

interface AppointmentsCalendarProps {
  appointments: AppointmentRecord[];
  onEventClick?: (eventId: string) => void;
}

function formatHourLabel(hour: number): string {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

export function AppointmentsCalendar({
  appointments,
  onEventClick,
}: AppointmentsCalendarProps) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const events = useMemo(
    () => mapAppointmentsToCalendarEvents(appointments, weekStart),
    [appointments, weekStart],
  );
  const hours = useMemo(() => {
    const range = getCalendarHourRange(events);
    return range.length > 0 ? range : DEFAULT_HOURS;
  }, [events]);

  const now = new Date();
  const todayColumn = weekDays.findIndex((day) => day.isToday);
  const showNowIndicator = todayColumn >= 0 && isSameLocalDay(now, weekStart, todayColumn);
  const nowTopPx =
    (now.getHours() - hours[0] + now.getMinutes() / 60) * ROW_HEIGHT_PX;

  return (
    <Card className="min-w-0 overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-8 w-8 p-0"
            aria-label="Previous week"
            onClick={() => setWeekStart((current) => addDays(current, -7))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-8 px-3 text-xs"
            onClick={() => setWeekStart(getWeekStart(new Date()))}
          >
            Today
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-8 w-8 p-0"
            aria-label="Next week"
            onClick={() => setWeekStart((current) => addDays(current, 7))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="text-sm font-semibold text-brown">
            {formatWeekRangeLabel(weekStart)}
          </span>
        </div>
        <span className="text-xs text-text-muted">{getLocalTimezoneLabel()}</span>
      </div>

      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="grid flex-1 grid-cols-7 text-xs font-medium text-brown">
          {weekDays.map((day) => (
            <span
              key={day.label}
              className={cn(
                'text-center',
                day.isToday && 'font-bold text-gold',
              )}
            >
              {day.label}
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="relative w-full min-w-[720px]">
          {hours.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-[48px_1fr_48px] border-b border-gray-100"
              style={{ minHeight: `${ROW_HEIGHT_PX}px` }}
            >
              <span className="px-2 py-2 text-xs text-text-muted">
                {formatHourLabel(hour)}
              </span>
              <div className="relative grid grid-cols-7">
                {weekDays.map((day) => (
                  <div
                    key={day.label}
                    className={cn(
                      'border-l border-gray-100',
                      day.isToday && 'bg-gold/5',
                    )}
                  />
                ))}

                {showNowIndicator &&
                  now.getHours() >= hours[0] &&
                  now.getHours() <= hours[hours.length - 1] &&
                  hour === now.getHours() && (
                    <div
                      className="pointer-events-none absolute z-20 h-0.5 bg-red-400"
                      style={{
                        top: `${(now.getMinutes() / 60) * ROW_HEIGHT_PX}px`,
                        left: `${(todayColumn / 7) * 100}%`,
                        width: `calc(${100 / 7}% - 4px)`,
                        marginLeft: '2px',
                      }}
                    />
                  )}

                {events
                  .filter((event) => event.startHour === hour)
                  .map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => onEventClick?.(event.id)}
                      className={cn(
                        'absolute z-10 m-0.5 overflow-hidden rounded border px-1.5 py-1 text-left text-[10px] font-medium leading-tight text-brown transition-opacity hover:opacity-90',
                        event.color,
                      )}
                      style={{
                        left: `${(event.day / 7) * 100}%`,
                        width: `calc(${100 / 7}% - 4px)`,
                        height: `${event.durationHours * ROW_HEIGHT_PX - 4}px`,
                        top:
                          event.startMinute != null
                            ? `${(event.startMinute / 60) * ROW_HEIGHT_PX}px`
                            : undefined,
                      }}
                    >
                      {event.timeLabel ?? formatHourLabel(hour)}{' '}
                      {event.title}
                    </button>
                  ))}
              </div>
              <span className="px-2 py-2 text-xs text-text-muted">
                {formatHourLabel(hour)}
              </span>
            </div>
          ))}

          {showNowIndicator &&
            now.getHours() >= hours[0] &&
            now.getHours() <= hours[hours.length - 1] &&
            !hours.includes(now.getHours()) && (
              <div
                className="pointer-events-none absolute z-20 h-0.5 bg-red-400"
                style={{
                  top: `${nowTopPx}px`,
                  left: `calc(48px + ${(todayColumn / 7) * 100}% * (100% - 96px) / 100%)`,
                }}
              />
            )}
        </div>
      </div>
    </Card>
  );
}

function isSameLocalDay(now: Date, weekStart: Date, columnIndex: number): boolean {
  const columnDate = addDays(weekStart, columnIndex);
  return (
    now.getFullYear() === columnDate.getFullYear() &&
    now.getMonth() === columnDate.getMonth() &&
    now.getDate() === columnDate.getDate()
  );
}
