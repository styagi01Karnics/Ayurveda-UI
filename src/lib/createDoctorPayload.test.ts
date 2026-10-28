import { describe, expect, it } from 'vitest';
import { toCreateDoctorPayload } from '@/lib/createDoctorPayload';

describe('toCreateDoctorPayload', () => {
  it('keeps qualification and mobileNumber as strings in the JSON body', () => {
    const payload = toCreateDoctorPayload({
      name: 'Dr. Mehta',
      specialization: 'Panchakarma',
      status: 'ACTIVE',
      consultationFees: 500,
      followUpFees: 300,
      availability: 'Mon-Fri 09:00-17:00',
      mobileNumber: ' 9876543210 ',
      qualification: ' BAMS ',
    });

    expect(payload.mobileNumber).toBe('9876543210');
    expect(payload.qualification).toBe('BAMS');

    const body = JSON.parse(JSON.stringify(payload)) as Record<string, unknown>;
    expect(body.mobileNumber).toBe('9876543210');
    expect(body.qualification).toBe('BAMS');
  });

  it('does not omit blank qualification or mobileNumber as undefined', () => {
    const payload = toCreateDoctorPayload({
      name: 'Dr. Mehta',
      specialization: 'Panchakarma',
      status: 'ACTIVE',
      consultationFees: 500,
      followUpFees: 300,
      availability: 'Mon-Fri 09:00-17:00',
    });

    expect('mobileNumber' in payload).toBe(true);
    expect('qualification' in payload).toBe(true);
    expect(payload.mobileNumber).toBe('');
    expect(payload.qualification).toBe('');
  });
});
