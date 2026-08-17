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

function numericSessionField(label: string) {
  return z
    .string()
    .min(1, `${label} is required`)
    .refine(
      (value) => /^\d+$/.test(value.trim()) && Number(value) >= 0,
      `${label} must be a valid number`,
    );
}

export function computeRemainingSessions(
  totalSessions: string,
  completedSessions: string,
): string {
  if (!totalSessions.trim() || !completedSessions.trim()) return '';
  const total = Number(totalSessions);
  const completed = Number(completedSessions);
  if (!Number.isFinite(total) || !Number.isFinite(completed)) return '';
  return String(Math.max(0, total - completed));
}

export const doctorTreatmentTabSchema = z
  .object({
    treatmentPlanId: z.string().min(1, 'Treatment plan is required'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    totalSessions: numericSessionField('Total sessions'),
    completedSessions: numericSessionField('Completed sessions'),
    remainingSessions: z.string().optional(),
    assignedTherapistId: z.string().min(1, 'Assigned therapist is required'),
    setupRequired: z.string().min(1, 'Setup required is required'),
    followUpScheduling: z.string().min(1, 'Follow-up scheduling is required'),
    assignedDoctor: z.string().min(1, 'Assigned doctor is required'),
    autoSmsReminder: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const total = Number(data.totalSessions);
    const completed = Number(data.completedSessions);
    if (completed > total) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Completed sessions cannot exceed total sessions',
        path: ['completedSessions'],
      });
    }
  });

export const doctorBillingTabSchema = z.object({
  packageMasterId: z.string().min(1, 'Package is required'),
  validity: z.string().min(1, 'Validity is required'),
  membershipStatus: z.string().min(1, 'Status is required'),
  discountApplied: z.string().min(1, 'Discount applied is required'),
  registrationFees: z.string().optional(),
  paymentMode: z.string().optional(),
  partialPayment: z.string().optional(),
  outstandingAmount: z.string().optional(),
  billingServices: z
    .array(
      z.object({
        serviceType: z.string().min(1, 'Service type is required'),
        serviceFees: z.string().min(1, 'Service fees is required'),
        packageType: z.string().optional(),
        packageCharges: z.string().optional(),
        discount: z.string().optional(),
      }),
    )
    .min(1, 'Add at least one service'),
  applyTax: z.boolean(),
  cgst: z.string().optional(),
  sgst: z.string().optional(),
}).superRefine((data, ctx) => {
  data.billingServices.forEach((row, index) => {
    if (row.packageType?.trim() && !row.packageCharges?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Package charges is required when package type is selected',
        path: ['billingServices', index, 'packageCharges'],
      });
    }
    if (row.packageCharges?.trim() && !/^\d+$/.test(row.packageCharges.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a valid amount',
        path: ['billingServices', index, 'packageCharges'],
      });
    }
    if (row.serviceFees?.trim() && !/^\d+$/.test(row.serviceFees.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a valid amount',
        path: ['billingServices', index, 'serviceFees'],
      });
    }
    if (row.discount?.trim() && !/^\d+$/.test(row.discount.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a valid amount',
        path: ['billingServices', index, 'discount'],
      });
    }
  });

  if (data.applyTax) {
    if (!data.cgst?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CGST is required',
        path: ['cgst'],
      });
    }
    if (!data.sgst?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'SGST is required',
        path: ['sgst'],
      });
    }
  }
});

export const doctorPrescriptionSchema = z.object({
  diagnosis: z.string().optional(),
  medicines: z
    .array(
      z.object({
        medicineId: z.string().min(1, 'Medicine is required'),
        dosage: z.string().min(1, 'Dosage is required'),
        frequency: z.string().min(1, 'Frequency is required'),
        duration: z.string().min(1, 'Duration is required'),
        notes: z.string().optional(),
      }),
    )
    .min(1, 'Add at least one medicine'),
  therapies: z.array(
    z.object({
      categoryId: z.string().optional(),
      therapyIds: z.array(z.string()).optional(),
    }),
  ),
  setupRequired: z.string().min(1, 'Set up required is required'),
  followUpScheduling: z.string().min(1, 'Follow-up scheduling is required'),
  suggestions: z.string().optional(),
});

export type DoctorPersonalTabValues = z.infer<typeof doctorPersonalTabSchema>;
export type DoctorMedicalTabValues = z.infer<typeof doctorMedicalTabSchema>;
export type DoctorTreatmentTabValues = z.infer<typeof doctorTreatmentTabSchema>;
export type DoctorBillingTabValues = z.infer<typeof doctorBillingTabSchema>;
export type DoctorPrescriptionValues = z.infer<typeof doctorPrescriptionSchema>;

export const REGISTRATION_FEE_OPTIONS = ['500', '1000', '1500', '2000'] as const;
export const PAYMENT_MODE_OPTIONS = ['Cash', 'Debit Card', 'UPI', 'Credit Card'] as const;
export const PACKAGE_TYPE_OPTIONS = ['Monthly', 'Quarterly', 'Annual'] as const;
export const MEMBERSHIP_STATUS_OPTIONS = ['Completed', 'Active', 'Pending'] as const;
export const YES_NO_OPTIONS = ['Yes', 'No'] as const;
export const FOLLOW_UP_OPTIONS = ['Weekly', 'Bi-weekly', 'Monthly'] as const;
