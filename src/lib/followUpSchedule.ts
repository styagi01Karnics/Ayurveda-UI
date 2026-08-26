/** Adds N days from values like `7_DAYS`, `14_DAYS`, `30_DAYS`. */
export function addDaysFromSchedulingOption(
  baseDate: string | Date | null | undefined,
  schedulingOption?: string | null,
): Date | null {
  if (!baseDate || !schedulingOption) return null;
  const match = schedulingOption.trim().match(/^(\d+)_DAYS$/i);
  if (!match) return null;
  const base =
    baseDate instanceof Date ? new Date(baseDate) : new Date(baseDate);
  if (Number.isNaN(base.getTime())) return null;
  base.setDate(base.getDate() + Number(match[1]));
  return base;
}

export function toFollowUpAppointmentDateIso(
  baseDate: string | Date | null | undefined,
  schedulingOption?: string | null,
  fallbackTime = '10:00:00',
): string {
  const computed = addDaysFromSchedulingOption(baseDate, schedulingOption);
  const date = computed ?? (baseDate ? new Date(baseDate) : new Date());
  if (Number.isNaN(date.getTime())) {
    const today = new Date();
    return `${today.toISOString().slice(0, 10)}T${fallbackTime}`;
  }
  const ymd = date.toISOString().slice(0, 10);
  const hasTime =
    typeof baseDate === 'string' && baseDate.includes('T')
      ? baseDate.split('T')[1]?.slice(0, 8)
      : null;
  const time =
    hasTime && /^\d{2}:\d{2}/.test(hasTime)
      ? hasTime.length === 5
        ? `${hasTime}:00`
        : hasTime
      : fallbackTime;
  return `${ymd}T${time}`;
}
