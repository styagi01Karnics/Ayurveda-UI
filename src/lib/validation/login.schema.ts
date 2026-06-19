import { z } from 'zod';

export const loginSchema = z.object({
  emailOrUsername: z
    .string()
    .min(1, 'Username or email is required')
    .refine(
      (value) =>
        value.includes('@')
          ? z.string().email().safeParse(value).success
          : value.length >= 3,
      'Enter a valid email or username (min 3 characters)',
    ),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
