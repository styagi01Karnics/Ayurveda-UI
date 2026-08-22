import { createPortal } from 'react-dom';
import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  CalendarEventCard,
} from '@/components/appointments/CalendarEventCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  addDays,
  formatWeekRangeLabel,
  getLocalTimezoneLabel,
  getWeekDays,
  getWeekStart,
  mapAppointmentsToCalendarEvents,
} from '@/lib/calendarUtils';
import { mapAppointmentRecordToCalendarDetail } from '@/lib/api/mappers';
import { cn } from '@/lib/utils';
import type { AppointmentRecord } from '@/types';

const ROW_HEIGHT_PX = 64;
const CALENDAR_START_HOUR = 10;
const CALENDAR_END_HOUR = 19;
const CALENDAR_HOURS = Array.from(
  { length: CALENDAR_END_HOUR - CALENDAR_START_HOUR + 1 },
  (_, index) => CALENDAR_START_HOUR + index,
);

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
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const weekDays = useMemo(() => getWeekDays(weekStart), [weekStart]);
  const events = useMemo(
    () => mapAppointmentsToCalendarEvents(appointments, weekStart),
    [appointments, weekStart],
  );
  const hours = CALENDAR_HOURS;
  const visibleEvents = useMemo(
    () =>
      events.filter(
        (event) =>
          event.startHour >= CALENDAR_START_HOUR &&
          event.startHour <= CALENDAR_END_HOUR,
      ),
    [events],
  );

  const appointmentById = useMemo(
    () => new Map(appointments.map((item) => [item.id, item])),
    [appointments],
  );

  const hoveredPreview = useMemo(() => {
    if (!hoveredEventId) return null;
    const record = appointmentById.get(hoveredEventId);
    if (!record) return null;
    return mapAppointmentRecordToCalendarDetail(record);
  }, [appointmentById, hoveredEventId]);

  const now = new Date();
  const todayColumn = weekDays.findIndex((day) => day.isToday);
  const showNowIndicator =
    todayColumn >= 0 && isSameLocalDay(now, weekStart, todayColumn);
  const gridHeightPx = hours.length * ROW_HEIGHT_PX;

  const showHoverCard =
    hoveredPreview &&
    hoverPosition &&
    typeof document !== 'undefined';

  return (
    <Card className="min-w-0 overflow-hidden border-[#cfc1ad] p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#cfc1ad] bg-[#fffdf9] px-4 py-3">
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

      <div className="grid grid-cols-[64px_1fr_64px] border-b border-[#b9aa94] bg-[#faf6ee]">
        <div className="border-r border-[#cfc1ad] px-2 py-3 text-center text-[10px] font-semibold uppercase tracking-wide text-text-muted">
          Time
        </div>
        <div className="grid grid-cols-7 text-xs font-semibold text-brown">
          {weekDays.map((day, index) => (
            <span
              key={day.label}
              className={cn(
                'border-r border-[#cfc1ad] py-3 text-center last:border-r-0',
                day.isToday && 'bg-gold/10 font-bold text-gold',
                index === 6 && 'border-r-0',
              )}
            >
              {day.label}
            </span>
          ))}
        </div>
        <div className="border-l border-[#cfc1ad]" />
      </div>

      <div className="overflow-x-auto">
        <div className="relative w-full min-w-[720px]">
          {hours.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-[64px_1fr_64px] border-b border-[#cfc1ad] last:border-b-0"
              style={{ minHeight: `${ROW_HEIGHT_PX}px` }}
            >
              <span className="border-r border-[#cfc1ad] bg-[#fffdf9] px-2 py-2 text-center text-xs font-medium text-brown">
                {formatHourLabel(hour)}
              </span>
              <div className="relative grid grid-cols-7">
                {weekDays.map((day) => (
                  <div
                    key={day.label}
                    className={cn(
                      'border-r border-[#cfc1ad] last:border-r-0',
                      day.isToday && 'bg-gold/[0.07]',
                    )}
                  />
                ))}
              </div>
              <span className="border-l border-[#cfc1ad] bg-[#fffdf9] px-2 py-2 text-center text-xs font-medium text-brown">
                {formatHourLabel(hour)}
              </span>
            </div>
          ))}

          <div
            className="pointer-events-none absolute inset-x-0 top-0 grid grid-cols-[64px_1fr_64px]"
            style={{ height: `${gridHeightPx}px` }}
          >
            <div />
            <div className="relative">
              {showNowIndicator &&
                now.getHours() >= hours[0] &&
                now.getHours() <= hours[hours.length - 1] && (
                  <div
                    className="pointer-events-none absolute z-20 h-0.5 bg-red-400"
                    style={{
                      top: `${
                        (now.getHours() -
                          hours[0] +
                          now.getMinutes() / 60) *
                        ROW_HEIGHT_PX
                      }px`,
                      left: `${(todayColumn / 7) * 100}%`,
                      width: `calc(${100 / 7}% - 4px)`,
                      marginLeft: '2px',
                    }}
                  />
                )}

              {visibleEvents.map((event) => {
                const topPx =
                  (event.startHour -
                    hours[0] +
                    (event.startMinute ?? 0) / 60) *
                  ROW_HEIGHT_PX;

                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => onEventClick?.(event.id)}
                    onMouseEnter={(mouseEvent) => {
                      const rect = mouseEvent.currentTarget.getBoundingClientRect();
                      setHoveredEventId(event.id);
                      setHoverPosition({
                        top: rect.top + window.scrollY,
                        left: rect.left + rect.width / 2 + window.scrollX,
                      });
                    }}
                    onMouseLeave={() => {
                      setHoveredEventId(null);
                      setHoverPosition(null);
                    }}
                    className={cn(
                      'pointer-events-auto absolute z-10 m-0.5 overflow-hidden rounded border px-1.5 py-1 text-left text-[10px] font-medium leading-tight text-brown transition-opacity hover:opacity-90',
                      event.color,
                      hoveredEventId === event.id && 'ring-2 ring-gold/60',
                    )}
                    style={{
                      left: `${(event.day / 7) * 100}%`,
                      width: `calc(${100 / 7}% - 4px)`,
                      height: `${Math.max(
                        event.durationHours * ROW_HEIGHT_PX - 4,
                        28,
                      )}px`,
                      top: `${topPx}px`,
                    }}
                  >
                    {event.timeLabel ?? formatHourLabel(event.startHour)}{' '}
                    {event.title}
                  </button>
                );
              })}
            </div>
            <div />
          </div>
        </div>
      </div>

      {showHoverCard
        ? createPortal(
            <div
              className="pointer-events-none fixed z-50 w-[22rem] max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl"
              style={{
                top: `${hoverPosition.top - 12}px`,
                left: `${hoverPosition.left}px`,
              }}
            >
              <CalendarEventCard event={hoveredPreview} />
            </div>,
            document.body,
          )
        : null}
    </Card>
  );
}

function isSameLocalDay(
  now: Date,
  weekStart: Date,
  columnIndex: number,
): boolean {
  const columnDate = addDays(weekStart, columnIndex);
  return (
    now.getFullYear() === columnDate.getFullYear() &&
    now.getMonth() === columnDate.getMonth() &&
    now.getDate() === columnDate.getDate()
  );
}
