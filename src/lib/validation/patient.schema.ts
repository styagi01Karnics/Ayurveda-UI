import { z } from 'zod';
import {
  DEFAULT_SESSION_FREQUENCY,
  bookingDateNotPastMessage,
  isBookingDateOnOrAfterToday,
  optionalBookingDateSchema,
  optionalBookingTimeSchema,
  requiredBookingDateSchema,
  requiredBookingTimeSchema,
} from '@/lib/bookingConstraints';

/** Step 1 — booking flow: only core fields required on first screen. */
export const patientStep1BookingSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  gender: z.string().min(1, 'Gender is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  mobileNumber: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  consultationTypeIds: z
    .array(z.string())
    .min(1, 'Select at least one consultation type'),
  age: z.string().optional(),
  preferredLanguage: z.string().optional(),
  registrationDate: optionalBookingDateSchema,
  appointmentTime: optionalBookingTimeSchema,
  assignedDoctor: z.string().optional(),
  email: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  permanentAddress: z.string().optional(),
  emergencyName: z.string().optional(),
  emergencyRelation: z.string().optional(),
  emergencyPhone: z.string().optional(),
  patientId: z.string().optional(),
  idProofType: z.string().optional(),
  idNumber: z.string().optional(),
  occupation: z.string().optional(),
  insuranceDetails: z.string().optional(),
});

/** Step 1 — doctor edit: stricter validation. */
export const patientStep1FullSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  gender: z.string().min(1, 'Gender is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  age: z.string().min(1, 'Age is required').regex(/^\d+$/, 'Age must be a number'),
  preferredLanguage: z.string().optional(),
  consultationTypeIds: z
    .array(z.string())
    .min(1, 'Select at least one consultation type'),
  registrationDate: z.string().min(1, 'Registration date is required'),
  appointmentTime: optionalBookingTimeSchema,
  assignedDoctor: z.string().min(1, 'Assigned doctor is required'),
  mobileNumber: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  permanentAddress: z.string().min(1, 'Permanent address is required'),
  emergencyName: z.string().min(1, 'Emergency contact name is required'),
  emergencyRelation: z.string().min(1, 'Relation is required'),
  emergencyPhone: z
    .string()
    .min(1, 'Emergency phone is required')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit phone number'),
  patientId: z.string().optional(),
  idProofType: z.string().min(1, 'ID proof type is required'),
  idNumber: z.string().min(1, 'ID number is required'),
  occupation: z.string().min(1, 'Occupation is required'),
  insuranceDetails: z.string().optional(),
});

/** @deprecated Use patientStep1BookingSchema in booking modal. */
export const patientStep1Schema = patientStep1BookingSchema;

export const patientCategoryStepSchema = z.object({
  treatmentCategory: z.string().min(1, 'Treatment category is required'),
});

export const patientStep2Schema = z.object({
  treatmentCategory: z.string().min(1, 'Treatment category is required'),
  recommendedTherapies: z
    .array(z.string())
    .min(1, 'Select at least one recommended therapy'),
  scheduleDate: requiredBookingDateSchema,
  scheduleTime: requiredBookingTimeSchema,
  sessionDuration: z
    .string()
    .min(1, 'Session duration is required')
    .regex(/^\d+/, 'Enter duration in minutes (e.g. 45)'),
  sessionFrequency: z.literal(DEFAULT_SESSION_FREQUENCY),
  assignedTherapist: z.string().min(1, 'Assigned therapist is required'),
  therapyInstructions: z.string().min(1, 'Therapy instructions are required'),
});

/** Optional therapy fields — used when consultation type excludes therapy. */
export const patientStep2OptionalSchema = z.object({
  treatmentCategory: z.string().optional().default(''),
  recommendedTherapies: z.array(z.string()).optional().default([]),
  scheduleDate: z.string().optional().default(''),
  scheduleTime: z.string().optional().default(''),
  sessionDuration: z.string().optional().default(''),
  sessionFrequency: z.literal(DEFAULT_SESSION_FREQUENCY).default(DEFAULT_SESSION_FREQUENCY),
  assignedTherapist: z.string().optional().default(''),
  therapyInstructions: z.string().optional().default(''),
});

export const patientStep3Schema = z.object({
  doshaType: z.string().min(1, 'Dosha type is required'),
  bodyConstitution: z
    .array(z.string())
    .min(1, 'Select at least one body constitution'),
  currentImbalance: z.string().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  bmi: z.string().optional(),
  ibw: z.string().optional(),
  pulse: z.string().optional(),
  bp: z.string().optional(),
  temperature: z.string().optional(),
  pallor: z.string().optional(),
  icterus: z.string().optional(),
  cyanosis: z.string().optional(),
  lymphNodes: z.string().optional(),
  oedema: z.string().optional(),
  sensorium: z.string().optional(),
  acidityGas: z.string().optional(),
  motion: z.string().optional(),
  micturition: z.string().optional(),
  pastMedicalConditions: z.array(z.string()).optional(),
  pastSurgeries: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),
  allergies: z.array(z.string()).optional(),
  familyHistory: z.string().optional(),
  dietType: z.string().optional(),
  sleepPattern: z.string().optional(),
  exerciseHabits: z.string().optional(),
  addictions: z.string().optional(),
  cardiovascular: z.string().optional(),
  respiratory: z.string().optional(),
  nervous: z.string().optional(),
  abdomenGi: z.string().optional(),
  locomotor: z.string().optional(),
  investigationPlan: z.string().optional(),
  planDetails: z.string().optional(),
});

export const createPatientSchema = patientStep1BookingSchema
  .merge(patientStep2OptionalSchema)
  .merge(patientStep3Schema);

