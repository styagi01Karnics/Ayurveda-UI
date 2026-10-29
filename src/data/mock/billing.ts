import type { BillingRecord } from '@/types';

export const initialBillingRecords: BillingRecord[] = [
  {
    id: 'bill-1',
    invoiceId: 'INV-1024',
    patientId: '#PT458652',
    secondaryPatientId: 'GAN2025-0129',
    invoiceDate: '5/10/2026',
    totalAmount: 15000,
    paidAmount: 15000,
    leftAmount: 15000,
    status: 'Ongoing',
  },
  {
    id: 'bill-2',
    invoiceId: 'INV-1024',
    patientId: '#PT458652',
    secondaryPatientId: 'GAN2025-0129',
    invoiceDate: '5/10/2026',
    totalAmount: 15000,
    paidAmount: 15000,
    leftAmount: 15000,
    status: 'Completed',
  },
  {
    id: 'bill-3',
    invoiceId: 'INV-1024',
    patientId: '#PT458652',
    secondaryPatientId: 'GAN2025-0129',
    invoiceDate: '5/10/2026',
    totalAmount: 15000,
    paidAmount: 15000,
    leftAmount: 15000,
    status: 'Ongoing',
  },
  {
    id: 'bill-4',
    invoiceId: 'INV-1024',
    patientId: '#PT458652',
    secondaryPatientId: 'GAN2025-0129',
    invoiceDate: '5/10/2026',
    totalAmount: 15000,
    paidAmount: 15000,
    leftAmount: 15000,
    status: 'Completed',
  },
  {
    id: 'bill-5',
    invoiceId: 'INV-1024',
    patientId: '#PT458652',
    secondaryPatientId: 'GAN2025-0129',
    invoiceDate: '5/10/2026',
    totalAmount: 15000,
    paidAmount: 15000,
    leftAmount: 15000,
    status: 'Ongoing',
  },
  {
    id: 'bill-6',
    invoiceId: 'INV-1024',
    patientId: '#PT458652',
    secondaryPatientId: 'GAN2025-0129',
    invoiceDate: '5/10/2026',
    totalAmount: 15000,
    paidAmount: 15000,
    leftAmount: 15000,
    status: 'Completed',
  },
];

export const BILLING_FILTER_OPTIONS = {
  status: ['Pending', 'Unpaid', 'Partial', 'Ongoing', 'Completed'],
} as const;

/** Desk / online channel chosen before Via Payment sub-modes. */
export const PAYMENT_CHANNELS = [
  {
    id: 'cash' as const,
    title: 'Cash',
    description: 'Collect cash at the counter (marks invoice paid)',
  },
  {
    id: 'direct_upi' as const,
    title: 'Direct UPI',
    description: 'Create PayU QR / UPI payment link for the balance',
  },
  {
    id: 'via_payment' as const,
    title: 'Via Payment',
    description: 'Email a PayU payment link to the patient',
  },
];

/** Sub-modes shown when “Via Payment” is expanded. */
export const PAYMENT_MODES = [
  {
    id: 'upi' as const,
    title: 'UPI',
    description: 'Pay through UPI',
    amount: 2072,
  },
  {
    id: 'card' as const,
    title: 'Debit/Credit Cards',
    description: 'Pay via RuPay, Visa, Master Card',
    amount: 2072,
  },
  {
    id: 'wallet' as const,
    title: 'Wallets',
    description: 'PhonePe, Airtel, PayPal & more',
    amount: 2072,
  },
  {
    id: 'partial' as const,
    title: 'Partial Payment',
    description: 'Pay ₹1572 on Completion',
    amount: 500,
  },
  {
    id: 'emi' as const,
    title: 'EMI',
    description: 'Pay via Credit/ Debit Card EMI',
    amount: 2072,
  },
];
