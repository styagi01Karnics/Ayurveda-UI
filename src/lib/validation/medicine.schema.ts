import { z } from 'zod';

export const medicineSchema = z.object({
  name: z.string().min(1, 'Medicine name is required'),
  category: z.string().min(1, 'Medicine category is required'),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  batchNumber: z.string().min(1, 'Batch number is required'),
  stockQuantity: z
    .string()
    .min(1, 'Quantity is required')
    .regex(/^\d+$/, 'Enter a valid quantity'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  purchasePrice: z
    .string()
    .min(1, 'Purchase price is required')
    .regex(/^\d+(\.\d+)?$/, 'Enter a valid price'),
  price: z
    .string()
    .min(1, 'Selling price is required')
    .regex(/^\d+(\.\d+)?$/, 'Enter a valid price'),
  lowStockAlertEnabled: z.boolean(),
  lowStockThreshold: z
    .string()
    .min(1, 'Threshold is required')
    .regex(/^\d+$/, 'Enter a valid threshold'),
});

export type MedicineFormValues = z.infer<typeof medicineSchema>;

export const MEDICINE_NAME_OPTIONS = [
  'Tab OCRIS 200',
  'Ashwagandha Capsule',
  'Triphala Churna',
  'Brahmi Syrup',
] as const;
