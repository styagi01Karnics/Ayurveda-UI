import { z } from 'zod';
import {
  ALL_PAGE_CODES,
  PAGE_CODE_LABELS,
  type PageCode,
} from '@/lib/pagePermissions';

export const CLINIC_STATUS_OPTIONS = ['Active', 'Inactive'] as const;

/** API UserRole enums for register-user (excludes SUPER_ADMIN). */
export const USER_ROLE_API_VALUES = [
  'ADMIN',
  'MANAGER',
  'RECEPTIONIST',
  'DIETICIAN',
  'DOCTOR',
  'CHEMIST',
] as const;

export type UserRoleApiValue = (typeof USER_ROLE_API_VALUES)[number];

export const USER_ROLE_OPTIONS: { value: UserRoleApiValue; label: string }[] = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'MANAGER', label: 'Manager' },
  { value: 'RECEPTIONIST', label: 'Receptionist' },
  { value: 'DIETICIAN', label: 'Dietician' },
  { value: 'DOCTOR', label: 'Doctor' },
  { value: 'CHEMIST', label: 'Chemist' },
];

export const USER_STATUS_OPTIONS = ['Active', 'Inactive'] as const;

export const THERAPY_CATEGORY_OPTIONS = [
  'Category',
  'Panchakarma',
  'Wellness',
  'Detox',
] as const;

/** Page permission codes (DASHBOARD, PATIENTS, …) — not display labels. */
export const PERMISSION_MODULES: readonly PageCode[] = ALL_PAGE_CODES;

export { PAGE_CODE_LABELS };

export const clinicDoctorSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    specialization: z.string().min(1, 'Specialization is required'),
    qualification: z.string().optional(),
    mobileNumber: z
      .string()
      .optional()
      .refine(
        (value) => !value || /^\d{10}$/.test(value),
        'Enter a valid 10-digit mobile number',
      ),
    status: z.enum(CLINIC_STATUS_OPTIONS),
    consultationFees: z
      .string()
      .min(1, 'Consultation fees are required')
      .regex(/^\d+$/, 'Enter a valid amount'),
    followUpFees: z
      .string()
      .min(1, 'Follow up fees are required')
      .regex(/^\d+$/, 'Enter a valid amount'),
    availabilityDays: z
      .array(z.enum(['weekdays', 'saturday', 'sunday']))
      .min(1, 'Select at least one day'),
    availabilityStartTime: z.string().min(1, 'Start time is required'),
    availabilityEndTime: z.string().min(1, 'End time is required'),
  })
  .refine(
    (data) => data.availabilityStartTime < data.availabilityEndTime,
    {
      message: 'End time must be after start time',
      path: ['availabilityEndTime'],
    },
  );

export type ClinicDoctorFormValues = z.infer<typeof clinicDoctorSchema>;

export const clinicCategorySchema = z.object({
  categoryName: z.string().min(1, 'Category name is required'),
  description: z.string().min(1, 'Description is required'),
});

export type ClinicCategoryFormValues = z.infer<typeof clinicCategorySchema>;

export const clinicTherapySchema = z.object({
  name: z.string().min(1, 'Therapy name is required'),
  category: z.string().min(1, 'Category is required'),
  duration: z
    .string()
    .min(1, 'Duration is required')
    .regex(/\d+/, 'Enter duration in minutes'),
  price: z
    .string()
    .min(1, 'Price is required')
    .regex(/^\d+$/, 'Enter a valid price'),
  description: z.string().min(1, 'Description is required'),
});

export type ClinicTherapyFormValues = z.infer<typeof clinicTherapySchema>;

export const clinicTherapistSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  status: z.enum(CLINIC_STATUS_OPTIONS),
  assignedTherapyIds: z
    .array(z.string())
    .min(1, 'Select at least one therapy'),
});

export type ClinicTherapistFormValues = z.infer<typeof clinicTherapistSchema>;

export const clinicConsultationTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export type ClinicConsultationTypeFormValues = z.infer<
  typeof clinicConsultationTypeSchema
>;

export const clinicTreatmentPlanMasterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export type ClinicTreatmentPlanMasterFormValues = z.infer<
  typeof clinicTreatmentPlanMasterSchema
>;

export const clinicPackageMasterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  packagePrice: z
    .string()
    .min(1, 'Price is required')
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid price'),
});

export type ClinicPackageMasterFormValues = z.infer<
  typeof clinicPackageMasterSchema
>;

export const clinicDoshaSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  elements: z.string().min(1, 'Elements are required'),
  characteristics: z.string().min(1, 'Characteristics are required'),
});

export type ClinicDoshaFormValues = z.infer<typeof clinicDoshaSchema>;

export const addUserSchema = z
  .object({
    tenantRoleId: z.string().min(1, 'Tenant role is required'),
    fullName: z.string().min(1, 'Full name is required'),
    mobileNumber: z
      .string()
      .min(1, 'Mobile number is required')
      .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must include upper, lower case and a number',
      ),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
    role: z.string().min(1, 'Role is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type AddUserFormValues = z.infer<typeof addUserSchema>;

export const roleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
  status: z.enum(CLINIC_STATUS_OPTIONS),
  accessLevel: z.string().min(1, 'Access level is required'),
  permissions: z.array(z.string()).min(1, 'Select at least one permission'),
});

export type RoleFormValues = z.infer<typeof roleSchema>;
