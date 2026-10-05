import { describe, expect, it } from 'vitest';
import { loginSchema } from '@/lib/validation/login.schema';

describe('loginSchema', () => {
  it('accepts valid email and password', () => {
    const result = loginSchema.safeParse({
      emailOrUsername: 'admin@ganesha.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('accepts valid username', () => {
    const result = loginSchema.safeParse({
      emailOrUsername: 'adminuser',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email format', () => {
    const result = loginSchema.safeParse({
      emailOrUsername: 'not-an-email@',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = loginSchema.safeParse({
      emailOrUsername: 'admin@ganesha.com',
      password: '12345',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty fields', () => {
    const result = loginSchema.safeParse({
      emailOrUsername: '',
      password: '',
    });
    expect(result.success).toBe(false);
  });

  it('treats blank tenant code as undefined', () => {
    const result = loginSchema.safeParse({
      emailOrUsername: 'admin@ganesha.com',
      password: 'password123',
      tenantCode: '   ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tenantCode).toBeUndefined();
    }
  });

  it('keeps non-empty tenant code as typed', () => {
    const result = loginSchema.safeParse({
      emailOrUsername: 'admin@ganesha.com',
      password: 'password123',
      tenantCode: 'Hosp-1',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tenantCode).toBe('Hosp-1');
    }
  });
});
