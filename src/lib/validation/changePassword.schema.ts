import { z } from 'zod';

const passwordRules = z
  .string()
  .min(8, 'Must contain at least 8 characters')
  .regex(/[A-Z]/, 'Must contain 1 upper case character')
  .regex(/[a-z]/, 'Must contain 1 lower case character')
  .regex(/[^A-Za-z0-9]/, 'Must contain 1 special character');

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordRules,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const passwordRequirements = [
  'Contain at least 8 characters',
  '1 special character',
  '1 upper case character',
  '1 lower case character',
] as const;
