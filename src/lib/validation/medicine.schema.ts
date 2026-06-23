import { z } from 'zod';

export const medicineSchema = z.object({
  name: z.string().min(1, 'Medicine name is required'),
  category: z.string().min(1, 'Category is required'),
  stockQuantity: z
    .string()
    .min(1, 'Stock quantity is required')
    .regex(/^\d+$/, 'Enter a valid quantity'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  price: z
    .string()
    .min(1, 'Price is required')
    .regex(/^\d+$/, 'Enter a valid price'),
  status: z.enum(['In Stock', 'Low Stock', 'Out of Stock']),
});

export type MedicineFormValues = z.infer<typeof medicineSchema>;

export const MEDICINE_CATEGORIES = [
  'Tablet',
  'Capsule',
  'Syrup',
  'Powder',
  'Oil',
] as const;

export const MEDICINE_STATUS_OPTIONS = [
  'In Stock',
  'Low Stock',
  'Out of Stock',
] as const;

export const MEDICINE_NAME_OPTIONS = [
  'Tab OCRIS 200',
  'Ashwagandha Capsule',
  'Triphala Churna',
  'Brahmi Syrup',
] as const;
