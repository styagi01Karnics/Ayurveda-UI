import { AppIcon } from '@/components/ui/AppIcon';
import { DataTableShell } from '@/components/ui/DataTableShell';
import { assets } from '@/lib/assets';
import { cn } from '@/lib/utils';
import { formatCurrency, formatNumber } from '@/lib/utils';
import type { MedicineRecord } from '@/types';

interface MedicinesTableProps {
  records: MedicineRecord[];
  onEdit: (record: MedicineRecord) => void;
  onDelete: (record: MedicineRecord) => void;
  embedded?: boolean;
}

export function MedicinesTable({
  records,
  onEdit,
  onDelete,
  embedded,
}: MedicinesTableProps) {
  return (
    <DataTableShell embedded={embedded}>
      <table className="w-full table-fixed text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs text-text-muted">
              <th className="px-5 py-3 font-medium">Medicine Name</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Stock Quantity</th>
              <th className="px-5 py-3 font-medium">Expiry Date</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-text-muted">
                  No medicines found matching your filters.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-4 font-medium text-brown">{record.name}</td>
                  <td className="px-5 py-4 text-brown">{record.category}</td>
                  <td className="px-5 py-4 text-brown">
                    {formatNumber(record.stockQuantity)}
                  </td>
                  <td className="px-5 py-4 text-brown">{record.expiryDate}</td>
                  <td className="px-5 py-4 text-brown">
                    {formatCurrency(record.price)}
                  </td>
                  <td className="px-5 py-4">
                    <MedicineStatus status={record.status} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(record)}
                        className="rounded-lg border border-gray-200 bg-cream px-2.5 py-2 text-brown hover:bg-gold/10"
                        aria-label={`Edit ${record.name}`}
                      >
                        <AppIcon src={assets.icons.edit} className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(record)}
                        className="rounded-lg border border-gray-200 bg-cream px-2.5 py-2 text-brown hover:bg-danger/10 hover:text-danger"
                        aria-label={`Delete ${record.name}`}
                      >
                        <AppIcon src={assets.icons.trash} className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
    </DataTableShell>
  );
}

function MedicineStatus({ status }: { status: MedicineRecord['status'] | string }) {
  const normalized =
    status === 'IN_STOCK' || status === 'In Stock'
      ? 'In Stock'
      : status === 'LOW_STOCK' || status === 'Low Stock'
        ? 'Low Stock'
        : status === 'OUT_OF_STOCK' || status === 'Out of Stock'
          ? 'Out of Stock'
          : status;

  const colors: Record<string, string> = {
    'In Stock': 'text-success',
    'Low Stock': 'text-gold',
    'Out of Stock': 'text-danger',
  };

  return (
    <span className={cn('font-medium', colors[normalized] ?? 'text-brown')}>
      {normalized}
    </span>
  );
}
