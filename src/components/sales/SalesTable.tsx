import { DataTableShell } from '@/components/ui/DataTableShell';
import { formatCurrency } from '@/lib/utils';
import type { SalesInvoiceRecord } from '@/types';

interface SalesTableProps {
  records: SalesInvoiceRecord[];
  embedded?: boolean;
}

export function SalesTable({ records, embedded }: SalesTableProps) {
  return (
    <DataTableShell embedded={embedded}>
      <table className="w-full table-fixed text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/80 text-xs text-text-muted">
            <th className="px-5 py-3 font-medium">Invoice No.</th>
            <th className="px-5 py-3 font-medium">Invoice Date</th>
            <th className="px-5 py-3 font-medium">Service Type</th>
            <th className="px-5 py-3 font-medium">Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-5 py-12 text-center text-text-muted">
                No sales records found matching your filters.
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr
                key={record.id}
                className="border-b border-gray-50 hover:bg-gray-50/50"
              >
                <td className="px-5 py-4 font-medium text-brown">
                  {record.invoiceId}
                </td>
                <td className="px-5 py-4 text-text-muted">
                  {record.invoiceDate}
                </td>
                <td className="px-5 py-4 font-medium text-gold">
                  {record.serviceType}
                </td>
                <td className="px-5 py-4 text-brown">
                  {formatCurrency(record.totalAmount)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </DataTableShell>
  );
}
