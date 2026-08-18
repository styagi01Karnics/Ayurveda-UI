import { getTodayIsoDate } from '@/lib/bookingConstraints';

export const APPOINTMENT_REMINDER_MINUTES = 5;

export function parseScheduleDateTime(
  slotTime?: string | null,
  bookingTime?: string | null,
  referenceDate = new Date(),
): Date | null {
  const raw = slotTime ?? bookingTime;
  if (!raw?.trim()) return null;

  if (raw.includes('T')) {
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const today = getTodayIsoDate(referenceDate);
  const normalized =
    /^\d{2}:\d{2}$/.test(raw) ? `${raw}:00` : raw.slice(0, 8);
  const parsed = new Date(`${today}T${normalized}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function minutesUntilAppointment(
  scheduledAt: Date,
  now = new Date(),
): number {
  return (scheduledAt.getTime() - now.getTime()) / (60 * 1000);
}

/** True when the appointment starts within the next N minutes (inclusive). */
export function isAppointmentWithinMinutes(
  scheduledAt: Date,
  minutes: number,
  now = new Date(),
): boolean {
  const diff = minutesUntilAppointment(scheduledAt, now);
  return diff >= 0 && diff <= minutes;
}

/** Doctor may start at most N minutes before the scheduled time, or any time after. */
export function canStartConsultation(
  scheduledAt: Date,
  now = new Date(),
  earlyGraceMinutes = APPOINTMENT_REMINDER_MINUTES,
): boolean {
  return minutesUntilAppointment(scheduledAt, now) <= earlyGraceMinutes;
}

export function isConsultationNotStartedError(error: unknown): boolean {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : '';
  return /not started|too early|within \d+\s*minutes|scheduled time|before the scheduled/i.test(
    message,
  );
}

export function formatAppointmentReminderTime(scheduledAt: Date): string {
  return scheduledAt.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}
