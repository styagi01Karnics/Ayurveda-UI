import { Download } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn, formatCurrency } from '@/lib/utils';
import type { BillingRecord } from '@/types';

interface BillingTableProps {
  records: BillingRecord[];
  onDownload: (record: BillingRecord) => void;
}

export function BillingTable({ records, onDownload }: BillingTableProps) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs text-text-muted">
              <th className="px-5 py-3 font-medium">Invoice ID</th>
              <th className="px-5 py-3 font-medium">Patient ID</th>
              <th className="px-5 py-3 font-medium">Invoice Date</th>
              <th className="px-5 py-3 font-medium">Total Amount</th>
              <th className="px-5 py-3 font-medium">Paid Amount</th>
              <th className="px-5 py-3 font-medium">Left Amount</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Bill</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-12 text-center text-text-muted">
                  No billing records found matching your filters.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-4 font-medium text-brown">
                    {record.invoiceId}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-brown">{record.patientId}</p>
                    <p className="text-xs text-text-muted">
                      {record.secondaryPatientId}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-brown">{record.invoiceDate}</td>
                  <td className="px-5 py-4 text-brown">
                    {formatCurrency(record.totalAmount)}
                  </td>
                  <td className="px-5 py-4 text-brown">
                    {formatCurrency(record.paidAmount)}
                  </td>
                  <td className="px-5 py-4 text-brown">
                    {formatCurrency(record.leftAmount)}
                  </td>
                  <td className="px-5 py-4">
                    <BillingStatus status={record.status} />
                  </td>
                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() => onDownload(record)}
                      className="rounded-lg border border-gray-200 bg-cream p-2 text-gold hover:bg-gold/10"
                      aria-label="Download bill"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function BillingStatus({ status }: { status: BillingRecord['status'] }) {
  return (
    <span
      className={cn(
        'font-medium',
        status === 'Ongoing' ? 'text-gold' : 'text-success',
      )}
    >
      {status}
    </span>
  );
}
