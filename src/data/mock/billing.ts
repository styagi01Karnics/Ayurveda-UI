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
  status: ['Pending', 'Unpaid', 'Ongoing', 'Completed'],
} as const;

export const PAYMENT_MODES = [
  {
    id: 'cash' as const,
    title: 'Cash',
    description: 'Collect cash in hand and mark invoice paid',
  },
  {
    id: 'online' as const,
    title: 'Online Payment',
    description: 'Send PayU payment link to the patient by email',
  },
  {
    id: 'qr' as const,
    title: 'QR Payment',
    description: 'Show shop QR for the patient to scan and pay',
  },
];
