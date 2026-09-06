import { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { loadBillInvoiceView } from '@/lib/api/loadBillInvoice';
import { assets } from '@/lib/assets';
import { resolveErrorMessage, UI_MESSAGES } from '@/lib/uiMessages';
import { cn, formatCurrency } from '@/lib/utils';
import type { BillInvoiceView } from '@/types';

interface BillInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  invoiceId: string | null;
}

export function BillInvoiceModal({ open, onClose, invoiceId }: BillInvoiceModalProps) {
  const [bill, setBill] = useState<BillInvoiceView | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !invoiceId) {
      setBill(null);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setBill(null);

    loadBillInvoiceView(invoiceId)
      .then((view) => {
        if (!cancelled) {
          setBill(view);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(resolveErrorMessage(err, UI_MESSAGES.error.loadFailed));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, invoiceId]);

  if (!open) return null;

  const invoice = bill?.invoice;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto p-4 sm:p-8">
      <button
        type="button"
        className="fixed inset-0 bg-black/45"
        onClick={onClose}
        aria-label="Close bill preview"
      />

      <div className="relative z-10 my-2 w-full max-w-4xl rounded-2xl bg-white shadow-2xl print:shadow-none">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-lg p-1.5 text-text-muted hover:bg-brown/5 print:hidden"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6 sm:p-8 md:p-10">
          {loading && (
            <div className="py-20 text-center text-sm text-text-muted">
              {UI_MESSAGES.loading}
            </div>
          )}

          {!loading && error && (
            <div className="space-y-4 py-16 text-center">
              <p className="text-sm text-danger">{error}</p>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          )}

          {!loading && !error && bill && invoice && (
            <div className="space-y-6 text-sm text-brown">
              <div className="flex flex-wrap items-start justify-between gap-6 border-b border-[#ece5da] pb-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gold">
                    <img
                      src={assets.brandLogo}
                      alt=""
                      className="h-9 w-9 object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-serif text-base font-bold tracking-wide text-brown">
                      {invoice.clinicName}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                      GST No. : {invoice.gstNo}
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs leading-relaxed text-text-muted">
                  <p className="font-semibold text-brown">{invoice.doctorName}</p>
                  <p>{invoice.doctorCredentials}</p>
                  <p>{invoice.workingHours}</p>
                  <p>{invoice.doctorPhone}</p>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div className="space-y-1 text-xs">
                  <p>
                    <span className="text-text-muted">Patient Code : </span>
                    <span className="font-semibold text-brown">{bill.patientId}</span>
                  </p>
                  <p>
                    <span className="text-text-muted">Patient Name : </span>
                    <span className="font-semibold text-brown">{bill.patientName}</span>
                  </p>
                  <p>
                    <span className="text-text-muted">Contact No. : </span>
                    <span className="font-semibold text-brown">{bill.contactNumber}</span>
                  </p>
                </div>

                <div className="rounded-xl border-2 border-[#d9c4a0] bg-[#faf6ee] px-4 py-3 text-center text-xs">
                  <p>
                    <span className="text-text-muted">Invoice No. : </span>
                    <span className="font-semibold text-brown">{invoice.invoiceNo}</span>
                  </p>
                  <p className="mt-2">
                    <span className="text-text-muted">Date : </span>
                    <span className="font-semibold text-brown">{invoice.invoiceDate}</span>
                  </p>
                  <p className="mt-2">
                    <span className="text-text-muted">Payment Mode : </span>
                    <span className="font-semibold text-brown">{invoice.paymentMode}</span>
                  </p>
                  <p className="mt-2 font-bold text-gold">
                    Amount Due : {formatCurrency(invoice.amountDue)}
                  </p>
                </div>

                <div className="text-right text-xs leading-relaxed text-text-muted">
                  <p className="font-semibold uppercase tracking-wide text-brown">
                    Consultant
                  </p>
                  <p className="mt-1 font-semibold text-brown">{invoice.doctorName}</p>
                  <p>{invoice.doctorCredentials}</p>
                  <p>{invoice.doctorPhone}</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-[#ece5da]">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-[#faf6ee] text-xs font-semibold uppercase tracking-wide text-gold">
                      <th className="px-4 py-3">Item Detail</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-8 text-center text-text-muted"
                        >
                          No line items on this invoice.
                        </td>
                      </tr>
                    ) : (
                      invoice.items.map((item, index) => (
                        <tr
                          key={`${item.detail}-${index}`}
                          className="border-t border-[#f3ede3]"
                        >
                          <td className="px-4 py-3 font-medium text-brown">
                            {item.detail}
                          </td>
                          <td className="px-4 py-3 text-text-muted">
                            {item.description}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-brown">
                            {formatCurrency(item.amount)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-6 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-sm font-semibold text-brown">Notes</p>
                  <div className="mt-2 min-h-[72px] rounded-lg border border-[#ece5da] bg-[#faf8f4] px-3 py-2 text-xs text-text-muted">
                    {invoice.notes || '—'}
                  </div>
                </div>

                <div className="w-full min-w-[220px] space-y-2 text-sm md:w-56">
                  <SummaryRow label="Subtotal" value={formatCurrency(invoice.subtotal)} />
                  <SummaryRow
                    label="CGST"
                    value={`+${formatCurrency(invoice.cgst)}`}
                  />
                  <SummaryRow
                    label="SGST"
                    value={`+${formatCurrency(invoice.sgst)}`}
                  />
                  <SummaryRow
                    label="Discount"
                    value={`-${formatCurrency(invoice.discount)}`}
                    valueClassName="text-success"
                  />
                  <div className="flex items-center justify-between border-t border-[#ece5da] pt-3 text-base font-bold">
                    <span className="text-brown">Total</span>
                    <span className="text-gold">{formatCurrency(invoice.total)}</span>
                  </div>
                </div>
              </div>

              <p className="text-center text-[10px] font-medium uppercase leading-relaxed tracking-wide text-gold">
                {invoice.conditions}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-[#ece5da] pt-4 text-[11px] text-text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  {invoice.address}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  {invoice.email}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  {invoice.website}
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2 print:hidden">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button onClick={() => window.print()}>Download PDF</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-text-muted">{label}</span>
      <span className={cn('font-medium text-brown', valueClassName)}>{value}</span>
    </div>
  );
}
