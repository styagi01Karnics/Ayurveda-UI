/**
 * Canonical API paths matching backend Postman collection.
 * In local dev, bases are empty so the browser calls these paths
 * directly (e.g. POST /api/v1/appointments) — Vite proxies to :8103.
 */
export const apiEndpoints = {
  /** Patient-service :8101 */
  patients: {
    getAll: '/api/v1/patients/get-all-patients',
    getById: (patientId: string) =>
      `/api/v1/patients/get-patient/${patientId}`,
    create: '/api/v1/patients/create-patient',
  },

  /** Doctor-service :8102 */
  doctors: {
    getAll: '/api/v1/doctors',
    getById: (doctorId: string) => `/api/v1/doctors/${doctorId}`,
    create: '/api/v1/doctors',
  },

  /** Therapist-service :8104 */
  therapists: {
    getAll: '/api/v1/therapists',
    getById: (therapistId: string) => `/api/v1/therapists/${therapistId}`,
    create: '/api/v1/therapists',
  },

  /** Appointment-service :8103 */
  appointments: {
    treatmentCategories: {
      getAll: '/api/v1/treatment-categories',
      getById: (categoryId: string) =>
        `/api/v1/treatment-categories/${categoryId}`,
      create: '/api/v1/treatment-categories',
    },
    therapies: {
      getAll: '/api/v1/therapies',
      create: '/api/v1/therapies',
    },
    bookings: {
      getByPatientId: (patientId: string) =>
        `/api/v1/appointments/patient/${patientId}`,
      getByBookingId: (bookingId: string) =>
        `/api/v1/appointments/${bookingId}`,
      create: '/api/v1/appointments',
    },
    appointmentTherapies: {
      getByPatientId: (patientId: string) =>
        `/api/v1/appointment-therapies/${patientId}`,
      create: '/api/v1/appointment-therapies',
    },
    doshas: {
      getAll: '/api/v1/doshas',
      getById: (doshaId: string) => `/api/v1/doshas/${doshaId}`,
      create: '/api/v1/doshas',
    },
  },
} as const;
