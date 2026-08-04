import { forwardRef, useEffect, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Plus } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, type SelectOption } from '@/components/ui/Select';
import {
  medicineSchema,
  type MedicineFormValues,
} from '@/lib/validation/medicine.schema';
import { cn } from '@/lib/utils';
import type { MedicineRecord } from '@/types';

interface MedicineFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: MedicineFormValues) => void | Promise<void>;
  onSubmitBulk?: (values: MedicineFormValues[]) => void | Promise<void>;
  medicine?: MedicineRecord | null;
  categoryOptions: SelectOption[];
  categoriesLoading?: boolean;
  submitting?: boolean;
}

const emptyValues: MedicineFormValues = {
  name: '',
  category: '',
  manufacturer: '',
  batchNumber: '',
  stockQuantity: '',
  expiryDate: '',
  purchasePrice: '',
  price: '',
  lowStockAlertEnabled: true,
  lowStockThreshold: '20',
};

function toInputDate(expiryDate: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(expiryDate)) return expiryDate;
  if (expiryDate.includes('/')) {
    const [day, month, year] = expiryDate.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  return expiryDate;
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h3 className="text-sm font-semibold text-brown">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

const RupeeInput = forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>(
  function RupeeInput({ label, placeholder, error, className, ...props }, ref) {
    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={props.id ?? props.name} className="text-xs font-medium text-text-muted">
            {label}
          </label>
        )}
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-brown">
            ₹
          </span>
          <input
            ref={ref}
            {...props}
            id={props.id ?? props.name}
            placeholder={placeholder}
            className={cn(
              'w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-8 pr-4 text-sm text-brown placeholder:text-gray-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20',
              error && 'border-danger focus:border-danger focus:ring-danger/20',
              className,
            )}
            aria-invalid={Boolean(error)}
          />
        </div>
        {error && (
          <p className="text-xs text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

function StockAlertToggle({
  checked,
  threshold,
  onChange,
}: {
  checked: boolean;
  threshold: string;
  onChange: (checked: boolean) => void;
}) {
  return (
    <section className="space-y-3 border-t border-gray-100 pt-5">
      <h3 className="text-sm font-semibold text-brown">Low Stock Alert</h3>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-text-muted">
          Notify when stock below {threshold || '20'} units
        </p>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label="Low stock alert"
          onClick={() => onChange(!checked)}
          className={cn(
            'relative h-6 w-11 shrink-0 rounded-full transition-colors',
            checked ? 'bg-brown' : 'bg-gray-300',
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
              checked ? 'translate-x-[22px]' : 'translate-x-0.5',
            )}
          />
        </button>
      </div>
    </section>
  );
}

function isMedicineFormComplete(values: MedicineFormValues): boolean {
  return medicineSchema.safeParse(values).success;
}

export function MedicineFormModal({
  open,
  onClose,
  onSubmit,
  onSubmitBulk,
  medicine,
  categoryOptions,
  categoriesLoading = false,
  submitting = false,
}: MedicineFormModalProps) {
  const [pendingItems, setPendingItems] = useState<MedicineFormValues[]>([]);

  const {
    register,
    reset,
    watch,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineSchema),
    defaultValues: emptyValues,
  });

  const lowStockAlertEnabled = watch('lowStockAlertEnabled');
  const lowStockThreshold = watch('lowStockThreshold');

  useEffect(() => {
    if (!open) {
      setPendingItems([]);
      return;
    }

    if (medicine) {
      reset({
        name: medicine.name,
        category: medicine.categoryCode,
        manufacturer: medicine.manufacturer ?? '',
        batchNumber: medicine.batchNumber ?? '',
        stockQuantity: String(medicine.stockQuantity),
        expiryDate: toInputDate(medicine.expiryDate),
        purchasePrice: String(medicine.purchasePrice ?? ''),
        price: String(medicine.price),
        lowStockAlertEnabled: medicine.lowStockAlertEnabled ?? true,
        lowStockThreshold: String(medicine.lowStockThreshold ?? 20),
      });
    } else {
      reset(emptyValues);
    }
  }, [medicine, reset, open]);

  const handleClose = () => {
    reset(emptyValues);
    setPendingItems([]);
    onClose();
  };

  const handleAddMore = async () => {
    const valid = await trigger();
    if (!valid) return;

    const values = getValues();
    if (!isMedicineFormComplete(values)) return;

    setPendingItems((prev) => [...prev, values]);
    reset(emptyValues);
  };

  const handleConfirmClick = async () => {
    if (medicine) {
      const valid = await trigger();
      if (!valid) return;
      await onSubmit(getValues());
      return;
    }

    const currentValues = getValues();
    const currentComplete = isMedicineFormComplete(currentValues);
    const validPending = pendingItems.filter(isMedicineFormComplete);

    if (currentComplete) {
      const valid = await trigger();
      if (!valid) return;
    }

    const itemsToSubmit = currentComplete
      ? [...validPending, getValues()]
      : validPending;

    if (itemsToSubmit.length === 0) {
      await trigger();
      return;
    }

    if (itemsToSubmit.length > 1 && onSubmitBulk) {
      await onSubmitBulk(itemsToSubmit);
    } else {
      await onSubmit(itemsToSubmit[0]);
    }

    setPendingItems([]);
  };

  const isEdit = Boolean(medicine);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isEdit ? 'Edit Medicine' : 'Add Medicine'}
      subtitle="Please fill out the medicine details"
      size="xl"
      footer={
        <div className="flex w-full flex-wrap items-center justify-end gap-3">
          {!isEdit && (
            <Button
              type="button"
              variant="outline"
              className="gap-1.5"
              disabled={submitting || categoriesLoading}
              onClick={() => void handleAddMore()}
            >
              <Plus className="h-4 w-4" />
              Add More Medicine
            </Button>
          )}
          <Button
            type="button"
            onClick={() => void handleConfirmClick()}
            disabled={submitting || categoriesLoading}
          >
            {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Confirm'}
          </Button>
        </div>
      }
    >
      <form className="space-y-6" noValidate onSubmit={(e) => e.preventDefault()}>
        {pendingItems.length > 0 && (
          <p className="rounded-lg bg-cream px-4 py-2.5 text-sm text-brown">
            {pendingItems.length} medicine{pendingItems.length > 1 ? 's' : ''} queued
            {pendingItems.some((item) => item.name.trim())
              ? `: ${pendingItems.map((item) => item.name.trim()).filter(Boolean).join(', ')}`
              : ''}{' '}
            — click Confirm to save all.
          </p>
        )}

        <FormSection title="Medicine Information">
          <Input
            label="Medicine Name"
            placeholder="Medicine Name"
            error={errors.name?.message}
            {...register('name')}
          />
          <Select
            label="Medicine Category"
            placeholder={categoriesLoading ? 'Loading categories…' : 'Medicine Category'}
            options={categoryOptions}
            disabled={categoriesLoading || categoryOptions.length === 0}
            error={
              errors.category?.message ??
              (!categoriesLoading && categoryOptions.length === 0
                ? 'No categories available from API'
                : undefined)
            }
            {...register('category')}
          />
          <Input
            label="Manufacturer"
            placeholder="Manufacturer"
            error={errors.manufacturer?.message}
            {...register('manufacturer')}
          />
          <Input
            label="Batch Number"
            placeholder="Batch Number"
            error={errors.batchNumber?.message}
            {...register('batchNumber')}
          />
        </FormSection>

        <FormSection title="Medicine Information">
          <Input
            label="Quantity"
            placeholder="Quantity"
            error={errors.stockQuantity?.message}
            {...register('stockQuantity')}
          />
          <div className="flex w-full flex-col gap-1.5">
            <label htmlFor="expiryDate" className="text-xs font-medium text-text-muted">
              Expiry Date
            </label>
            <div className="relative">
              <input
                id="expiryDate"
                type="date"
                className={cn(
                  'w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 pr-10 text-sm text-brown focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20',
                  errors.expiryDate && 'border-danger focus:border-danger focus:ring-danger/20',
                )}
                {...register('expiryDate')}
              />
              <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            </div>
            {errors.expiryDate?.message && (
              <p className="text-xs text-danger" role="alert">
                {errors.expiryDate.message}
              </p>
            )}
          </div>
          <RupeeInput
            label="Purchase Price"
            placeholder="Purchase Price"
            error={errors.purchasePrice?.message}
            {...register('purchasePrice')}
          />
          <RupeeInput
            label="Selling Price"
            placeholder="Selling Price"
            error={errors.price?.message}
            {...register('price')}
          />
        </FormSection>

        <StockAlertToggle
          checked={lowStockAlertEnabled}
          threshold={lowStockThreshold}
          onChange={(checked) =>
            setValue('lowStockAlertEnabled', checked, { shouldValidate: true })
          }
        />
        <input type="hidden" {...register('lowStockThreshold')} />
      </form>
    </Modal>
  );
}
