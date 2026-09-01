import { describe, expect, it } from 'vitest';
import {
  calculatePrescriptionMedicineQuantity,
  parseDurationDays,
  parseFrequencyRate,
} from './prescriptionQuantity';

describe('prescriptionQuantity', () => {
  it('parses duration days and weeks', () => {
    expect(parseDurationDays('7 days')).toBe(7);
    expect(parseDurationDays('2 weeks')).toBe(14);
  });

  it('parses frequency rates', () => {
    expect(parseFrequencyRate('Twice daily')).toEqual({
      kind: 'daily',
      times: 2,
    });
    expect(parseFrequencyRate('Twice a week')).toEqual({
      kind: 'weekly',
      times: 2,
    });
  });

  it('calculates quantity from dosage × frequency × duration', () => {
    expect(
      calculatePrescriptionMedicineQuantity({
        dosage: '1 tablet',
        frequency: 'Twice daily',
        duration: '7 days',
      }),
    ).toBe(14);

    expect(
      calculatePrescriptionMedicineQuantity({
        dosage: '2 tablets',
        frequency: 'Once daily',
        duration: '5 days',
      }),
    ).toBe(10);

    expect(
      calculatePrescriptionMedicineQuantity({
        dosage: '1 tablet',
        frequency: 'Twice a week',
        duration: '14 days',
      }),
    ).toBe(4);
  });
});
