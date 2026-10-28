import { z } from 'zod';

/** Clinic booking hours: 10:00 AM – 7:00 PM (inclusive). */
export const BOOKING_TIME_MIN = '10:00';
export const BOOKING_TIME_MAX = '19:00';
export const BOOKING_TIME_RANGE_LABEL = '10:00 AM – 7:00 PM';
export const DEFAULT_SESSION_FREQUENCY = '1';

export function getTodayIsoDate(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseTimeToMinutes(time: string): number | null {
  const match = time.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function isBookingTimeInRange(time: string): boolean {
  const minutes = parseTimeToMinutes(time);
  if (minutes === null) return false;
  const min = parseTimeToMinutes(BOOKING_TIME_MIN)!;
  const max = parseTimeToMinutes(BOOKING_TIME_MAX)!;
  return minutes >= min && minutes <= max;
}

function formatBookingTimeLabel(time: string): string {
  const minutes = parseTimeToMinutes(time);
  if (minutes === null) return time;
  const hours24 = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${String(mins).padStart(2, '0')} ${period}`;
}

/** Half-hour slots from 10:00 AM through 7:00 PM — used for booking time selects. */
export function generateBookingTimeOptions(stepMinutes = 30) {
  const min = parseTimeToMinutes(BOOKING_TIME_MIN)!;
  const max = parseTimeToMinutes(BOOKING_TIME_MAX)!;
  const options: { value: string; label: string }[] = [];

  for (let minutes = min; minutes <= max; minutes += stepMinutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const value = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    options.push({ value, label: formatBookingTimeLabel(value) });
  }

  return options;
}

export const BOOKING_TIME_OPTIONS = generateBookingTimeOptions();

/** Snaps a time value to the nearest valid booking slot (10:00–19:00). */
export function normalizeBookingTimeForSelect(time: string): string {
  const minutes = parseTimeToMinutes(time.trim().slice(0, 5));
  if (minutes === null) return BOOKING_TIME_MIN;

  const min = parseTimeToMinutes(BOOKING_TIME_MIN)!;
  const max = parseTimeToMinutes(BOOKING_TIME_MAX)!;
  const clamped = Math.min(max, Math.max(min, minutes));
  const step = 30;
  const snapped = Math.round(clamped / step) * step;
  const finalMinutes = Math.min(max, Math.max(min, snapped));
  const hours = Math.floor(finalMinutes / 60);
  const mins = finalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

export function isBookingDateOnOrAfterToday(date: string): boolean {
  if (!date.trim()) return true;
  return date.slice(0, 10) >= getTodayIsoDate();
}

export const bookingDateNotPastMessage = 'Date cannot be before today';
export const bookingTimeRangeMessage = `Time must be between ${BOOKING_TIME_RANGE_LABEL}`;

export const optionalBookingDateSchema = z
  .string()
  .optional()
  .refine((value) => !value || isBookingDateOnOrAfterToday(value), {
    message: bookingDateNotPastMessage,
  });

export const requiredBookingDateSchema = z
  .string()
  .min(1, 'Date is required')
  .refine(isBookingDateOnOrAfterToday, {
    message: bookingDateNotPastMessage,
  });

export const optionalBookingTimeSchema = z
  .string()
  .optional()
  .refine((value) => !value || isBookingTimeInRange(value), {
    message: bookingTimeRangeMessage,
  });

export const requiredBookingTimeSchema = z
  .string()
  .min(1, 'Time is required')
  .refine(isBookingTimeInRange, {
    message: bookingTimeRangeMessage,
  });

export const bookingTimeInputProps = {
  min: BOOKING_TIME_MIN,
  max: BOOKING_TIME_MAX,
} as const;

export function bookingDateInputProps(date = new Date()) {
  return { min: getTodayIsoDate(date) } as const;
}
