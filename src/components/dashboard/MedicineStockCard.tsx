import { Card } from '@/components/ui/Card';
import {
  CategoryChip,
  DashDivider,
} from '@/components/dashboard/DashboardPrimitives';
import type { LowStockItem } from '@/types';

interface MedicineStockCardProps {
  totalStock: number;
  tablets: number;
  syrups: number;
  powder: number;
  lowStockItems: LowStockItem[];
  inStockPct?: number;
  outOfStockPct?: number;
  lowStockPct?: number;
}

export function MedicineStockCard({
  totalStock,
  tablets,
  syrups,
  powder,
  lowStockItems,
  inStockPct = 68,
  outOfStockPct = 24,
  lowStockPct = 8,
}: MedicineStockCardProps) {
  return (
    <Card className="dashboard-card">
      <h3 className="text-sm font-medium text-text-muted">
        Medicine Stock Availability
      </h3>

      <div className="mt-2 flex items-start justify-between gap-3">
        <p className="text-2xl font-bold text-brown lg:text-[28px]">{totalStock}</p>
        <div className="flex shrink-0 gap-1.5 sm:gap-2">
          <CategoryChip count={tablets} label="Tablets" />
          <CategoryChip count={syrups} label="Syrups" />
          <CategoryChip count={powder} label="Powder" />
        </div>
      </div>

      <div className="mt-4 flex h-2 overflow-hidden rounded-full">
        <div className="bg-stock-in" style={{ width: `${inStockPct}%` }} />
        <div className="bg-stock-out" style={{ width: `${outOfStockPct}%` }} />
        <div className="bg-stock-low" style={{ width: `${lowStockPct}%` }} />
      </div>

      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-stock-in" />
          In Stock
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-stock-out" />
          Out of Stock
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm bg-stock-low" />
          Low Stock
        </span>
      </div>

      <DashDivider className="my-4" />

      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-brown">Low Stock</span>
          <button type="button" className="text-xs font-medium text-gold underline">
            View All
          </button>
        </div>
        <ul className="space-y-2">
          {lowStockItems.slice(0, 2).map((item) => (
            <li
              key={item.name}
              className="flex items-center justify-between gap-2 rounded-xl bg-[#fffbf2] px-3 py-2.5"
            >
              <span className="truncate text-sm text-brown">{item.name}</span>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-sm text-brown">Qty: {item.quantity}</span>
                <span className="h-4 w-px bg-[#e0d8cc]" aria-hidden />
                <button
                  type="button"
                  className="text-sm font-medium text-gold hover:underline"
                >
                  Order
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
