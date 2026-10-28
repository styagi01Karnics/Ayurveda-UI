import { describe, expect, it } from 'vitest';
import { mapTherapistToClinicRecord } from '@/lib/api/mappers';
import type { TherapyDto } from '@/lib/api/types';

describe('mapTherapistToClinicRecord', () => {
  it('maps assigned therapy names from the API assignedTherapies list', () => {
    const record = mapTherapistToClinicRecord({
      id: 'th-1',
      name: 'Test',
      status: 'ACTIVE',
      assignedTherapies: [
        { id: 't-1', name: 'Abhyanga' },
        { id: 't-2', therapyName: 'Shirodhara' },
      ],
    });

    expect(record.assignedTherapies).toEqual(['Abhyanga', 'Shirodhara']);
  });

  it('falls back to therapy master names when only IDs are returned', () => {
    const therapiesById = new Map<string, TherapyDto>([
      ['t-1', { id: 't-1', name: 'Panchakarma' }],
    ]);

    const record = mapTherapistToClinicRecord(
      {
        id: 'th-2',
        name: 'Test2',
        status: 'ACTIVE',
        assignedTherapyIds: ['t-1'],
      },
      therapiesById,
    );

    expect(record.assignedTherapies).toEqual(['Panchakarma']);
  });
});
