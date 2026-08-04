import { useMemo, useState } from 'react';
import { PageShell } from '@/components/layout/PageShell';
import { SalesStatCards } from '@/components/sales/SalesStatCards';
import { SalesTable } from '@/components/sales/SalesTable';
import { AsyncStatus } from '@/components/ui/AsyncStatus';
import { FilterControl, ListPanel } from '@/components/ui/ListPanel';
import { Select } from '@/components/ui/Select';
import { SALES_FILTER_OPTIONS } from '@/data/mock/sales';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getSales } from '@/lib/api/billing';
import { mapSalesDtoToRecord } from '@/lib/api/mappers';
import type { SalesInvoiceRecord, SalesStats } from '@/types';

const EMPTY_STATS: SalesStats = {
  totalPatients: 0,
  patientsCompleted: 0,
  patientsOngoing: 0,
  appointmentsThisMonth: 0,
  appointmentsCompleted: 0,
  appointmentsOngoing: 0,
  revenueThisMonth: 0,
  revenuePeriod: 'This month',
  completedTreatments: 0,
};

function formatRevenuePeriod(from: string, to: string): string {
  if (!from || !to) return 'This month';
  const format = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };
  return `From ${format(from)} - ${format(to)}`;
}

export function SalesPage() {
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const { data, loading, error, reload } = useAsyncData(
    async () => {
      const salesResponse = await getSales({
        serviceType: serviceTypeFilter || undefined,
        dateCreated: dateFilter || undefined,
      });

      const invoices = salesResponse.sales.map(mapSalesDtoToRecord);
      const stats: SalesStats = {
        ...EMPTY_STATS,
        revenueThisMonth: salesResponse.revenueThisMonth,
        revenuePeriod: formatRevenuePeriod(
          salesResponse.revenueFrom,
          salesResponse.revenueTo,
        ),
        appointmentsThisMonth: invoices.length,
      };

      return { invoices, stats };
    },
    { invoices: [] as SalesInvoiceRecord[], stats: EMPTY_STATS },
    [serviceTypeFilter, dateFilter],
  );
  const filteredInvoices = useMemo(() => {
    return data.invoices.filter((invoice) => {
      const matchesServiceType =
        !serviceTypeFilter || invoice.serviceType === serviceTypeFilter;
      const matchesDate = !dateFilter || invoice.invoiceDate.includes(dateFilter);
      return matchesServiceType && matchesDate;
    });
  }, [data.invoices, serviceTypeFilter, dateFilter]);

  return (
    <PageShell className="space-y-4">
      <SalesStatCards stats={data.stats} />

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
        <AsyncStatus
          loading={loading}
          error={error}
          onRetry={reload}
          empty={!loading && !error && filteredInvoices.length === 0}
          emptyMessage="No sales records found."
        >
          <SalesTable embedded records={filteredInvoices} />
        </AsyncStatus>
      </ListPanel>
    </PageShell>
  );
}
