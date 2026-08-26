import { z } from 'zod';
import { optionalBookingTimeSchema } from '@/lib/bookingConstraints';

/** Doctor edit — core demographics required; contact & ID fields optional. */
export const doctorPersonalTabSchema = z.object({
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
  email: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value?.trim() || z.string().email().safeParse(value.trim()).success,
      'Enter a valid email',
    ),
  state: z.string().optional(),
  city: z.string().optional(),
  permanentAddress: z.string().optional(),
  emergencyName: z.string().optional(),
  emergencyRelation: z.string().optional(),
  emergencyPhone: z
    .string()
    .optional()
    .refine(
      (value) => !value?.trim() || /^[6-9]\d{9}$/.test(value.trim()),
      'Enter a valid 10-digit phone number',
    ),
  patientId: z.string().optional(),
  idProofType: z.string().optional(),
  idNumber: z.string().optional(),
  occupation: z.string().optional(),
  insuranceDetails: z.string().optional(),
});

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
  pastConditions: z.array(z.string()).optional(),
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
    followUpScheduling: z.string().optional(),
    assignedDoctor: z.string().optional(),
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
    if (data.setupRequired === 'Yes') {
      if (!data.followUpScheduling?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Follow-up scheduling is required',
          path: ['followUpScheduling'],
        });
      }
      if (!data.assignedDoctor?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Assigned doctor is required',
          path: ['assignedDoctor'],
        });
      }
    }
  });

export const doctorBillingTabSchema = z.object({
  packageMasterId: z.string().optional(),
  validity: z.string().optional(),
  membershipStatus: z.string().optional(),
  discountApplied: z.string().optional(),
  registrationFees: z.string().optional(),
  paymentMode: z.string().optional(),
  partialPayment: z.string().optional(),
  outstandingAmount: z.string().optional(),
  billingServices: z
    .array(
      z.object({
        serviceType: z.string().min(1, 'Service type is required'),
        serviceFees: z.string().min(1, 'Service fees is required'),
        packageMasterId: z.string().optional(),
        packageType: z.string().optional(),
        packageCharges: z.string().optional(),
      }),
    )
    .min(1, 'Add at least one service'),
}).superRefine((data, ctx) => {
  if (data.packageMasterId?.trim()) {
    if (!data.validity?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Validity is required when a package is selected',
        path: ['validity'],
      });
    }
    if (!data.membershipStatus?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Status is required when a package is selected',
        path: ['membershipStatus'],
      });
    }
    if (
      data.discountApplied?.trim() &&
      !/^\d+(?:\.\d{1,2})?$/.test(data.discountApplied.trim())
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a valid discount amount',
        path: ['discountApplied'],
      });
    }
  }

  data.billingServices.forEach((row, index) => {
    // packageMasterId alone is enough — backend can fill name/price from mst_package
    if (
      row.packageType?.trim() &&
      !row.packageMasterId?.trim() &&
      !row.packageCharges?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Package charges is required when a package is selected',
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
  });
});

export const doctorPrescriptionSchema = z
  .object({
    diagnosis: z.string().optional(),
    notes: z.string().optional(),
    medicines: z.array(
      z.object({
        medicineId: z.string().optional(),
        dosage: z.string().optional(),
        frequency: z.string().optional(),
        duration: z.string().optional(),
        notes: z.string().optional(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    const medicines = data.medicines.filter((row) => row.medicineId?.trim());

    if (medicines.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Add at least one medicine',
        path: ['medicines'],
      });
    }

    data.medicines.forEach((row, index) => {
      if (!row.medicineId?.trim()) return;
      if (!row.dosage?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Dosage is required',
          path: ['medicines', index, 'dosage'],
        });
      }
      if (!row.frequency?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Frequency is required',
          path: ['medicines', index, 'frequency'],
        });
      }
      if (!row.duration?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Duration is required',
          path: ['medicines', index, 'duration'],
        });
      }
    });
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
export const FOLLOW_UP_OPTIONS = [
  { value: '7_DAYS', label: '7 days' },
  { value: '14_DAYS', label: '14 days' },
  { value: '30_DAYS', label: '30 days' },
] as const;
export const PRESCRIPTION_SCHEDULING_OPTIONS = [
  { value: '7_DAYS', label: '7 days' },
  { value: '14_DAYS', label: '14 days' },
  { value: '30_DAYS', label: '30 days' },
] as const;
