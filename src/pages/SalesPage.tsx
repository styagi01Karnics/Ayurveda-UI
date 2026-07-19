import { useMemo, useState } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { SalesStatCards } from '@/components/sales/SalesStatCards';
import { SalesTable } from '@/components/sales/SalesTable';
import { FilterControl, ListPanel } from '@/components/ui/ListPanel';
import { Select } from '@/components/ui/Select';
import {
  SALES_FILTER_OPTIONS,
  salesInvoices,
  salesStats,
} from '@/data/mock/sales';

export function SalesPage() {
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filteredInvoices = useMemo(() => {
    return salesInvoices.filter((invoice) => {
      const matchesServiceType =
        !serviceTypeFilter || invoice.serviceType === serviceTypeFilter;
      const matchesDate = !dateFilter || invoice.invoiceDate === dateFilter;
      return matchesServiceType && matchesDate;
    });
  }, [serviceTypeFilter, dateFilter]);

  return (
    <PageShell className="space-y-4">
      <SalesStatCards stats={salesStats} />

      <ListPanel
        filters={
          <>
            <FilterControl>
              <Select
                placeholder="Service type"
                options={[...SALES_FILTER_OPTIONS.serviceType]}
                value={serviceTypeFilter}
                onChange={(e) => setServiceTypeFilter(e.target.value)}
              />
            </FilterControl>
            <FilterControl>
              <div className="relative">
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-brown focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                />
                {!dateFilter && (
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    Date Created
                  </span>
                )}
              </div>
            </FilterControl>
          </>
        }
      >
        <SalesTable embedded records={filteredInvoices} />
      </ListPanel>
    </PageShell>
  );
}
