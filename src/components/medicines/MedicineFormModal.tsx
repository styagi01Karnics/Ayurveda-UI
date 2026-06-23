import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  MEDICINE_CATEGORIES,
  MEDICINE_STATUS_OPTIONS,
  medicineSchema,
  type MedicineFormValues,
} from '@/lib/validation/medicine.schema';
import type { MedicineRecord } from '@/types';

interface MedicineFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: MedicineFormValues) => void;
  medicine?: MedicineRecord | null;
}

export function MedicineFormModal({
  open,
  onClose,
  onSubmit,
  medicine,
}: MedicineFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineSchema),
    defaultValues: {
      name: '',
      category: '',
      stockQuantity: '',
      expiryDate: '',
      price: '',
      status: 'In Stock',
    },
  });

  useEffect(() => {
    if (medicine) {
      reset({
        name: medicine.name,
        category: medicine.category,
        stockQuantity: String(medicine.stockQuantity),
        expiryDate: medicine.expiryDate.includes('/')
          ? medicine.expiryDate.split('/').reverse().join('-').replace(/(\d{4})-(\d+)-(\d+)/, (_, y, m, d) => `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`)
          : medicine.expiryDate,
        price: String(medicine.price),
        status: medicine.status,
      });
    } else {
      reset({
        name: '',
        category: '',
        stockQuantity: '',
        expiryDate: '',
        price: '',
        status: 'In Stock',
      });
    }
  }, [medicine, reset, open]);

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={medicine ? 'Edit Medicine' : 'Add Medicine'}
      subtitle="Please fill out the medicine details"
      footer={
        <Button onClick={handleSubmit(onSubmit)}>
          {medicine ? 'Save Changes' : 'Add Medicine'}
        </Button>
      }
    >
      <form className="grid gap-4 sm:grid-cols-2" noValidate>
        <Input
          label="Medicine Name"
          placeholder="Medicine Name"
          error={errors.name?.message}
          {...register('name')}
        />
        <Select
          label="Category"
          placeholder="Category"
          options={[...MEDICINE_CATEGORIES]}
          error={errors.category?.message}
          {...register('category')}
        />
        <Input
          label="Stock Quantity"
          placeholder="Stock Quantity"
          error={errors.stockQuantity?.message}
          {...register('stockQuantity')}
        />
        <Input
          label="Expiry Date"
          type="date"
          error={errors.expiryDate?.message}
          {...register('expiryDate')}
        />
        <Input
          label="Price (₹)"
          placeholder="Price"
          error={errors.price?.message}
          {...register('price')}
        />
        <Select
          label="Status"
          options={[...MEDICINE_STATUS_OPTIONS]}
          error={errors.status?.message}
          {...register('status')}
        />
      </form>
    </Modal>
  );
}
