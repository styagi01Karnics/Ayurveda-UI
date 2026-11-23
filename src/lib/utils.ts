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
export function formatDoctorName(name: string | null | undefined): string {
  if (name == null) return '—';
  const trimmed = name.trim();
  if (!trimmed || trimmed === '—') return '—';
  // Strip existing Dr. prefix (case-insensitive, handles "Dr.", "Dr", "DR.", "dr", etc.)
  const withoutPrefix = trimmed.replace(/^\s*dr\.?\s+/i, '');
  const formatted = formatPersonName(withoutPrefix);
  return `Dr. ${formatted}`;
}
