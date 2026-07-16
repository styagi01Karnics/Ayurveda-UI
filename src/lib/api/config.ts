const trimSlash = (url: string) => url.replace(/\/+$/, '');

export const apiConfig = {
  patient: trimSlash(import.meta.env.VITE_PATIENT_API_URL ?? '/patient-api'),
  doctor: trimSlash(import.meta.env.VITE_DOCTOR_API_URL ?? '/doctor-api'),
  appointment: trimSlash(
    import.meta.env.VITE_APPOINTMENT_API_URL ?? '/appointment-api',
  ),
  therapist: trimSlash(
    import.meta.env.VITE_THERAPIST_API_URL ?? '/therapist-api',
  ),
} as const;
