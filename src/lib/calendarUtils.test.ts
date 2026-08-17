import { describe, expect, it } from 'vitest';
import type { AppointmentRecord } from '@/types';
import {
  getWeekDays,
  getWeekStart,
  mapAppointmentsToCalendarEvents,
  parseAppointmentDateTime,
} from '@/lib/calendarUtils';

const baseRecord: AppointmentRecord = {
  id: 'ap-1',
  uhid: '#PT1',
  patient: 'Khushi Shroff',
  doctor: 'Dr. Sheekha',
  visitType: 'Consultation',
  appointmentDate: '15 Oct 2026, 10:00 AM',
  dateCreated: '2026-10-15',
  status: 'Scheduled',
  registrationDate: '2026-10-15',
  slotTime: '10:00:00',
};

describe('calendarUtils', () => {
  it('builds week day labels from the current week start', () => {
    const weekStart = getWeekStart(new Date('2026-08-03T12:00:00'));
    const labels = getWeekDays(weekStart).map((day) => day.label);
    expect(labels[0]).toMatch(/^Sun 2/);
    expect(labels).toHaveLength(7);
  });

  it('parses registration date and slot time', () => {
    const parsed = parseAppointmentDateTime(baseRecord);
    expect(parsed).not.toBeNull();
    expect(parsed?.getHours()).toBe(10);
    expect(parsed?.getDate()).toBe(15);
  });

  it('places events on the matching week column', () => {
    const weekStart = getWeekStart(new Date('2026-10-12T12:00:00'));
    const events = mapAppointmentsToCalendarEvents([baseRecord], weekStart);
    expect(events).toHaveLength(1);
    expect(events[0]?.day).toBe(4);
    expect(events[0]?.startHour).toBe(10);
    expect(events[0]?.timeLabel).toMatch(/10:00/);
  });

  it('parses ISO datetime in registration date', () => {
    const parsed = parseAppointmentDateTime({
      ...baseRecord,
      registrationDate: '2026-10-15T13:05:00',
      slotTime: '',
      appointmentDate: '15 Oct 2026, 10:00 AM',
    });
    expect(parsed).not.toBeNull();
    expect(parsed?.getHours()).toBe(13);
    expect(parsed?.getMinutes()).toBe(5);
  });

  it('places events at the correct minute offset within the hour row', () => {
    const weekStart = getWeekStart(new Date('2026-10-12T12:00:00'));
    const events = mapAppointmentsToCalendarEvents(
      [
        {
          ...baseRecord,
          registrationDate: '2026-10-15T13:30:00',
          slotTime: '13:30:00',
        },
      ],
      weekStart,
    );
    expect(events).toHaveLength(1);
    expect(events[0]?.startHour).toBe(13);
    expect(events[0]?.startMinute).toBe(30);
  });

  it('excludes appointments outside the visible week', () => {
    const weekStart = getWeekStart(new Date('2026-11-01T12:00:00'));
    const events = mapAppointmentsToCalendarEvents([baseRecord], weekStart);
    expect(events).toHaveLength(0);
  });
});
