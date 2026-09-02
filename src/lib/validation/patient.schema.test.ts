import { describe, expect, it } from 'vitest';
import {
  buildBookingSteps,
  followUpSchema,
  patientStep1BookingSchema,
  patientStep3Schema,
} from '@/lib/validation/patient.schema';

const masters = [
  { id: 'ct-consultation', name: 'CONSULTATION' },
  { id: 'ct-therapy', name: 'THERAPY' },
  { id: 'ct-category', name: 'CATEGORY' },
];

const validStep1 = {
  fullName: 'Khushi Shroff',
  gender: 'Female',
  dateOfBirth: '1995-05-15',
  mobileNumber: '9876543210',
  consultationTypeIds: ['ct-consultation'],
};

describe('patientStep1BookingSchema', () => {
  it('accepts minimal required personal information', () => {
    expect(patientStep1BookingSchema.safeParse(validStep1).success).toBe(true);
  });

  it('rejects missing consultation types', () => {
    const result = patientStep1BookingSchema.safeParse({
      ...validStep1,
      consultationTypeIds: [],
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid mobile number', () => {
    const result = patientStep1BookingSchema.safeParse({
      ...validStep1,
      mobileNumber: '123',
    });
    expect(result.success).toBe(false);
  });
});

describe('buildBookingSteps', () => {
  it('shows therapy steps when therapy is selected', () => {
    expect(
      buildBookingSteps(['ct-therapy'], masters).map((s) => s.key),
    ).toEqual(['personal', 'therapy']);
  });

  it('shows category step when category is selected', () => {
    expect(
      buildBookingSteps(['ct-category'], masters).map((s) => s.key),
    ).toEqual(['personal', 'category']);
  });

  it('shows consultation medical step when consultation is selected', () => {
    expect(
      buildBookingSteps(['ct-consultation'], masters).map((s) => s.key),
    ).toEqual(['personal', 'medical']);
  });

  it('shows category and therapy when both are selected', () => {
    expect(
      buildBookingSteps(['ct-category', 'ct-therapy'], masters).map(
        (s) => s.key,
      ),
    ).toEqual(['personal', 'category', 'therapy']);
  });
});

describe('patientStep3Schema', () => {
  it('requires only dosha type and body constitution', () => {
    const result = patientStep3Schema.safeParse({
      doshaType: '550e8400-e29b-41d4-a716-446655440000',
      bodyConstitution: ['Vata'],
    });
    expect(result.success).toBe(true);
  });
});

describe('followUpSchema', () => {
  it('accepts valid follow up data', () => {
    const result = followUpSchema.safeParse({
      patientId: '37944397',
      assignedDoctorId: 'doc-1',
      visitTypeId: 'ct-consultation',
      schedulingOption: 'AFTER_7_DAYS',
      scheduleDate: '2026-10-20',
      scheduleTime: '10:30',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing doctor', () => {
    const result = followUpSchema.safeParse({
      patientId: '37944397',
      assignedDoctorId: '',
      visitTypeId: 'ct-consultation',
      schedulingOption: 'AFTER_7_DAYS',
      scheduleDate: '2026-10-20',
      scheduleTime: '10:30',
    });
    expect(result.success).toBe(false);
  });
});
