import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

export type PatientSearchOption = {
  value: string;
  label: string;
  /** Display / UHID / patient code used for search. */
  patientId?: string;
  /** Full name used for search. */
  name?: string;
};

interface PatientSearchSelectProps {
  label?: string;
  placeholder?: string;
  options: PatientSearchOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  /** Minimum characters before matches are shown. */
  minChars?: number;
}

function normalizeSearchText(value: string | undefined): string {
  return (value ?? '').toLowerCase().replace(/[#\s]+/g, '');
}

function matchesPatientQuery(option: PatientSearchOption, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;

  const compactQuery = q.replace(/[#\s]+/g, '');
  const idCandidates = [
    option.patientId,
    option.value,
    option.label.split('—')[0],
    option.label.split('-')[0],
  ]
    .map((part) => normalizeSearchText(part))
    .filter(Boolean);

  const nameCandidates = [
    option.name,
    option.label.includes('—')
      ? option.label.split('—').slice(1).join('—')
      : option.label,
  ]
    .map((part) => (part ?? '').toLowerCase().trim())
    .filter(Boolean);

  const idMatch = idCandidates.some(
    (id) => id.includes(compactQuery) || compactQuery.includes(id),
  );
  const nameMatch = nameCandidates.some((name) => name.includes(q));
  const labelMatch = option.label.toLowerCase().includes(q);

  return idMatch || nameMatch || labelMatch;
}

export function PatientSearchSelect({
  label = 'Select Patient',
  placeholder = 'Search by patient code or name (min 4 characters)',
  options,
  value,
  onChange,
  error,
  disabled = false,
  minChars = 4,
}: PatientSearchSelectProps) {
  const selected = options.find((option) => option.value === value);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const displayQuery = open ? query : selected?.label ?? query;

  const matches = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length < minChars) return [];
    return options.filter((option) => matchesPatientQuery(option, trimmed));
  }, [options, query, minChars]);

  return (
    <div className="relative flex w-full flex-col gap-1.5">
      {label ? (
        <span className="text-xs font-medium text-text-muted">{label}</span>
      ) : null}
      <input
        type="search"
        disabled={disabled}
        value={displayQuery}
        placeholder={placeholder}
        autoComplete="off"
        onFocus={() => {
          setOpen(true);
          setQuery(selected?.label ?? '');
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          if (value) onChange('');
        }}
        onBlur={() => {
          window.setTimeout(() => setOpen(false), 150);
        }}
        className={cn(
          'w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20',
          error && 'border-danger focus:border-danger focus:ring-danger/20',
          disabled && 'cursor-not-allowed bg-gray-50 opacity-70',
        )}
      />
      {open && !disabled ? (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
          {query.trim().length < minChars ? (
            <p className="px-3 py-2 text-xs text-text-muted">
              Type at least {minChars} characters to search by patient code or name
            </p>
          ) : matches.length === 0 ? (
            <p className="px-3 py-2 text-xs text-text-muted">No patients found</p>
          ) : (
            matches.map((option) => (
              <button
                key={option.value}
                type="button"
                className={cn(
                  'block w-full px-3 py-2 text-left text-sm text-brown hover:bg-gold/10',
                  option.value === value && 'bg-gold/15 font-medium',
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(option.value);
                  setQuery(option.label);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            ))
          )}
        </div>
      ) : null}
      {error ? (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
