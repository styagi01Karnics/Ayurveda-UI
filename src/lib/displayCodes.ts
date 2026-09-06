/**
 * Business display codes vs UUIDs.
 * UI shows codes (e.g. GAN-DL-PT-00013, GAN-DL-INV-00018).
 * API paths / request bodies use UUID ids.
 */

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string | null | undefined): boolean {
  return Boolean(value && UUID_RE.test(value.trim()));
}

/** Format patient business code for UI (adds # prefix). */
export function formatPatientCode(
  code: string | null | undefined,
  fallback = '—',
): string {
  const raw = (code ?? '').trim().replace(/^#/, '');
  if (!raw || isUuid(raw)) return fallback;
  return `#${raw}`;
}

/**
 * Resolve patient code for display. Prefer `patientCode`; never show bare UUID.
 */
export function resolvePatientDisplayCode(source: {
  patientCode?: string | null;
  patientDisplayId?: string | null;
  formattedPatientId?: string | null;
  id?: string | null;
  patientId?: string | null;
}): string {
  if (source.patientCode?.trim()) {
    return formatPatientCode(source.patientCode);
  }

  for (const legacy of [
    source.patientDisplayId,
    source.formattedPatientId,
  ]) {
    const value = legacy?.trim().replace(/^#/, '');
    if (value && !isUuid(value)) {
      return formatPatientCode(value);
    }
  }

  return '—';
}

/**
 * Resolve invoice business number for UI.
 * Prefer `invoiceNumber`; use `invoiceId` only when it is not a UUID
 * (list endpoints often put the business code in `invoiceId`).
 */
export function resolveInvoiceDisplayCode(source: {
  invoiceNumber?: string | null;
  invoiceId?: string | null;
}): string {
  const number = source.invoiceNumber?.trim();
  if (number && !isUuid(number)) return number;

  const idOrCode = source.invoiceId?.trim();
  if (!idOrCode) return '—';
  if (isUuid(idOrCode)) return number && !isUuid(number) ? number : '—';
  return idOrCode;
}
