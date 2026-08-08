const trimSlash = (url: string) => url.replace(/\/+$/, '');

/**
 * Leave bases empty in local dev so requests are `/api/v1/...`
 * (Vite proxies to VITE_BACKEND_HOST — default localhost — no CORS).
 *
 * For production absolute hosts, set e.g.
 * VITE_APPOINTMENT_API_URL=http://103.174.103.250:8103
 */
function resolveBase(envValue: string | undefined): string {
  if (envValue == null || envValue.trim() === '') return '';
  return trimSlash(envValue);
}

export const apiConfig = {
  auth: resolveBase(import.meta.env.VITE_AUTH_API_URL),
  patient: resolveBase(import.meta.env.VITE_PATIENT_API_URL),
  doctor: resolveBase(import.meta.env.VITE_DOCTOR_API_URL),
  appointment: resolveBase(import.meta.env.VITE_APPOINTMENT_API_URL),
  therapist: resolveBase(import.meta.env.VITE_THERAPIST_API_URL),
  medicine: resolveBase(import.meta.env.VITE_MEDICINE_API_URL),
  billing: resolveBase(import.meta.env.VITE_BILLING_API_URL),
  notification: resolveBase(import.meta.env.VITE_NOTIFICATION_API_URL),
  activityLog: resolveBase(import.meta.env.VITE_ACTIVITY_LOG_API_URL),
  attendance: resolveBase(import.meta.env.VITE_ATTENDANCE_API_URL),
  fileUpload: resolveBase(import.meta.env.VITE_FILE_UPLOAD_API_URL),
} as const;
