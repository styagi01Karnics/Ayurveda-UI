import { describe, expect, it } from 'vitest';
import { formatCurrency, formatNumber, formatPersonName } from '@/lib/utils';

describe('formatCurrency', () => {
  it('formats INR amounts', () => {
    expect(formatCurrency(450492)).toBe('₹4,50,492');
  });
});

describe('formatNumber', () => {
  it('formats numbers with locale separators', () => {
    expect(formatNumber(1000)).toBe('1,000');
  });
});

describe('formatPersonName', () => {
  it('title-cases each word', () => {
    expect(formatPersonName('rashee jain')).toBe('Rashee Jain');
    expect(formatPersonName('RASHEE JAIN')).toBe('Rashee Jain');
    expect(formatPersonName('dr. aarav mehta')).toBe('Dr. Aarav Mehta');
  });

  it('preserves empty and dash placeholders', () => {
    expect(formatPersonName('')).toBe('');
    expect(formatPersonName('—')).toBe('—');
    expect(formatPersonName(null)).toBe('');
  });
});
