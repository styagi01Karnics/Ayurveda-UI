import type { MedicineRecord } from '@/types';

export const initialMedicines: MedicineRecord[] = [
  {
    id: 'med-1',
    name: 'Tab OCRIS 200',
    category: 'Tablet',
    stockQuantity: 5000,
    expiryDate: '5/10/2026',
    price: 500,
    status: 'In Stock',
  },
  {
    id: 'med-2',
    name: 'Tab OCRIS 200',
    category: 'Tablet',
    stockQuantity: 5000,
    expiryDate: '5/10/2026',
    price: 500,
    status: 'Low Stock',
  },
  {
    id: 'med-3',
    name: 'Tab OCRIS 200',
    category: 'Tablet',
    stockQuantity: 5000,
    expiryDate: '5/10/2026',
    price: 500,
    status: 'Out of Stock',
  },
  {
    id: 'med-4',
    name: 'Tab OCRIS 200',
    category: 'Tablet',
    stockQuantity: 5000,
    expiryDate: '5/10/2026',
    price: 500,
    status: 'In Stock',
  },
  {
    id: 'med-5',
    name: 'Tab OCRIS 200',
    category: 'Tablet',
    stockQuantity: 5000,
    expiryDate: '5/10/2026',
    price: 500,
    status: 'In Stock',
  },
  {
    id: 'med-6',
    name: 'Tab OCRIS 200',
    category: 'Tablet',
    stockQuantity: 5000,
    expiryDate: '5/10/2026',
    price: 500,
    status: 'In Stock',
  },
];

export const MEDICINE_FILTER_OPTIONS = {
  category: ['Tablet', 'Capsule', 'Syrup', 'Powder', 'Oil'],
} as const;
