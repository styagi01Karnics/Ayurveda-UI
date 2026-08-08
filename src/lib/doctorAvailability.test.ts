import { describe, expect, it } from 'vitest';
import { formatDoctorAvailability } from '@/lib/doctorAvailability';

describe('formatDoctorAvailability', () => {
  it('formats weekdays only', () => {
    expect(
      formatDoctorAvailability(['weekdays'], '09:00', '17:00'),
    ).toBe('Mon-Fri 9:00 AM-5:00 PM');
  });

  it('formats all day groups', () => {
    expect(
      formatDoctorAvailability(
        ['weekdays', 'saturday', 'sunday'],
        '10:00',
        '13:00',
      ),
    ).toBe(
      'Mon-Fri 10:00 AM-1:00 PM, Sat 10:00 AM-1:00 PM, Sun 10:00 AM-1:00 PM',
    );
  });
});
