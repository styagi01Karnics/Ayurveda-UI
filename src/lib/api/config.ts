const trimSlash = (url: string) => url.replace(/\/+$/, '');

/**
 * Defaults use Vite proxy prefixes (same-origin → no CORS in `npm run dev`).
 * Override with absolute hosts only when the backend allows your UI origin,
 * or when building for a same-origin gateway.
 */
const DEFAULTS = {
  patient: '/patient-api',
  doctor: '/doctor-api',
  appointment: '/appointment-api',
  therapist: '/therapist-api',
} as const;

export const apiConfig = {
  patient: trimSlash(import.meta.env.VITE_PATIENT_API_URL ?? DEFAULTS.patient),
  doctor: trimSlash(import.meta.env.VITE_DOCTOR_API_URL ?? DEFAULTS.doctor),
  appointment: trimSlash(
    import.meta.env.VITE_APPOINTMENT_API_URL ?? DEFAULTS.appointment,
  ),
  therapist: trimSlash(
    import.meta.env.VITE_THERAPIST_API_URL ?? DEFAULTS.therapist,
  ),
} as const;
