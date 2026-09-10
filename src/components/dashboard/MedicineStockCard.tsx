import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { DashDivider } from '@/components/dashboard/DashboardPrimitives';
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
  viewAllTo?: string;
}

function CategoryChip({ count, label }: { count: number; label: string }) {
  return (
    <div className="min-w-[58px] rounded-lg bg-[#fff8ee] px-2.5 py-1.5 text-center">
      <p className="text-sm font-bold leading-tight text-brown">{count}</p>
      <p className="text-[10px] leading-tight text-text-muted">{label}</p>
    </div>
  );
}

export function MedicineStockCard({
  totalStock,
  tablets,
  syrups,
  powder,
  lowStockItems,
  inStockPct = 0,
  outOfStockPct = 0,
  lowStockPct = 0,
  viewAllTo = '/medicines',
}: MedicineStockCardProps) {
  const hasStatus = inStockPct + outOfStockPct + lowStockPct > 0;

  return (
    <Card className="dashboard-card flex h-full flex-col p-5">
      <h3 className="text-[15px] font-medium text-text-muted">
        Medicine Stock Availability
      </h3>

      <div className="mt-3 flex items-start justify-between gap-3">
        <p className="text-[32px] font-bold leading-none tracking-tight text-brown">
          {totalStock}
        </p>
        <div className="flex shrink-0 gap-1.5 sm:gap-2">
          <CategoryChip count={tablets} label="Tablets" />
          <CategoryChip count={syrups} label="Syrups" />
          <CategoryChip count={powder} label="Powder" />
        </div>
      </div>

      <div className="mt-4 flex h-2.5 gap-0.5 overflow-hidden rounded-full">
        {hasStatus ? (
          <>
            {inStockPct > 0 && (
              <div
                className="rounded-full bg-stock-in"
                style={{ width: `${inStockPct}%` }}
              />
            )}
            {outOfStockPct > 0 && (
              <div
                className="rounded-full bg-stock-out"
                style={{ width: `${outOfStockPct}%` }}
              />
            )}
            {lowStockPct > 0 && (
              <div
                className="rounded-full bg-stock-low"
                style={{ width: `${lowStockPct}%` }}
              />
            )}
          </>
        ) : (
          <div className="w-full rounded-full bg-[#ebe4d8]" />
        )}
      </div>

      <div className="mt-2.5 flex flex-wrap gap-3 text-[11px] text-text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-[2px] bg-stock-in" />
          In Stock
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-[2px] bg-stock-out" />
          Out of Stock
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-[2px] bg-stock-low" />
          Low Stock
        </span>
      </div>

      <DashDivider className="my-3" />

      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-brown">Low Stock</span>
          <Link to={viewAllTo} className="text-xs font-medium text-gold underline">
            View All
          </Link>
        </div>
        {lowStockItems.length === 0 ? (
          <p className="rounded-xl bg-[#fffbf2] px-3 py-3 text-sm text-text-muted">
            No low stock items
          </p>
        ) : (
          <ul className="space-y-2">
            {lowStockItems.slice(0, 2).map((item) => (
              <li
                key={item.name}
                className="flex items-center justify-between gap-2 rounded-xl bg-[#fffbf2] px-3 py-2.5"
              >
                <span className="truncate text-sm font-medium text-brown">
                  {item.name}
                </span>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm text-text-muted">
                    Qty: {item.quantity}
                  </span>
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
        )}
      </div>
    </Card>
  );
}
