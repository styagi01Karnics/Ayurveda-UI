import { z } from 'zod';

const imageFileSchema = z
  .instanceof(File)
  .refine(
    (file) =>
      ['image/svg+xml', 'image/png', 'image/jpeg', 'image/gif'].includes(
        file.type,
      ),
    'Logo must be SVG, PNG, JPG or GIF',
  )
  .refine((file) => file.size <= 5 * 1024 * 1024, 'File must be under 5MB')
  .optional();

export const signupSchema = z
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
    registrationNumber: z
      .string()
      .min(1, 'Registration number or GST is required'),
    logo: imageFileSchema,
    fullName: z.string().min(1, 'Full name is required'),
    mobileNumber: z
      .string()
      .min(1, 'Mobile number is required')
      .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    userId: z
      .string()
      .min(1, 'User ID is required')
      .min(4, 'User ID must be at least 4 characters'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must include upper, lower case and a number',
      ),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
    photo: imageFileSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Delhi',
  'Gujarat',
  'Karnataka',
  'Maharashtra',
  'Rajasthan',
  'Tamil Nadu',
  'Uttar Pradesh',
  'West Bengal',
] as const;

export const CITIES_BY_STATE: Record<string, string[]> = {
  Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
  Karnataka: ['Bengaluru', 'Mysuru', 'Hubli'],
  Delhi: ['New Delhi', 'South Delhi'],
  Gujarat: ['Ahmedabad', 'Surat', 'Vadodara'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Noida'],
  Rajasthan: ['Jaipur', 'Udaipur', 'Jodhpur'],
  'West Bengal': ['Kolkata', 'Siliguri', 'Howrah'],
  'Andhra Pradesh': ['Hyderabad', 'Visakhapatnam', 'Vijayawada'],
};

export const CLINIC_TYPES = [
  'Ayurvedic Clinic',
  'Wellness Center',
  'Hospital',
  'Panchakarma Center',
] as const;
