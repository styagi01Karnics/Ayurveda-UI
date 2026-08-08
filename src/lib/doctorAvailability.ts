export const DOCTOR_AVAILABILITY_DAY_OPTIONS = [
  { value: 'weekdays' as const, label: 'Mon – Fri' },
  { value: 'saturday' as const, label: 'Saturday' },
  { value: 'sunday' as const, label: 'Sunday' },
];

export type DoctorAvailabilityDay = (typeof DOCTOR_AVAILABILITY_DAY_OPTIONS)[number]['value'];

/** Formats 24h "HH:mm" to API-friendly "9:00 AM" / "5:00 PM". */
export function formatAvailabilityTime(time: string): string {
  const [hourPart, minutePart = '00'] = time.split(':');
  const hours = Number.parseInt(hourPart, 10);
  if (Number.isNaN(hours)) return time;
  const period = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  return `${h12}:${minutePart.padStart(2, '0')} ${period}`;
}

/** Builds API availability string e.g. "Mon-Fri 9:00 AM-5:00 PM, Sat 9:00 AM-1:00 PM". */
export function formatDoctorAvailability(
  days: DoctorAvailabilityDay[],
  startTime: string,
  endTime: string,
): string {
  const range = `${formatAvailabilityTime(startTime)}-${formatAvailabilityTime(endTime)}`;
  const parts: string[] = [];

  if (days.includes('weekdays')) parts.push(`Mon-Fri ${range}`);
  if (days.includes('saturday')) parts.push(`Sat ${range}`);
  if (days.includes('sunday')) parts.push(`Sun ${range}`);

  return parts.join(', ');
}
