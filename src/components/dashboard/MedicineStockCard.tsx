import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { LowStockItem } from '@/types';

interface MedicineStockCardProps {
  totalStock: number;
  tablets: number;
  syrups: number;
  powder: number;
  lowStockItems: LowStockItem[];
}

export function MedicineStockCard({
  totalStock,
  tablets,
  syrups,
  powder,
  lowStockItems,
}: MedicineStockCardProps) {
  const total = tablets + syrups + powder;

  return (
    <Card>
      <h3 className="mb-1 text-sm font-medium text-text-muted">
        Medicine Stock Availability
      </h3>
      <p className="text-2xl font-bold text-brown">{totalStock}</p>
      <div className="mt-2 flex gap-4 text-xs text-text-muted">
        <span>{tablets} Tablets</span>
        <span>{syrups} Syrups</span>
        <span>{powder} Powder</span>
      </div>

      <div className="mt-4 flex h-2 overflow-hidden rounded-full">
        <div
          className="bg-info"
          style={{ width: `${(tablets / total) * 100}%` }}
        />
        <div
          className="bg-gold"
          style={{ width: `${(syrups / total) * 100}%` }}
        />
        <div
          className="bg-pitta"
          style={{ width: `${(powder / total) * 100}%` }}
        />
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-brown">Low Stock</span>
          <button type="button" className="text-xs font-medium text-gold hover:underline">
            View All
          </button>
        </div>
        <ul className="space-y-2">
          {lowStockItems.map((item) => (
            <li
              key={item.name}
              className="flex items-center justify-between gap-2 text-sm"
            >
              <span className="text-brown">
                {item.name}{' '}
                <span className="text-text-muted">| Qty: {item.quantity}</span>
              </span>
              <Button variant="outline" className="px-3 py-1 text-xs">
                Order
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
