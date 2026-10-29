import { z } from 'zod';

export const bootstrapSuperAdminSchema = z
  .object({
    fullName: z.string().min(1, 'Full name is required').min(2, 'Enter a valid name'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type BootstrapSuperAdminFormValues = z.infer<
  typeof bootstrapSuperAdminSchema
>;
