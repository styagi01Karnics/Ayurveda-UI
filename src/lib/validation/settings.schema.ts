import { z } from 'zod';

export const CLINIC_STATUS_OPTIONS = ['Active', 'Inactive'] as const;

export const USER_ROLE_OPTIONS = [
  'Super Admin',
  'Admin',
  'Doctor',
  'Receptionist',
  'Therapist',
] as const;

export const USER_STATUS_OPTIONS = ['Active', 'Inactive'] as const;

export const THERAPY_CATEGORY_OPTIONS = [
  'Category',
  'Panchakarma',
  'Wellness',
  'Detox',
] as const;

export const PERMISSION_MODULES = [
  'Dashboard',
  'Patients',
  'Doctors',
  'Appointments',
  'Treatments',
  'Medicines',
  'Sales',
  'Activity Log',
  'Billing',
  'Settings',
] as const;

export const clinicDoctorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  status: z.enum(CLINIC_STATUS_OPTIONS),
  consultationFees: z
    .string()
    .min(1, 'Consultation fees are required')
    .regex(/^\d+$/, 'Enter a valid amount'),
  followUpFees: z
    .string()
    .min(1, 'Follow up fees are required')
    .regex(/^\d+$/, 'Enter a valid amount'),
  availability: z.string().min(1, 'Availability is required'),
});

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

export const addUserSchema = z
  .object({
    userId: z.string().min(1, 'User ID is required'),
    fullName: z.string().min(1, 'Full name is required'),
    contactNumber: z
      .string()
      .min(1, 'Contact number is required')
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
