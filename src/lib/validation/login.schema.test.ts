import { describe, expect, it } from 'vitest';
import { loginSchema } from '@/lib/validation/login.schema';

describe('loginSchema', () => {
  it('accepts hospital login with email and password', () => {
    const result = loginSchema.safeParse({
      mode: 'all',
      tenantCode: 'GAN-DL',
      emailOrUsername: 'admin@ganesha.com',
      password: 'password123',
      locationId: 'delhi-nanaksaar',
    });
    expect(result.success).toBe(true);
  });

  it('accepts super admin login without tenant or location', () => {
    const result = loginSchema.safeParse({
      mode: 'superAdmin',
      emailOrUsername: 'superadmin@gmail.com',
      password: 'SecurePass1',
    });
    expect(result.success).toBe(true);
  });

  it('accepts valid username for hospital login', () => {
    const result = loginSchema.safeParse({
      mode: 'all',
      tenantCode: 'GAN-DL',
      emailOrUsername: 'adminuser',
      password: 'password123',
      locationId: 'delhi-nanaksaar',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email format', () => {
    const result = loginSchema.safeParse({
      mode: 'all',
      tenantCode: 'GAN-DL',
      emailOrUsername: 'not-an-email@',
      password: 'password123',
      locationId: 'delhi-nanaksaar',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = loginSchema.safeParse({
      mode: 'all',
      tenantCode: 'GAN-DL',
      emailOrUsername: 'admin@ganesha.com',
      password: '12345',
      locationId: 'delhi-nanaksaar',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty hospital fields', () => {
    const result = loginSchema.safeParse({
      mode: 'all',
      tenantCode: '',
      emailOrUsername: '',
      password: '',
      locationId: '',
    });
    expect(result.success).toBe(false);
  });

  it('requires location for hospital login', () => {
    const result = loginSchema.safeParse({
      mode: 'all',
      tenantCode: 'GAN-DL',
      emailOrUsername: 'admin@ganesha.com',
      password: 'password123',
      locationId: '',
    });
    expect(result.success).toBe(false);
  });

  it('requires tenant code for hospital login', () => {
    const result = loginSchema.safeParse({
      mode: 'all',
      tenantCode: '',
      emailOrUsername: 'admin@ganesha.com',
      password: 'password123',
      locationId: 'delhi-nanaksaar',
    });
    expect(result.success).toBe(false);
  });
});
