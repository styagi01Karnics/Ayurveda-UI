import { z } from 'zod';

export const profileSchema = z.object({
  clinicName: z.string().min(2, 'Clinic name is required'),
  clinicType: z.string().min(1, 'Clinic type is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  pinCode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
  addressLine1: z.string().min(3, 'Address is required'),
  addressLine2: z.string().optional(),
  registrationNumber: z.string().min(1, 'Registration number is required'),
  fullName: z.string().min(2, 'Full name is required'),
  specialization: z.string().min(1, 'Specialization is required'),
  email: z.string().email('Enter a valid email'),
  mobileNumber: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  availability: z.string().min(1, 'Availability is required'),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
