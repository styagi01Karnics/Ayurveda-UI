/**
 * Canonical API paths matching backend Postman collection.
 * In local dev, bases are empty so the browser calls these paths
 * directly (e.g. POST /api/v1/appointments) — Vite proxies to :8103.
 */
export const apiEndpoints = {
  /** Auth-service :8111 */
  auth: {
    login: '/api/v1/auth/login',
    signup: '/api/v1/auth/signup',
    forgotPassword: '/api/v1/auth/forgot-password',
    resetPassword: '/api/v1/auth/reset-password',
    validate: '/api/v1/auth/validate',
    registerUser: '/api/v1/auth/register-user',
    me: '/api/v1/auth/me',
    users: '/api/v1/auth/users',
    tenant: '/api/v1/auth/tenant',
  },
  tenants: {
    register: '/api/v1/tenants/register',
  },

  /** Patient-service :8101 */
  patients: {
    base: '/api/v1/patients',
    getAll: '/api/v1/patients/get-all-patients',
    getById: (patientId: string) => `/api/v1/patients/get-patient/${patientId}`,
    create: '/api/v1/patients/create-patient',
    delete: (patientId: string) => `/api/v1/patients/delete-patient/${patientId}`,
    getCount: '/api/v1/patients/get-patient-count',
  },

  /** Doctor-service :8102 */
  doctors: {
    base: '/api/v1/doctors',
    getAll: '/api/v1/doctors',
    getActive: '/api/v1/doctors/active',
    getById: (doctorId: string) => `/api/v1/doctors/${doctorId}`,
    updateStatus: (doctorId: string) => `/api/v1/doctors/${doctorId}/status`,
    create: '/api/v1/doctors',
  },

  /** Therapist-service :8104 */
  therapists: {
    base: '/api/v1/therapists',
    getAll: '/api/v1/therapists',
    getById: (therapistId: string) => `/api/v1/therapists/${therapistId}`,
    updateStatus: (therapistId: string) =>
      `/api/v1/therapists/${therapistId}/status`,
    getByTherapies: '/api/v1/therapists/by-therapies',
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
      base: '/api/v1/therapies',
      getAll: '/api/v1/therapies',
      create: '/api/v1/therapies',
      getById: (therapyId: string) => `/api/v1/therapies/${therapyId}`,
      updateStatus: (therapyId: string) =>
        `/api/v1/therapies/${therapyId}/status`,
      getByCategoryId: (categoryId: string) =>
        `/api/v1/therapies/category/${categoryId}`,
    },
    bookings: {
      getAllPatients: '/api/v1/appointments/patients',
      getByPatientId: (patientId: string) =>
        `/api/v1/appointments/patient/${patientId}`,
      getByBookingId: (bookingId: string) =>
        `/api/v1/appointments/${bookingId}`,
      getByStatus: (bookingStatus: string) =>
        `/api/v1/appointments/status/${bookingStatus}`,
      getToday: (consultationType: string) =>
        `/api/v1/appointments/today/${consultationType}`,
      getTodayAll: '/api/v1/appointments/today',
      getByDate: (registrationDate: string) =>
        `/api/v1/appointments/date/${registrationDate}`,
      getStats: '/api/v1/appointments/stats',
      getCancelled: '/api/v1/appointments/cancelled',
      getDoctorToday: (doctorId: string) =>
        `/api/v1/appointments/doctor/${doctorId}/today`,
      cancel: (bookingId: string) =>
        `/api/v1/appointments/${bookingId}/cancel`,
      reschedule: (bookingId: string) =>
        `/api/v1/appointments/${bookingId}/reschedule`,
      inConsultation: (bookingId: string) =>
        `/api/v1/appointments/${bookingId}/in-consultation`,
      complete: (bookingId: string) =>
        `/api/v1/appointments/${bookingId}/complete`,
      create: '/api/v1/appointments',
    },
    appointmentTherapies: {
      getByPatientId: (patientId: string) =>
        `/api/v1/appointment-therapies/${patientId}`,
      getTherapistToday: (therapistId: string) =>
        `/api/v1/appointment-therapies/therapist/${therapistId}/today`,
      create: '/api/v1/appointment-therapies',
    },
    schedule: {
      todaysSchedule: '/api/v1/dashboard/todays-schedule',
    },
    treatmentPlans: {
      create: '/api/v1/treatment-plans',
      getByPatientId: (patientId: string) =>
        `/api/v1/treatment-plans/${patientId}`,
    },
    systemicExaminations: {
      create: '/api/v1/systemic-examinations',
      getByPatientId: (patientId: string) =>
        `/api/v1/systemic-examinations/${patientId}`,
    },
    physicalExaminations: {
      create: '/api/v1/physical-examinations',
      getByPatientId: (patientId: string) =>
        `/api/v1/physical-examinations/${patientId}`,
    },
    medicalHistories: {
      create: '/api/v1/medical-histories',
      getByPatientId: (patientId: string) =>
        `/api/v1/medical-histories/${patientId}`,
    },
    medicalAssessment: {
      create: '/api/v1/medical-assessment',
      createWithDocuments: '/api/v1/medical-assessment/with-documents',
      getByPatientId: (patientId: string) =>
        `/api/v1/medical-assessment/${patientId}`,
    },
    lifestyleInformation: {
      create: '/api/v1/lifestyle-information',
      getByPatientId: (patientId: string) =>
        `/api/v1/lifestyle-information/${patientId}`,
    },
    ayurvedicAssessments: {
      create: '/api/v1/ayurvedic-assessments',
      getByPatientId: (patientId: string) =>
        `/api/v1/ayurvedic-assessments/${patientId}`,
    },
    doshas: {
      getAll: '/api/v1/doshas',
      getById: (doshaId: string) => `/api/v1/doshas/${doshaId}`,
      create: '/api/v1/doshas',
    },
  },

  /** Medicine & Dashboard-service :8108 */
  medicines: {
    base: '/api/v1/medicines',
    getById: (id: string) => `/api/v1/medicines/${id}`,
    deductStock: (id: string) => `/api/v1/medicines/${id}/stock/deduct`,
    restoreStock: (id: string) => `/api/v1/medicines/${id}/stock/restore`,
    categories: '/api/v1/medicines/meta/categories',
    names: '/api/v1/medicines/meta/names',
    manufacturers: '/api/v1/medicines/meta/manufacturers',
    lowStock: '/api/v1/medicines/low-stock',
  },
  dashboard: {
    medicineStock: '/api/v1/dashboard/medicine-stock',
    billingSummary: '/api/v1/dashboard/billing-summary',
  },

  /** Billing-service :8109 */
  billing: {
    invoices: '/api/v1/invoices',
    invoiceById: (invoiceId: string) => `/api/v1/invoices/${invoiceId}`,
    invoicePayment: (invoiceId: string) =>
      `/api/v1/invoices/${invoiceId}/payments`,
    sales: '/api/v1/sales',
    salesRevenueMonth: '/api/v1/sales/revenue/month',
  },

  /** Notification-service :8110 */
  notifications: {
    base: '/api/v1/notifications',
    unreadCount: '/api/v1/notifications/unread-count',
    byId: (id: string) => `/api/v1/notifications/${id}`,
    markRead: (id: string) => `/api/v1/notifications/${id}/read`,
    markAllRead: '/api/v1/notifications/read-all',
  },

  /** Activity-log-service :8107 */
  activityLogs: {
    base: '/api/v1/activity-logs',
    byId: (id: string) => `/api/v1/activity-logs/${id}`,
  },

  /** Attendance-service :8106 */
  attendances: {
    base: '/api/v1/attendances',
    checkIn: '/api/v1/attendances/check-in',
    byId: (id: string) => `/api/v1/attendances/${id}`,
    checkOut: (id: string) => `/api/v1/attendances/${id}/check-out`,
    status: (id: string) => `/api/v1/attendances/${id}/status`,
    byEmployee: (empId: string) => `/api/v1/attendances/employee/${empId}`,
  },

  /** File-upload-service :8105 */
  documents: {
    upload: '/api/v1/documents/upload',
    byBookingId: (bookingId: string) => `/api/v1/documents/${bookingId}`,
    download: (documentId: string) => `/api/v1/documents/${documentId}/download`,
    delete: (documentId: string) => `/api/v1/documents/${documentId}`,
  },
} as const;
