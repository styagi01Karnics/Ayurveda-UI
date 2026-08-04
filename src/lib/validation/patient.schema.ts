import { z } from 'zod';

export const patientStep1Schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  gender: z.string().min(1, 'Gender is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  age: z.string().min(1, 'Age is required').regex(/^\d+$/, 'Age must be a number'),
  preferredLanguage: z.string().min(1, 'Preferred language is required'),
  consultationTypes: z
    .array(z.string())
    .min(1, 'Select at least one consultation type'),
  registrationDate: z.string().min(1, 'Registration date is required'),
  appointmentTime: z.string().min(1, 'Appointment time is required'),
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
  /** Optional — backend generates patientCode on create. */
  patientId: z.string().optional(),
  idProofType: z.string().min(1, 'ID proof type is required'),
  idNumber: z.string().min(1, 'ID number is required'),
  occupation: z.string().min(1, 'Occupation is required'),
  insuranceDetails: z.string().optional(),
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

/** Optional therapy fields — required only when consultation type includes Therapy. */
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
  currentImbalance: z.string().min(1, 'Current imbalance is required'),
  height: z.string().min(1, 'Height is required'),
  weight: z.string().min(1, 'Weight is required'),
  bmi: z.string().min(1, 'BMI is required'),
  ibw: z.string().optional(),
  pulse: z.string().min(1, 'Pulse is required'),
  bp: z.string().min(1, 'BP is required'),
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

export const createPatientSchema = patientStep1Schema
  .merge(patientStep2OptionalSchema)
  .merge(patientStep3Schema);

export type PatientStep1Values = z.infer<typeof patientStep1Schema>;
export type PatientStep2Values = z.infer<typeof patientStep2Schema>;
export type PatientStep3Values = z.infer<typeof patientStep3Schema>;
export type CreatePatientValues = z.infer<typeof createPatientSchema> & {
  uploadedDocuments?: {
    pastMedicalReports: File[];
    prescriptions: File[];
    labReports: File[];
  };
};

export function includesTherapyType(types: string[]): boolean {
  return types.some((type) => type.toUpperCase().includes('THERAPY'));
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

export const GENDER_OPTIONS = ['Male', 'Female', 'Other'] as const;
export const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Marathi', 'Gujarati'] as const;
export const CONSULTATION_TYPES = ['Consultation', 'Therapy'] as const;
export const ID_PROOF_TYPES = ['Aadhaar', 'PAN', 'Passport', 'Driving License'] as const;
export const RELATION_OPTIONS = ['Spouse', 'Parent', 'Sibling', 'Friend', 'Other'] as const;
export const OCCUPATION_OPTIONS = ['Employed', 'Self-employed', 'Student', 'Retired', 'Other'] as const;
export const TREATMENT_CATEGORIES = ['Panchakarma', 'Abhyanga', 'Shirodhara', 'Consultation'] as const;
export const THERAPY_OPTIONS = ['Therapy 1', 'Therapy 2', 'Therapy 3'] as const;
export const THERAPIST_OPTIONS = ['Dr. Sheekha', 'Dr. Sharma', 'Dr. Gupta'] as const;
export const DOSHA_OPTIONS = ['Vata', 'Pitta', 'Kapha'] as const;
export const CONSTITUTION_OPTIONS = ['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha'] as const;
