import { describe, expect, it } from 'vitest';
import type { BillingRecord } from '@/types';
import type { PaymentLinkDto } from '@/lib/api/payments';
import { latestPaymentLinkByInvoice } from '@/lib/api/payments';
import { validatePaymentAmount } from './PaymentLinkConfirmModal';
import {
  canSendPaymentLink,
  getPaymentLinkState,
} from './BillingTable';

function record(overrides: Partial<BillingRecord>): BillingRecord {
  return {
    id: 'inv-1',
    kind: 'invoice',
    status: 'Unpaid',
    leftAmount: 500,
    ...overrides,
  } as BillingRecord;
}

function link(overrides: Partial<PaymentLinkDto>): PaymentLinkDto {
  return { id: 'l-1', invoiceId: 'inv-1', status: 'SHARED', ...overrides } as PaymentLinkDto;
}

describe('canSendPaymentLink', () => {
  it('is true for a non-draft invoice with a balance', () => {
    expect(canSendPaymentLink(record({}))).toBe(true);
  });

  it('is false for drafts and zero balances', () => {
    expect(canSendPaymentLink(record({ kind: 'billing-draft' }))).toBe(false);
    expect(canSendPaymentLink(record({ leftAmount: 0 }))).toBe(false);
  });
});

describe('getPaymentLinkState', () => {
  it('returns none without a link', () => {
    expect(getPaymentLinkState(record({}))).toBe('none');
  });

  it('maps SHARED and legacy OPEN to sent', () => {
    expect(getPaymentLinkState(record({}), link({ status: 'SHARED' }))).toBe('sent');
    expect(getPaymentLinkState(record({}), link({ status: 'OPEN' }))).toBe('sent');
  });

  it('maps PAID to paid or partial depending on balance', () => {
    expect(getPaymentLinkState(record({ leftAmount: 0 }), link({ status: 'PAID' }))).toBe('paid');
    expect(getPaymentLinkState(record({ leftAmount: 200 }), link({ status: 'PAID' }))).toBe('partial');
  });

  it('maps EXPIRED and SUPERSEDED to expired', () => {
    expect(getPaymentLinkState(record({}), link({ status: 'EXPIRED' }))).toBe('expired');
    expect(getPaymentLinkState(record({}), link({ status: 'SUPERSEDED' }))).toBe('expired');
  });
});

describe('validatePaymentAmount', () => {
  it('accepts amounts from just above 0 up to the balance', () => {
    expect(validatePaymentAmount('1', 500)).toBeNull();
    expect(validatePaymentAmount('500', 500)).toBeNull();
    expect(validatePaymentAmount('250.5', 500)).toBeNull();
  });

  it('rejects empty, zero, negative, and over-balance amounts', () => {
    expect(validatePaymentAmount('', 500)).not.toBeNull();
    expect(validatePaymentAmount('0', 500)).not.toBeNull();
    expect(validatePaymentAmount('-5', 500)).not.toBeNull();
    expect(validatePaymentAmount('501', 500)).not.toBeNull();
  });
});

describe('latestPaymentLinkByInvoice', () => {
  it('keeps the first (newest) link per invoice', () => {
    const map = latestPaymentLinkByInvoice([
      link({ id: 'new', invoiceId: 'a', status: 'EXPIRED' }),
      link({ id: 'old', invoiceId: 'a', status: 'SHARED' }),
      link({ id: 'b1', invoiceId: 'b', status: 'PAID' }),
    ]);
    expect(map.get('a')?.id).toBe('new');
    expect(map.get('b')?.id).toBe('b1');
    expect(map.size).toBe(2);
  });
});
