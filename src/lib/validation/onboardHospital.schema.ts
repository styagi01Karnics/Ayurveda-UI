import { z } from 'zod';

export const PLATFORM_CLINIC_TYPES = [
  { value: 'CLINIC', label: 'Clinic' },
  { value: 'HOSPITAL', label: 'Hospital' },
  { value: 'WELLNESS', label: 'Wellness Center' },
  { value: 'PANCHAKARMA', label: 'Panchakarma Center' },
] as const;

export const onboardHospitalSchema = z
  .object({
    clinicName: z.string().min(1, 'Clinic name is required'),
    clinicType: z.string().min(1, 'Clinic type is required'),
    state: z.string().min(1, 'State is required'),
    city: z.string().min(1, 'City is required'),
    pinCode: z
      .string()
      .min(1, 'PIN code is required')
      .regex(/^\d{6}$/, 'PIN code must be 6 digits'),
    addressLine1: z.string().min(1, 'Address line 1 is required'),
    addressLine2: z.string().optional(),
    logoUrl: z
      .string()
      .optional()
      .refine(
        (value) =>
          !value?.trim() ||
          /^https?:\/\//i.test(value.trim()) ||
          value.trim().startsWith('data:image/'),
        'Enter a valid image URL',
      ),
    fullName: z.string().min(1, 'Admin full name is required'),
    mobileNumber: z
      .string()
      .min(1, 'Mobile number is required')
      .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type OnboardHospitalFormValues = z.infer<typeof onboardHospitalSchema>;

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () =>
      reject(reader.error ?? new Error('Could not read file'));
    reader.readAsDataURL(file);
  });
}
