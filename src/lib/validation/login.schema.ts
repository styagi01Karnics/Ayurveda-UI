import { z } from 'zod';

const credentials = {
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
};

export const loginSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('superAdmin'),
    tenantCode: z.string().optional(),
    locationId: z.string().optional(),
    ...credentials,
  }),
  z.object({
    mode: z.literal('all'),
    tenantCode: z
      .string()
      .min(1, 'Hospital / tenant code is required')
      .transform((value) => value.trim()),
    locationId: z.string().min(1, 'Location is required'),
    ...credentials,
  }),
]);

export type LoginFormValues = z.infer<typeof loginSchema>;
export type LoginMode = LoginFormValues['mode'];
