import { describe, expect, it } from 'vitest';
import {
  addUserSchema,
  clinicDoctorSchema,
  clinicTherapistSchema,
  clinicTherapySchema,
  roleSchema,
} from '@/lib/validation/settings.schema';

describe('settings.schema', () => {
  it('validates clinic doctor form', () => {
    const result = clinicDoctorSchema.safeParse({
      name: 'Dr. Shweta Arya',
      specialization: 'BAMS',
      status: 'Active',
      consultationFees: '500',
      followUpFees: '500',
      availabilityDays: ['weekdays'],
      availabilityStartTime: '09:00',
      availabilityEndTime: '17:00',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid clinic doctor fees', () => {
    const result = clinicDoctorSchema.safeParse({
      name: 'Dr. Test',
      specialization: 'BAMS',
      status: 'Active',
      consultationFees: 'abc',
      followUpFees: '500',
      availabilityDays: ['weekdays'],
      availabilityStartTime: '09:00',
      availabilityEndTime: '17:00',
    });
    expect(result.success).toBe(false);
  });

  it('validates clinic therapy form', () => {
    const result = clinicTherapySchema.safeParse({
      name: 'Panchakarma',
      category: 'Category',
      duration: '45 min.',
      price: '500',
      description: 'Detox therapy',
    });
    expect(result.success).toBe(true);
  });

  it('requires at least one therapy for therapist', () => {
    const result = clinicTherapistSchema.safeParse({
      name: 'Dr. Narendra Jain',
      status: 'Active',
      assignedTherapies: [],
    });
    expect(result.success).toBe(false);
  });

  it('validates add user with matching passwords', () => {
    const result = addUserSchema.safeParse({
      userId: 'GN001',
      fullName: 'Test User',
      contactNumber: '9876543210',
      email: 'test@example.com',
      password: 'Password1',
      confirmPassword: 'Password1',
      role: 'Admin',
    });
    expect(result.success).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    const result = addUserSchema.safeParse({
      userId: 'GN001',
      fullName: 'Test User',
      contactNumber: '9876543210',
      email: 'test@example.com',
      password: 'Password1',
      confirmPassword: 'Password2',
      role: 'Admin',
    });
    expect(result.success).toBe(false);
  });

  it('validates role with permissions', () => {
    const result = roleSchema.safeParse({
      name: 'Super Admin',
      status: 'Active',
      accessLevel: 'Full Access',
      permissions: ['Dashboard', 'Patients'],
    });
    expect(result.success).toBe(true);
  });
});
