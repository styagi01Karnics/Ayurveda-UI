import { ApiError } from '@/lib/api/client';

export const UI_MESSAGES = {
  loading: 'Loading…',
  retry: 'Try again',

  empty: {
    default: 'No records found.',
    patients: 'No patients found.',
    patientsFiltered: 'No patients found matching your filters.',
    appointments: 'No appointments found.',
    followUps: 'No follow-ups found.',
    treatments: 'No treatments found.',
    medicines: 'No medicines found matching your filters.',
    billing: 'No billing records found.',
    sales: 'No sales records found.',
    activityLogs: 'No activity logs found.',
    doctorsToday: 'No appointments scheduled for today.',
    patientDetail: 'Patient not found.',
    banners: 'No banners yet. Create your first promotional banner.',
    communications: 'No messages sent yet.',
    uploadFiles: 'No files added yet.',
  },

  error: {
    default: 'Something went wrong. Please try again.',
    loadFailed: 'Unable to load data. Please try again.',
    saveFailed: 'Unable to save changes. Please try again.',
    deleteFailed: 'Unable to delete. Please try again.',
    uploadFailed: 'Unable to upload file. Please try again.',
    network: 'Network error. Check your connection and try again.',
    unauthorized: 'Your session has expired. Please sign in again.',
    forbidden: 'You do not have permission to perform this action.',
    notFound: 'The requested item could not be found.',
    validation: 'Please check the form and fix the highlighted fields.',
    bookingRequired:
      'Patient and booking details are required before uploading documents.',
    messagingFailed: 'Unable to send message. Please try again.',
  },

  success: {
    saved: 'Changes saved successfully.',
    deleted: 'Item deleted successfully.',
    uploaded: 'File uploaded successfully.',
    smsSent: 'SMS sent successfully.',
    emailSent: 'Email sent successfully.',
    bannerSaved: 'Banner saved successfully.',
    bannerDeleted: 'Banner deleted successfully.',
    bannerPublished: 'Banner published live across the app.',
  },

  confirm: {
    cancel: 'Cancel',
    confirm: 'Confirm',
    delete: 'Delete',
    logout: 'Log Out',
    logoutTitle: 'Log Out',
    logoutMessage: 'Are you sure you want to log out of your account?',
    deleteTitle: 'Delete Item',
    deleteMessage: (item?: string) =>
      item
        ? `Are you sure you want to delete ${item}? This action cannot be undone.`
        : 'Are you sure you want to delete this item? This action cannot be undone.',
    cancelAppointmentTitle: 'Cancel Appointment',
    cancelAppointmentMessage:
      'Are you sure you want to cancel this appointment? This action cannot be undone.',
    deleteBannerTitle: 'Delete Banner',
    deleteBannerMessage:
      'Are you sure you want to delete this banner? This action cannot be undone.',
    uploadTitle: 'Upload Documents',
    uploadMessage: (count: number) =>
      count === 1
        ? 'Upload 1 document to the patient record?'
        : `Upload ${count} documents to the patient record?`,
    removeFileTitle: 'Remove File',
    removeFileMessage: 'Remove this file from the upload list?',
    sendSmsTitle: 'Send SMS',
    sendSmsMessage: 'Send this SMS to the selected recipient?',
    sendEmailTitle: 'Send Email',
    sendEmailMessage: 'Send this email to the selected recipient?',
  },
} as const;

export function resolveErrorMessage(error: unknown, fallback: string = UI_MESSAGES.error.default): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return UI_MESSAGES.error.unauthorized;
    if (error.status === 403) return UI_MESSAGES.error.forbidden;
    if (error.status === 404) return UI_MESSAGES.error.notFound;
    if (error.message?.trim()) return error.message;
  }

  if (error instanceof Error && error.message?.trim()) {
    if (/failed to fetch|network/i.test(error.message)) {
      return UI_MESSAGES.error.network;
    }
    return error.message;
  }

  return fallback;
}
