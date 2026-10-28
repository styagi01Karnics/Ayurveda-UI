import { describe, expect, it } from 'vitest';
import { signupSchema } from '@/lib/validation/signup.schema';

const validSignup = {
  clinicName: 'Ganesha Clinic',
  clinicType: 'Ayurvedic Clinic',
  state: 'Maharashtra',
  city: 'Mumbai',
  pinCode: '400001',
  addressLine1: '123 Main Street',
  addressLine2: '',
  registrationNumber: 'GST123456',
  fullName: 'Rahul Sharma',
  mobileNumber: '9876543210',
  email: 'rahul@example.com',
  userId: 'rahul_admin',
  password: 'Password1',
  confirmPassword: 'Password1',
};

describe('signupSchema', () => {
  it('accepts valid signup data', () => {
    const result = signupSchema.safeParse(validSignup);
    expect(result.success).toBe(true);
  });

  it('rejects invalid PIN code', () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      pinCode: '123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid mobile number', () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      mobileNumber: '12345',
    });
    expect(result.success).toBe(false);
  });

  it('rejects mismatched passwords', () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      confirmPassword: 'Different1',
    });
    expect(result.success).toBe(false);
  });

  it('rejects weak password', () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      password: 'password',
      confirmPassword: 'password',
    });
    expect(result.success).toBe(false);
  });
});
