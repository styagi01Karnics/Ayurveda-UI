import { z } from 'zod';

/** Step 1 — booking flow: only core fields required on first screen. */
export const patientStep1BookingSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  gender: z.string().min(1, 'Gender is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  mobileNumber: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  consultationTypes: z
    .array(z.string())
    .min(1, 'Select at least one consultation type'),
  age: z.string().optional(),
  preferredLanguage: z.string().optional(),
  registrationDate: z.string().optional(),
  appointmentTime: z.string().optional(),
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
  consultationTypes: z
    .array(z.string())
    .min(1, 'Select at least one consultation type'),
  registrationDate: z.string().min(1, 'Registration date is required'),
  appointmentTime: z.string().optional(),
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
  scheduleDate: z.string().min(1, 'Schedule date is required'),
  scheduleTime: z.string().min(1, 'Schedule time is required'),
  sessionDuration: z
    .string()
    .min(1, 'Session duration is required')
    .regex(/^\d+/, 'Enter duration in minutes (e.g. 45)'),
  sessionFrequency: z
    .string()
    .min(1, 'Session frequency is required')
    .regex(/^\d+/, 'Enter number of sessions (e.g. 7)'),
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
  sessionFrequency: z.string().optional().default(''),
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
  pastMedicalConditions: z.string().optional(),
  pastSurgeries: z.string().optional(),
  currentMedications: z.string().optional(),
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

export function includesTherapyType(types: string[]): boolean {
  return types.some((type) => type.toUpperCase().includes('THERAPY'));
}

export function includesConsultationType(types: string[]): boolean {
  return types.some((type) => type.toUpperCase().includes('CONSULTATION'));
}

export function includesCategoryType(types: string[]): boolean {
  return types.some((type) => type.toUpperCase().includes('CATEGORY'));
}

/** Dynamic progress steps from selected consultation types. */
export function buildBookingSteps(types: string[]): BookingStep[] {
  const steps: BookingStep[] = [
    { key: 'personal', label: 'Personal Information' },
  ];
  if (includesCategoryType(types)) {
    steps.push({ key: 'category', label: 'Category Details' });
  }
  if (includesTherapyType(types)) {
    steps.push({ key: 'therapy', label: 'Therapy Details' });
  }
  if (includesConsultationType(types)) {
    steps.push({ key: 'medical', label: 'Medical Assessment' });
  }
  return steps;
}

export function wantsMedicalAssessment(types: string[]): boolean {
  return includesConsultationType(types);
}

export const followUpSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  fullName: z.string().min(1, 'Full name is required'),
  contactNumber: z
    .string()
    .min(1, 'Contact number is required')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit contact number'),
  visitType: z.string().min(1, 'Visit type is required'),
  doctor: z.string().min(1, 'Doctor is required'),
  scheduleDate: z.string().min(1, 'Schedule date is required'),
  scheduleTime: z.string().min(1, 'Schedule time is required'),
});

export type FollowUpFormValues = z.infer<typeof followUpSchema>;

export const rescheduleAppointmentSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  registrationDate: z.string().min(1, 'Registration date is required'),
  slotTime: z.string().min(1, 'Appointment time is required'),
  assignedDoctorId: z.string().min(1, 'Assigned doctor is required'),
  consultationTypes: z
    .array(z.string())
    .min(1, 'Select at least one consultation type'),
});

export type RescheduleAppointmentFormValues = z.infer<
  typeof rescheduleAppointmentSchema
>;

export const GENDER_OPTIONS = ['Male', 'Female', 'Other'] as const;
export const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Marathi', 'Gujarati'] as const;
export const CONSULTATION_TYPES = ['Consultation', 'Therapy', 'Category'] as const;
export const ID_PROOF_TYPES = ['Aadhaar', 'PAN', 'Passport', 'Driving License'] as const;
export const RELATION_OPTIONS = ['Spouse', 'Parent', 'Sibling', 'Friend', 'Other'] as const;
export const OCCUPATION_OPTIONS = ['Employed', 'Self-employed', 'Student', 'Retired', 'Other'] as const;
export const TREATMENT_CATEGORIES = ['Panchakarma', 'Abhyanga', 'Shirodhara', 'Consultation'] as const;
export const THERAPY_OPTIONS = ['Therapy 1', 'Therapy 2', 'Therapy 3'] as const;
export const THERAPIST_OPTIONS = ['Dr. Sheekha', 'Dr. Sharma', 'Dr. Gupta'] as const;
export const DOSHA_OPTIONS = ['Vata', 'Pitta', 'Kapha'] as const;
export const CONSTITUTION_OPTIONS = ['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha'] as const;
