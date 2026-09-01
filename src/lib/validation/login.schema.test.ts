import { describe, expect, it } from 'vitest';
import { loginSchema } from '@/lib/validation/login.schema';

describe('loginSchema', () => {
  it('accepts valid email and password', () => {
    const result = loginSchema.safeParse({
      emailOrUsername: 'admin@ganesha.com',
      password: 'password123',
      locationId: 'delhi-nanaksaar',
    });
    expect(result.success).toBe(true);
  });

  it('accepts valid username', () => {
    const result = loginSchema.safeParse({
      emailOrUsername: 'adminuser',
      password: 'password123',
      locationId: 'delhi-nanaksaar',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email format', () => {
    const result = loginSchema.safeParse({
      emailOrUsername: 'not-an-email@',
      password: 'password123',
      locationId: 'delhi-nanaksaar',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = loginSchema.safeParse({
      emailOrUsername: 'admin@ganesha.com',
      password: '12345',
      locationId: 'delhi-nanaksaar',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty fields', () => {
    const result = loginSchema.safeParse({
      emailOrUsername: '',
      password: '',
      locationId: '',
    });
    expect(result.success).toBe(false);
  });

  it('requires location', () => {
    const result = loginSchema.safeParse({
      emailOrUsername: 'admin@ganesha.com',
      password: 'password123',
      locationId: '',
    });
    expect(result.success).toBe(false);
  });
});
