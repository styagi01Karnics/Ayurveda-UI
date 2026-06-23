import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { usePageAction } from '@/app/PageActionContext';
import { useToast } from '@/app/ToastContext';
import { DeleteMedicineModal } from '@/components/medicines/DeleteMedicineModal';
import { MedicineFormModal } from '@/components/medicines/MedicineFormModal';
import { MedicinesTable } from '@/components/medicines/MedicinesTable';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { initialMedicines, MEDICINE_FILTER_OPTIONS } from '@/data/mock/medicines';
import type { MedicineFormValues } from '@/lib/validation/medicine.schema';
import type { MedicineRecord } from '@/types';

function formatExpiryDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-GB');
}

export function MedicinesPage() {
  const { showToast } = useToast();
  const [medicines, setMedicines] = useState(initialMedicines);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<MedicineRecord | null>(null);
  const [editTarget, setEditTarget] = useState<MedicineRecord | null>(null);

  const headerAction = useMemo(
    () => (
      <Button
        className="gap-1.5 px-4 py-2 text-sm"
        onClick={() => {
          setEditTarget(null);
          setFormOpen(true);
        }}
      >
        <Plus className="h-4 w-4" />
        Add Medicine
      </Button>
    ),
    [],
  );

  usePageAction(headerAction);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !categoryFilter || item.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [medicines, searchQuery, categoryFilter]);

  const handleSubmit = (values: MedicineFormValues) => {
    const record: MedicineRecord = {
      id: editTarget?.id ?? `med-${Date.now()}`,
      name: values.name,
      category: values.category,
      stockQuantity: Number(values.stockQuantity),
      expiryDate: formatExpiryDate(values.expiryDate),
      price: Number(values.price),
      status: values.status,
    };

    if (editTarget) {
      setMedicines((prev) =>
        prev.map((m) => (m.id === editTarget.id ? record : m)),
      );
      showToast({
        title: 'Medicine Updated',
        message: `${record.name} has been updated successfully.`,
      });
    } else {
      setMedicines((prev) => [record, ...prev]);
      showToast({
        title: 'Medicine Added',
        message: `${record.name} has been added to inventory.`,
      });
    }
    setFormOpen(false);
    setEditTarget(null);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    setMedicines((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    showToast({
      title: 'Medicine has been deleted',
      message: `${deleteTarget.name} was removed from inventory.`,
    });
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Medicine Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
          />
        </div>
        <Select
          placeholder="Category"
          options={[...MEDICINE_FILTER_OPTIONS.category]}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />
      </div>

      <MedicinesTable
        records={filteredMedicines}
        onEdit={(record) => {
          setEditTarget(record);
          setFormOpen(true);
        }}
        onDelete={setDeleteTarget}
      />

      <MedicineFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditTarget(null);
        }}
        onSubmit={handleSubmit}
        medicine={editTarget}
      />

      <DeleteMedicineModal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        medicineName={deleteTarget?.name}
      />
    </div>
  );
}
