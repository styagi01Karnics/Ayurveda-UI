import { describe, expect, it } from 'vitest';
import { formatCurrency, formatNumber } from '@/lib/utils';

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
