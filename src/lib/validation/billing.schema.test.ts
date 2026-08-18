import { describe, expect, it } from 'vitest';
import {
  calculateInvoiceTotals,
  invoiceServiceStepSchema,
} from '@/lib/validation/billing.schema';
import { medicineSchema } from '@/lib/validation/medicine.schema';

describe('medicineSchema', () => {
  it('accepts valid medicine data', () => {
    const result = medicineSchema.safeParse({
      name: 'Tab OCRIS 200',
      category: 'TABLET',
      manufacturer: 'Himalaya',
      batchNumber: 'B-001',
      stockQuantity: '5000',
      expiryDate: '2026-10-05',
      purchasePrice: '350',
      price: '500',
      lowStockAlertEnabled: true,
      lowStockThreshold: '20',
    });
    expect(result.success).toBe(true);
  });
});

describe('invoiceServiceStepSchema', () => {
  it('accepts service step without package type', () => {
    const result = invoiceServiceStepSchema.safeParse({
      patientId: '#PT458652',
      fullName: 'Khushi Shroff',
      contactNumber: '9205061339',
      invoiceDate: '2026-10-15',
      visitType: 'Consultation',
      serviceFees: '800',
    });
    expect(result.success).toBe(true);
  });

  it('accepts patient details without service fees for medicine or therapy invoices', () => {
    const result = invoiceServiceStepSchema.safeParse({
      patientId: '#PT458652',
      fullName: 'Khushi Shroff',
      contactNumber: '9205061339',
      invoiceDate: '2026-10-15',
      visitType: 'Consultation',
      serviceFees: '',
    });
    expect(result.success).toBe(true);
  });
});

describe('calculateInvoiceTotals', () => {
  it('calculates subtotal tax and discount', () => {
    const totals = calculateInvoiceTotals(
      [{ amount: 800, quantity: 1 }, { amount: 400, quantity: 2 }],
      400,
      true,
      3,
      3,
    );
    expect(totals.subtotal).toBe(1600);
    expect(totals.cgst).toBe(48);
    expect(totals.sgst).toBe(48);
    expect(totals.total).toBe(1296);
  });

  it('keeps GST at two decimal places to match billing-service', () => {
    const totals = calculateInvoiceTotals(
      [{ amount: 1520, quantity: 1 }],
      0,
      true,
      3,
      3,
    );
    expect(totals.cgst).toBe(45.6);
    expect(totals.sgst).toBe(45.6);
    expect(totals.total).toBe(1611.2);
  });
});
