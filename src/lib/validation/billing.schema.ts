import { z } from 'zod';

export const invoiceServiceStepSchema = z.object({
  patientId: z.string().min(1, 'Patient Code is required'),
  fullName: z.string().min(1, 'Full name is required'),
  contactNumber: z
    .string()
    .min(1, 'Contact number is required')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit contact number'),
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  visitType: z.string().min(1, 'Visit type is required'),
  serviceFees: z
    .string()
    .optional()
    .refine((value) => !value || /^\d+$/.test(value), 'Enter a valid amount'),
  packageMasterId: z.string().optional(),
  packageType: z.string().optional(),
  packageCharges: z
    .string()
    .optional()
    .refine((value) => !value || /^\d+$/.test(value), 'Enter a valid amount'),
}).superRefine((data, ctx) => {
  if (data.packageType?.trim() && !data.packageMasterId?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Package name is required when package type is selected',
      path: ['packageMasterId'],
    });
  }
  if (data.packageType?.trim() && !data.packageCharges?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Package charges is required when package type is selected',
      path: ['packageCharges'],
    });
  }
});

export const invoiceMedicineItemSchema = z.object({
  medicineId: z.string().min(1, 'Medicine is required'),
  quantity: z
    .string()
    .min(1, 'Quantity is required')
    .regex(/^[1-9]\d*$/, 'Enter a valid quantity'),
  price: z
    .string()
    .min(1, 'Price is required')
    .regex(/^\d+$/, 'Enter a valid price'),
});

export const invoiceTherapyItemSchema = z.object({
  therapyName: z.string().min(1, 'Therapy name is required'),
  therapyPrice: z
    .string()
    .min(1, 'Therapy price is required')
    .regex(/^\d+$/, 'Enter a valid price'),
  assignedTherapistId: z.string().min(1, 'Assigned therapist is required'),
  assignedTherapistName: z.string().optional(),
  scheduleDate: z.string().min(1, 'Schedule date is required'),
  scheduleTime: z
    .string()
    .min(1, 'Schedule time is required')
    .refine(
      (value) => !value || (value >= '10:00' && value <= '19:00'),
      'Schedule time must be between 10:00 AM and 7:00 PM',
    ),
  sessionDuration: z.string().min(1, 'Session duration is required'),
  sessionFrequency: z.string().min(1, 'Session frequency is required'),
});

export const invoiceSummarySchema = z.object({
  discount: z.string().regex(/^\d*$/, 'Enter a valid discount'),
  applyTax: z.boolean(),
  cgst: z.string().optional(),
  sgst: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.applyTax) {
    if (!data.cgst?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'CGST is required',
        path: ['cgst'],
      });
    }
    if (!data.sgst?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'SGST is required',
        path: ['sgst'],
      });
    }
  }
});

export type InvoiceServiceStepValues = z.infer<typeof invoiceServiceStepSchema>;
export type InvoiceMedicineItemValues = z.infer<typeof invoiceMedicineItemSchema>;
export type InvoiceTherapyItemValues = z.infer<typeof invoiceTherapyItemSchema>;
export type InvoiceSummaryValues = z.infer<typeof invoiceSummarySchema>;

export const VISIT_TYPE_OPTIONS = ['Consultation', 'Follow-up', 'Therapy'] as const;
export const PACKAGE_TYPE_OPTIONS = ['Monthly', 'Quarterly', 'Annual'] as const;
export const THERAPY_NAME_OPTIONS = ['Panchakarma', 'Abhyanga', 'Shirodhara'] as const;
export const THERAPIST_OPTIONS = ['Meera Singh', 'Dr. Sheekha', 'Dr. Sharma'] as const;

export function calculateInvoiceTotals(
  lineItems: { amount: number; quantity: number }[],
  discount: number,
  applyTax: boolean,
  cgstRate: number,
  sgstRate: number,
) {
  const subtotal = roundMoney(
    lineItems.reduce((sum, item) => sum + item.amount * item.quantity, 0),
  );
  const cgst = applyTax ? roundMoney(subtotal * (cgstRate / 100)) : 0;
  const sgst = applyTax ? roundMoney(subtotal * (sgstRate / 100)) : 0;
  const tax = roundMoney(cgst + sgst);
  const total = roundMoney(subtotal + tax - discount);
  return { subtotal, cgst, sgst, tax, total };
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
