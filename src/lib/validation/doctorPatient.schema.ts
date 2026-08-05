import { z } from 'zod';
import { patientStep1FullSchema } from './patient.schema';

export const doctorPersonalTabSchema = patientStep1FullSchema;

export const doctorMedicalTabSchema = z.object({
  doshaType: z.string().min(1, 'Dosha type is required'),
  bodyConstitution: z
    .array(z.string())
    .min(1, 'Select at least one body constitution'),
  currentImbalance: z.string().optional(),
  previousPanchakarma: z.string().optional(),
  weight: z.string().optional(),
  height: z.string().optional(),
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
  presentConditions: z.string().optional(),
  pastConditions: z.string().optional(),
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

export const doctorTreatmentTabSchema = z.object({
  treatmentPlanName: z.string().min(1, 'Treatment plan name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  totalSessions: z.string().min(1, 'Total sessions is required'),
  completedSessions: z.string().min(1, 'Completed sessions is required'),
  remainingSessions: z.string().min(1, 'Remaining sessions is required'),
  assignedTherapist: z.string().min(1, 'Assigned therapist is required'),
  setupRequired: z.string().min(1, 'Setup required is required'),
  followUpScheduling: z.string().min(1, 'Follow-up scheduling is required'),
  assignedDoctor: z.string().min(1, 'Assigned doctor is required'),
  autoSmsReminder: z.boolean(),
});

export const doctorBillingTabSchema = z.object({
  packageName: z.string().min(1, 'Package name is required'),
  validity: z.string().min(1, 'Validity is required'),
  membershipStatus: z.string().min(1, 'Status is required'),
  discountApplied: z.string().min(1, 'Discount applied is required'),
  registrationFees: z.string().optional(),
  paymentMode: z.string().optional(),
  partialPayment: z.string().optional(),
  outstandingAmount: z.string().optional(),
  serviceType: z.string().min(1, 'Service type is required'),
  serviceFees: z.string().min(1, 'Service fees is required'),
  packageType: z.string().min(1, 'Package type is required'),
  packageCharges: z.string().min(1, 'Package charges is required'),
  discount: z.string().min(1, 'Discount is required'),
  applyTax: z.boolean(),
  cgst: z.string().optional(),
  sgst: z.string().optional(),
});

export const doctorPrescriptionSchema = z.object({
  diagnosis: z.string().min(1, 'Diagnosis is required'),
  medicines: z.string().min(1, 'Medicines are required'),
  dosageInstructions: z.string().min(1, 'Dosage instructions are required'),
  duration: z.string().min(1, 'Duration is required'),
  followUpDate: z.string().min(1, 'Follow-up date is required'),
  notes: z.string().optional(),
});

export type DoctorPersonalTabValues = z.infer<typeof doctorPersonalTabSchema>;
export type DoctorMedicalTabValues = z.infer<typeof doctorMedicalTabSchema>;
export type DoctorTreatmentTabValues = z.infer<typeof doctorTreatmentTabSchema>;
export type DoctorBillingTabValues = z.infer<typeof doctorBillingTabSchema>;
export type DoctorPrescriptionValues = z.infer<typeof doctorPrescriptionSchema>;

export const TREATMENT_PLAN_OPTIONS = [
  'Joint Pain Package',
  'Stress Relief Package',
  'Detox Package',
] as const;

export const SESSION_OPTIONS = ['1', '5', '10', '12', '23', '30'] as const;
export const PAYMENT_MODE_OPTIONS = ['Cash', 'Debit Card', 'UPI', 'Credit Card'] as const;
export const PACKAGE_TYPE_OPTIONS = ['Monthly', 'Quarterly', 'Annual'] as const;
export const MEMBERSHIP_STATUS_OPTIONS = ['Completed', 'Active', 'Pending'] as const;
export const YES_NO_OPTIONS = ['Yes', 'No'] as const;
export const FOLLOW_UP_OPTIONS = ['Weekly', 'Bi-weekly', 'Monthly'] as const;