export type PatientStep1Values = z.infer<typeof patientStep1BookingSchema>;
export type PatientCategoryStepValues = z.infer<typeof patientCategoryStepSchema>;
export type PatientStep2Values = z.infer<typeof patientStep2Schema>;
export type PatientStep3Values = z.infer<typeof patientStep3Schema>;
export type CreatePatientValues = z.infer<typeof createPatientSchema> & {
  uploadedDocuments?: {
    pastMedicalReports: File[];
    prescriptions: File[];
    labReports: File[];
  };
};

export type BookingStepKey = 'personal' | 'category' | 'therapy' | 'medical';

export interface BookingStep {
  key: BookingStepKey;
  label: string;
}

export type ConsultationTypeMasterOption = { id: string; name: string };

function masterNameById(
  id: string,
  masters: ConsultationTypeMasterOption[],
): string {
  return masters.find((m) => m.id === id)?.name ?? '';
}

export function includesTherapyTypeIds(
  ids: string[],
  masters: ConsultationTypeMasterOption[] = [],
): boolean {
  return ids.some((id) =>
    masterNameById(id, masters).toUpperCase().includes('THERAPY'),
  );
}

export function includesConsultationTypeIds(
  ids: string[],
  masters: ConsultationTypeMasterOption[] = [],
): boolean {
  return ids.some((id) =>
    masterNameById(id, masters).toUpperCase().includes('CONSULTATION'),
  );
}

export function includesCategoryTypeIds(
  ids: string[],
  masters: ConsultationTypeMasterOption[] = [],
): boolean {
  return ids.some((id) =>
    masterNameById(id, masters).toUpperCase().includes('CATEGORY'),
  );
}

/** Dynamic progress steps from selected consultation type master IDs. */
export function buildBookingSteps(
  ids: string[],
  masters: ConsultationTypeMasterOption[] = [],
): BookingStep[] {
  const steps: BookingStep[] = [
    { key: 'personal', label: 'Personal Information' },
  ];
  if (includesCategoryTypeIds(ids, masters)) {
    steps.push({ key: 'category', label: 'Category Details' });
  }
  if (includesTherapyTypeIds(ids, masters)) {
    steps.push({ key: 'therapy', label: 'Therapy Details' });
  }
  if (includesConsultationTypeIds(ids, masters)) {
    steps.push({ key: 'medical', label: 'Medical Assessment' });
  }
  return steps;
}

export function wantsMedicalAssessment(
  ids: string[],
  masters: ConsultationTypeMasterOption[] = [],
): boolean {
  return includesConsultationTypeIds(ids, masters);
}

export const followUpSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  assignedDoctorId: z.string().min(1, 'Doctor is required'),
  visitTypeId: z.string().min(1, 'Visit type is required'),
  schedulingOption: z.string().min(1, 'Scheduling option is required'),
  scheduleDate: requiredBookingDateSchema,
  scheduleTime: requiredBookingTimeSchema,
  smsReminderEnabled: z.boolean().optional(),
  sourceBookingId: z.string().optional(),
});

export type FollowUpFormValues = z.infer<typeof followUpSchema>;

export const FOLLOW_UP_SCHEDULING_OPTIONS = [
  { value: '7_DAYS', label: '7 Days' },
  { value: '14_DAYS', label: '14 Days' },
  { value: '30_DAYS', label: '30 Days' },
  { value: 'CUSTOM', label: 'Custom date' },
] as const;

export const bookTreatmentSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  treatmentPlanId: z.string().min(1, 'Treatment plan is required'),
  startDate: requiredBookingDateSchema,
  endDate: z
    .string()
    .min(1, 'End date is required')
    .refine(isBookingDateOnOrAfterToday, {
      message: bookingDateNotPastMessage,
    }),
  totalSessions: z
    .string()
    .min(1, 'Sessions required')
    .refine(
      (value) => /^\d+$/.test(value.trim()) && Number(value) >= 0,
      'Sessions must be a valid number',
    ),
  assignedTherapistId: z.string().min(1, 'Therapist is required'),
  treatmentStatus: z.enum(['SCHEDULED', 'ONGOING', 'COMPLETED']).optional(),
});

export type BookTreatmentFormValues = z.infer<typeof bookTreatmentSchema>;

export const rescheduleAppointmentSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  registrationDate: requiredBookingDateSchema,
  slotTime: requiredBookingTimeSchema,
  assignedDoctorId: z.string().min(1, 'Assigned doctor is required'),
  consultationTypeIds: z
    .array(z.string())
    .min(1, 'Select at least one consultation type'),
});

export type RescheduleAppointmentFormValues = z.infer<
  typeof rescheduleAppointmentSchema
>;

export const GENDER_OPTIONS = ['Male', 'Female', 'Other'] as const;
export const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Marathi', 'Gujarati'] as const;
export const ID_PROOF_TYPES = ['Aadhaar', 'PAN', 'Passport', 'Driving License'] as const;
export const RELATION_OPTIONS = ['Spouse', 'Parent', 'Sibling', 'Friend', 'Other'] as const;
export const OCCUPATION_OPTIONS = ['Employed', 'Self-employed', 'Student', 'Retired', 'Other'] as const;
export const TREATMENT_CATEGORIES = ['Panchakarma', 'Abhyanga', 'Shirodhara', 'Consultation'] as const;
export const THERAPY_OPTIONS = ['Therapy 1', 'Therapy 2', 'Therapy 3'] as const;
export const THERAPIST_OPTIONS = ['Dr. Sheekha', 'Dr. Sharma', 'Dr. Gupta'] as const;
export const DOSHA_OPTIONS = ['Vata', 'Pitta', 'Kapha'] as const;
export const CONSTITUTION_OPTIONS = ['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha'] as const;
