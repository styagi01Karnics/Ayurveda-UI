import type { AppointmentRecord, CalendarEvent, FollowUpRecord } from '@/types';

const VISIT_COLORS: Record<string, string> = {
  Consultation: 'bg-blue-100 border-blue-400 text-blue-900',
  Therapy: 'bg-emerald-100 border-emerald-400 text-emerald-900',
  'Follow-Up': 'bg-purple-100 border-purple-400 text-purple-900',
  Treatment: 'bg-rose-100 border-rose-400 text-rose-900',
};

export interface CalendarWeekDay {
  label: string;
  date: Date;
  isToday: boolean;
}

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Sunday-start week containing `date`. */
export function getWeekStart(date: Date = new Date()): Date {
  const d = startOfDay(date);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getWeekDays(weekStart: Date): CalendarWeekDay[] {
  const today = startOfDay(new Date());
  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      label: `${weekday} ${date.getDate()}`,
      date,
      isToday: isSameDay(date, today),
    };
  });
}

export function formatWeekRangeLabel(weekStart: Date): string {
  const weekEnd = addDays(weekStart, 6);
  const sameMonth = weekStart.getMonth() === weekEnd.getMonth();
  const startLabel = weekStart.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const endLabel = weekEnd.toLocaleDateString('en-US', {
    month: sameMonth ? undefined : 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${startLabel} – ${endLabel}`;
}

export function getLocalTimezoneLabel(): string {
  try {
    const parts = new Intl.DateTimeFormat(undefined, {
      timeZoneName: 'short',
    }).formatToParts(new Date());
    const zone = parts.find((part) => part.type === 'timeZoneName')?.value;
    return zone ?? 'Local';
  } catch {
    return 'Local';
  }
}

function normalizeTimeForIso(time: string): string {
  if (!time) return '10:00:00';
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time;
  if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`;
  const match = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (match) {
    let hours = Number(match[1]);
    const minutes = match[2];
    const meridiem = match[3]?.toUpperCase();
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${minutes}:00`;
  }
  return '10:00:00';
}

function parseIsoDateTime(datePart: string, timePart?: string): Date | null {
  if (!datePart) return null;

  if (datePart.includes('T') && !timePart) {
    const parsed = new Date(datePart);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  const isoDate = datePart.slice(0, 10);
  const time = normalizeTimeForIso(timePart ?? '10:00');
  const parsed = new Date(`${isoDate}T${time}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseDisplayAppointmentDate(value: string): Date | null {
  if (!value || value === '—') return null;

  const direct = new Date(value);
  if (!Number.isNaN(direct.getTime())) return direct;

  const match = value.match(
    /(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4}),?\s*(\d{1,2}):(\d{2})\s*(AM|PM)?/i,
  );
  if (match) {
    const [, day, month, year, hour, minute, meridiem] = match;
    let hours = Number(hour);
    if (meridiem) {
      const upper = meridiem.toUpperCase();
      if (upper === 'PM' && hours < 12) hours += 12;
      if (upper === 'AM' && hours === 12) hours = 0;
    }
    const parsed = new Date(`${month} ${day}, ${year} ${hours}:${minute}:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

/** Resolve the scheduled instant for a list/calendar appointment row. */
export function parseAppointmentDateTime(record: AppointmentRecord): Date | null {
  if (record.slotTime) {
    const scheduledWithSlot =
      parseIsoDateTime(record.registrationDate ?? '', record.slotTime) ??
      parseIsoDateTime(record.dateCreated ?? '', record.slotTime);
    if (scheduledWithSlot) return scheduledWithSlot;
  }

  const isoCandidates = [
    record.registrationDate,
    record.dateCreated,
    record.appointmentDate,
  ];

  for (const candidate of isoCandidates) {
    if (candidate?.includes('T')) {
      const parsed = new Date(candidate);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
  }

  const candidates: Array<Date | null> = [
    parseDisplayAppointmentDate(record.appointmentDate),
    parseIsoDateTime(record.registrationDate ?? '', record.slotTime),
    parseIsoDateTime(record.dateCreated ?? '', record.slotTime),
  ];

  for (const candidate of candidates) {
    if (candidate) return candidate;
  }

  return null;
}

function formatEventTime(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function mapAppointmentToCalendarEvent(
  record: AppointmentRecord,
  weekStart: Date,
): CalendarEvent | null {
  const scheduledAt = parseAppointmentDateTime(record);
  if (!scheduledAt) return null;

  const weekEnd = addDays(weekStart, 7);
  if (scheduledAt < weekStart || scheduledAt >= weekEnd) {
    return null;
  }

  const dayIndex = Math.floor(
    (startOfDay(scheduledAt).getTime() - weekStart.getTime()) /
      (24 * 60 * 60 * 1000),
  );

  if (dayIndex < 0 || dayIndex > 6) return null;

  return {
    id: record.id,
    title: `${record.patient} · ${record.visitType}`,
    day: dayIndex,
    startHour: scheduledAt.getHours(),
    startMinute: scheduledAt.getMinutes(),
    timeLabel: formatEventTime(scheduledAt),
    durationHours: 1,
    color:
      VISIT_COLORS[record.visitType] ?? 'bg-slate-100 border-slate-400 text-slate-900',
  };
}

export function mapAppointmentsToCalendarEvents(
  records: AppointmentRecord[],
  weekStart: Date,
): CalendarEvent[] {
  return records
    .map((record) => mapAppointmentToCalendarEvent(record, weekStart))
    .filter((event): event is CalendarEvent => event !== null);
}

/** Maps a follow-up list row into the appointment shape used by the calendar. */
export function mapFollowUpToCalendarAppointment(
  followUp: FollowUpRecord,
): AppointmentRecord {
  const status =
    followUp.status === 'Upcoming'
      ? 'Scheduled'
      : followUp.status === 'Completed'
        ? 'Completed'
        : 'Cancelled';

  return {
    id: followUp.id,
    uhid: followUp.uhid,
    patient: followUp.patient,
    doctor: followUp.doctor,
    visitType: followUp.visitType || 'Follow-Up',
    appointmentDate: followUp.appointmentDate,
    dateCreated: followUp.dateCreated,
    status,
    patientId: followUp.patientId,
    assignedDoctorId: followUp.assignedDoctorId,
    registrationDate: followUp.dateCreated,
    slotTime: followUp.scheduleTime
      ? followUp.scheduleTime.length === 5
        ? `${followUp.scheduleTime}:00`
        : followUp.scheduleTime
      : undefined,
  };
}

export function getCalendarHourRange(events: CalendarEvent[]): number[] {
  let minHour = 7;
  let maxHour = 18;

  for (const event of events) {
    minHour = Math.min(minHour, event.startHour);
    maxHour = Math.max(maxHour, event.startHour + Math.ceil(event.durationHours));
  }

  minHour = Math.max(0, minHour - 1);
  maxHour = Math.min(23, maxHour + 1);

  return Array.from({ length: maxHour - minHour + 1 }, (_, i) => minHour + i);
}
