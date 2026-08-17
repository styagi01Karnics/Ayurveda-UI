import { describe, expect, it } from 'vitest';
import {
  BOOKING_TIME_MAX,
  BOOKING_TIME_MIN,
  generateBookingTimeOptions,
  getTodayIsoDate,
  isBookingDateOnOrAfterToday,
  isBookingTimeInRange,
  normalizeBookingTimeForSelect,
} from '@/lib/bookingConstraints';

describe('bookingConstraints', () => {
  it('returns today in ISO format', () => {
    expect(getTodayIsoDate(new Date('2026-08-17T15:30:00'))).toBe('2026-08-17');
  });

  it('rejects dates before today', () => {
    const today = getTodayIsoDate(new Date('2026-08-17T12:00:00'));
    expect(isBookingDateOnOrAfterToday('2026-08-16')).toBe(false);
    expect(isBookingDateOnOrAfterToday(today)).toBe(true);
    expect(isBookingDateOnOrAfterToday('2026-08-18')).toBe(true);
  });

  it('allows booking times only between 10:00 and 19:00', () => {
    expect(isBookingTimeInRange('09:59')).toBe(false);
    expect(isBookingTimeInRange(BOOKING_TIME_MIN)).toBe(true);
    expect(isBookingTimeInRange('13:30')).toBe(true);
    expect(isBookingTimeInRange(BOOKING_TIME_MAX)).toBe(true);
    expect(isBookingTimeInRange('19:01')).toBe(false);
    expect(isBookingTimeInRange('22:00')).toBe(false);
  });

  it('generates booking time options only within clinic hours', () => {
    const values = generateBookingTimeOptions().map((option) => option.value);
    expect(values[0]).toBe('10:00');
    expect(values.at(-1)).toBe('19:00');
    expect(values).not.toContain('22:00');
  });

  it('snaps out-of-range times to valid booking slots', () => {
    expect(normalizeBookingTimeForSelect('22:00')).toBe('19:00');
    expect(normalizeBookingTimeForSelect('08:30')).toBe('10:00');
  });
});
