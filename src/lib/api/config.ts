const trimSlash = (url: string) => url.replace(/\/+$/, '');

/**
 * Leave bases empty in local dev so requests are `/api/v1/...`
 * (Vite proxies to 103.174.103.250 — no CORS, no `/appointment-api` prefix).
 *
 * For production absolute hosts, set e.g.
 * VITE_APPOINTMENT_API_URL=http://103.174.103.250:8103
 */
function resolveBase(envValue: string | undefined): string {
  if (envValue == null || envValue.trim() === '') return '';
  return trimSlash(envValue);
}

export const apiConfig = {
  patient: resolveBase(import.meta.env.VITE_PATIENT_API_URL),
  doctor: resolveBase(import.meta.env.VITE_DOCTOR_API_URL),
  appointment: resolveBase(import.meta.env.VITE_APPOINTMENT_API_URL),
  therapist: resolveBase(import.meta.env.VITE_THERAPIST_API_URL),
} as const;
