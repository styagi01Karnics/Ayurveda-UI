import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value);
}

export function formatString (str: string): string {
  return str
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .replace(/(^|\s)\S/g, char => char.toUpperCase());
};

/**
 * Display names with each word capitalized, e.g. "rashee jain" → "Rashee Jain".
 * Leaves placeholders like "—" unchanged.
 */
export function formatPersonName(value: string | null | undefined): string {
  if (value == null) return '';
  const trimmed = value.trim();
  if (!trimmed || trimmed === '—') return trimmed;
  return trimmed
    .split(/\s+/)
    .map((word) =>
      word
        .split('-')
        .map((part) => {
          if (!part) return part;
          const lower = part.toLowerCase();
          return lower.charAt(0).toUpperCase() + lower.slice(1);
        })
        .join('-'),
    )
    .join(' ');
}

/**
 * Strip any leading "Dr." / "Dr" / "DR." / "dr" prefix (case-insensitive)
 * and format the name cleanly with "Dr. " prefix.
 * Returns "—" for empty/placeholder values.
 */
/**
 * Format a date value to "DD-MM-YYYY" (e.g. "16-11-2026").
 * Avoids timezone shifts by parsing ISO date strings via regex.
 * Returns "—" for null/empty/invalid values.
 */
export function formatToDDMMYYYY(value?: string | null): string {
  if (value == null) return '—';
  const trimmed = value.trim();
  if (!trimmed || trimmed === '—') return '—';

  // ISO date: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    return `${isoMatch[3]}-${isoMatch[2]}-${isoMatch[1]}`;
  }

  // Pre-formatted "DD MMM YYYY" (e.g. "16 Nov 2026")
  const monthNames: Record<string, string> = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
  };
  const namedMatch = trimmed.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
  if (namedMatch) {
    const day = namedMatch[1].padStart(2, '0');
    const month = monthNames[namedMatch[2]];
    const year = namedMatch[3];
    if (month) return `${day}-${month}-${year}`;
  }

  // Fallback: try Date parsing (may have TZ shifts)
  const date = new Date(trimmed);
  if (!isNaN(date.getTime())) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  return trimmed;
}
export function formatDoctorName(name?: string | null): string {
  if (name == null) return '—';
  const trimmed = name.trim();
  if (!trimmed || trimmed === '—') return '—';
  // Strip existing Dr. prefix (case-insensitive, handles "Dr.", "Dr", "DR.", "dr", etc.)
  const withoutPrefix = trimmed.replace(/^\s*dr\.?\s+/i, '');
  const formatted = formatPersonName(withoutPrefix);
  return `Dr. ${formatted}`;
}
