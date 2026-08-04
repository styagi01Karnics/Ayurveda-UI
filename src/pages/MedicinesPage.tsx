import { useMemo, useState } from 'react';
import { usePageAction } from '@/app/PageActionContext';
import { useToast } from '@/app/ToastContext';
import { PageShell } from '@/components/layout/PageShell';
import { DeleteMedicineModal } from '@/components/medicines/DeleteMedicineModal';
import { MedicineFormModal } from '@/components/medicines/MedicineFormModal';
import { MedicinesTable } from '@/components/medicines/MedicinesTable';
import { AppIcon } from '@/components/ui/AppIcon';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { FilterControl, ListPanel } from '@/components/ui/ListPanel';
import { SearchField } from '@/components/ui/SearchField';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useAsyncData } from '@/hooks/useAsyncData';
import {
  createMedicine,
  createMultipleMedicines,
  deleteMedicine,
  getAllMedicines,
  getMedicineCategories,
  updateMedicine,
} from '@/lib/api/medicines';
import { ApiError } from '@/lib/api/client';
import {
  mapMedicineCategoryOptions,
  mapMedicineToRecord,
  toApiMedicineCategory,
} from '@/lib/api/mappers';
import type { CreateMedicinePayload } from '@/lib/api/types';
import { assets } from '@/lib/assets';
import type { MedicineFormValues } from '@/lib/validation/medicine.schema';
import type { MedicineRecord } from '@/types';

export function MedicinesPage() {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MedicineRecord | null>(null);
  const [editTarget, setEditTarget] = useState<MedicineRecord | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    data,
    loading,
    error,
    reload,
  } = useAsyncData(async () => {
    const [rows, apiCategories] = await Promise.all([
      getAllMedicines(),
      getMedicineCategories(),
    ]);

    return {
      medicines: rows.map(mapMedicineToRecord),
      categoryOptions: mapMedicineCategoryOptions(apiCategories),
    };
  }, { medicines: [] as MedicineRecord[], categoryOptions: [] });

  const headerAction = useMemo(
    () => (
      <Button
        className="gap-1.5 px-4 py-2 text-sm"
        onClick={() => {
          setEditTarget(null);
          setFormOpen(true);
        }}
      >
        <AppIcon src={assets.icons.add} className="h-4 w-4" />
        Add Medicine
      </Button>
    ),
    [],
  );

  usePageAction(headerAction);

  const filteredMedicines = useMemo(() => {
    return data.medicines.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !categoryFilter || item.categoryCode === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [data.medicines, searchQuery, categoryFilter]);

  const buildPayload = (values: MedicineFormValues): CreateMedicinePayload => ({
    medicineName: values.name.trim(),
    category: toApiMedicineCategory(values.category),
    manufacturer: values.manufacturer.trim(),
    batchNumber: values.batchNumber.trim(),
    quantity: Number(values.stockQuantity),
    expiryDate: values.expiryDate,
    purchasePrice: Number(values.purchasePrice),
    sellingPrice: Number(values.price),
    lowStockAlertEnabled: values.lowStockAlertEnabled,
    lowStockThreshold: Number(values.lowStockThreshold),
    status: 'ACTIVE',
  });

  const handleSubmit = async (values: MedicineFormValues) => {
    setSaving(true);
    try {
      const payload = buildPayload(values);

      if (editTarget) {
        await updateMedicine(editTarget.id, payload);
        showToast({
          title: 'Medicine Updated',
          message: `${values.name} has been updated successfully.`,
        });
      } else {
        await createMedicine(payload);
        showToast({
          title: 'Medicine Added',
          message: `${values.name} has been added to inventory.`,
        });
      }

      setFormOpen(false);
      setEditTarget(null);
      reload();
    } catch (err) {
      showToast({
        title: 'Error',
        message:
          err instanceof ApiError ? err.message : 'Failed to save medicine',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmitBulk = async (items: MedicineFormValues[]) => {
    setSaving(true);
    try {
      const payloads = items.map(buildPayload);
      await createMultipleMedicines(payloads);
      showToast({
        title: 'Medicines Added',
        message: `${payloads.length} medicines have been added to inventory.`,
      });
      setFormOpen(false);
      setEditTarget(null);
      reload();
    } catch (err) {
      showToast({
        title: 'Error',
        message:
          err instanceof ApiError ? err.message : 'Failed to save medicines',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteMedicine(deleteTarget.id);
      showToast({
        title: 'Medicine has been deleted',
        message: `${deleteTarget.name} was removed from inventory.`,
      });
      setDeleteTarget(null);
      reload();
    } catch (err) {
      showToast({
        title: 'Error',
        message:
          err instanceof ApiError ? err.message : 'Failed to delete medicine',
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PageShell>
      <AsyncStatus loading={loading} error={error} onRetry={reload}>
        <ListPanel
          filters={
            <>
              <FilterControl>
                <SearchField
                  placeholder="Medicine Name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </FilterControl>
              <FilterControl>
                <Select
                  placeholder="Category"
                  options={data.categoryOptions}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                />
              </FilterControl>
            </>
          }
        >
          <AsyncStatus
            loading={false}
            error={null}
            empty={filteredMedicines.length === 0}
            emptyMessage="No medicines found matching your filters."
          >
            <MedicinesTable
              embedded
              records={filteredMedicines}
              onEdit={(record) => {
                setEditTarget(record);
                setFormOpen(true);
              }}
              onDelete={setDeleteTarget}
            />
          </AsyncStatus>
        </ListPanel>
      </AsyncStatus>

      <MedicineFormModal
        open={formOpen}
        submitting={saving}
        categoriesLoading={loading}
        categoryOptions={data.categoryOptions}
        onClose={() => {
          if (saving) return;
          setFormOpen(false);
          setEditTarget(null);
        }}
        onSubmit={handleSubmit}
        onSubmitBulk={handleSubmitBulk}
        medicine={editTarget}
      />

      <DeleteMedicineModal
        open={Boolean(deleteTarget)}
        submitting={deleting}
        onClose={() => {
          if (deleting) return;
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        medicineName={deleteTarget?.name}
      />
    </PageShell>
  );
}
