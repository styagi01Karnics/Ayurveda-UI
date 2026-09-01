/**
 * Estimate billable medicine quantity from prescription dosage, frequency, and duration.
 * Examples: "1 tablet" × "Twice daily" × "7 days" → 14
 */
export function parsePositiveInt(value: string | undefined | null, fallback = 1): number {
  if (!value) return fallback;
  const match = value.match(/\d+/);
  if (!match) return fallback;
  const n = Number(match[0]);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function parseDurationDays(duration: string | undefined | null): number {
  if (!duration?.trim()) return 1;
  const lower = duration.toLowerCase();
  const amount = parsePositiveInt(duration, 1);
  if (/\bweeks?\b/.test(lower)) return amount * 7;
  if (/\bmonths?\b/.test(lower)) return amount * 30;
  return amount;
}

type FrequencyRate =
  | { kind: 'daily'; times: number }
  | { kind: 'weekly'; times: number }
  | { kind: 'once'; times: number };

export function parseFrequencyRate(frequency: string | undefined | null): FrequencyRate {
  const lower = (frequency ?? '').toLowerCase().trim();
  if (!lower) return { kind: 'daily', times: 1 };

  if (/\bas needed\b|\bsos\b/.test(lower)) {
    return { kind: 'once', times: 1 };
  }
  if (/\btwice a week\b|\b2\s*\/\s*week\b/.test(lower)) {
    return { kind: 'weekly', times: 2 };
  }
  if (/\bonce a week\b|\b1\s*\/\s*week\b|\bweekly\b/.test(lower)) {
    return { kind: 'weekly', times: 1 };
  }
  if (/\bthrice\b|\btds\b|\bthree times\b|\b3\s*(x|times)?\b/.test(lower)) {
    return { kind: 'daily', times: 3 };
  }
  if (/\btwice\b|\bbd\b|\btwo times\b|\b2\s*(x|times)?\b/.test(lower)) {
    return { kind: 'daily', times: 2 };
  }
  if (/\bonce\b|\bod\b|\bbedtime\b|\bhs\b|\bnight\b|\b1\s*(x|times)?\b/.test(lower)) {
    return { kind: 'daily', times: 1 };
  }

  const numeric = parsePositiveInt(frequency, 1);
  return { kind: 'daily', times: numeric };
}

export function calculatePrescriptionMedicineQuantity(input: {
  dosage?: string | null;
  frequency?: string | null;
  duration?: string | null;
}): number {
  const unitsPerDose = parsePositiveInt(input.dosage, 1);
  const days = parseDurationDays(input.duration);
  const rate = parseFrequencyRate(input.frequency);

  let quantity: number;
  if (rate.kind === 'weekly') {
    const weeks = Math.max(1, Math.ceil(days / 7));
    quantity = unitsPerDose * rate.times * weeks;
  } else if (rate.kind === 'once') {
    quantity = unitsPerDose * Math.max(1, days);
  } else {
    quantity = unitsPerDose * rate.times * days;
  }

  return Math.max(1, Math.round(quantity));
}
