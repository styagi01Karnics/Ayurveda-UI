import { useEffect, useState } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { getInvoiceById } from '@/lib/api/billing';
import { mapInvoiceDtoToBillView } from '@/lib/api/mappers';
import { assets } from '@/lib/assets';
import { resolveErrorMessage, UI_MESSAGES } from '@/lib/uiMessages';
import { formatCurrency } from '@/lib/utils';
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

    getInvoiceById(invoiceId)
      .then((dto) => {
        if (!cancelled) {
          setBill(mapInvoiceDtoToBillView(dto));
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
    <Modal open={open} onClose={onClose} title="" size="xl" className="max-w-3xl">
      {loading && (
        <div className="py-16 text-center text-sm text-text-muted">
          {UI_MESSAGES.loading}
        </div>
      )}

      {!loading && error && (
        <div className="space-y-4 py-10 text-center">
          <p className="text-sm text-danger">{error}</p>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      )}

      {!loading && !error && bill && invoice && (
        <div className="space-y-5 text-sm">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gold">
                <img src={assets.brandLogo} alt="" className="h-8 w-8 object-contain" />
              </div>
              <div>
                <p className="font-bold text-brown">{invoice.clinicName}</p>
                <p className="text-xs text-text-muted">GST No. : {invoice.gstNo}</p>
              </div>
            </div>
            <div className="text-right text-xs">
              <p className="font-semibold text-brown">{invoice.doctorName}</p>
              <p className="text-text-muted">{invoice.doctorCredentials}</p>
              <p className="text-text-muted">{invoice.workingHours}</p>
              <p className="text-text-muted">{invoice.doctorPhone}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-xs font-semibold uppercase text-text-muted">
                Patient Details
              </p>
              <p className="mt-1 font-semibold text-brown">{bill.patientName}</p>
              <p className="text-text-muted">{bill.patientId}</p>
              <p className="text-text-muted">{bill.contactNumber}</p>
            </div>
            <div className="rounded-xl border-2 border-gold/40 p-3 text-center">
              <p className="text-xs text-text-muted">Invoice No.</p>
              <p className="font-semibold text-brown">{invoice.invoiceNo}</p>
              <p className="mt-2 text-xs text-text-muted">Date: {invoice.invoiceDate}</p>
              <p className="text-xs text-text-muted">Payment: {invoice.paymentMode}</p>
              <p className="mt-1 font-bold text-gold">
                Amount Due: {formatCurrency(invoice.amountDue)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold uppercase text-text-muted">Consultant</p>
              <p className="mt-1 font-semibold text-brown">{invoice.doctorName}</p>
              <p className="text-text-muted">{invoice.doctorCredentials}</p>
              <p className="text-text-muted">{invoice.doctorPhone}</p>
            </div>
          </div>

          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-text-muted">
                <th className="py-2 font-medium">Item Detail</th>
                <th className="py-2 font-medium">Description</th>
                <th className="py-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-text-muted">
                    No line items on this invoice.
                  </td>
                </tr>
              ) : (
                invoice.items.map((item, index) => (
                  <tr key={`${item.detail}-${index}`} className="border-b border-gray-50">
                    <td className="py-2.5 text-brown">{item.detail}</td>
                    <td className="py-2.5 text-text-muted">{item.description}</td>
                    <td className="py-2.5 text-right text-brown">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-56 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Subtotal</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">CGST</span>
                <span>+{formatCurrency(invoice.cgst)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">SGST</span>
                <span>+{formatCurrency(invoice.sgst)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Discount</span>
                <span>-{formatCurrency(invoice.discount)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-bold">
                <span className="text-brown">Total</span>
                <span className="text-gold">{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>

          <p className="text-center text-[10px] text-text-muted">{invoice.conditions}</p>

          <div className="flex flex-wrap items-center justify-center gap-4 border-t border-gray-100 pt-3 text-xs text-text-muted">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {invoice.address}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {invoice.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3 w-3" />
              {invoice.website}
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => window.print()}>Download PDF</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
