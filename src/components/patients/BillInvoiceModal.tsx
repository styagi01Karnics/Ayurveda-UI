import { Leaf, Mail, MapPin, Phone } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import type { PatientDetail } from '@/types';

interface BillInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  patient: PatientDetail | null;
}

export function BillInvoiceModal({ open, onClose, patient }: BillInvoiceModalProps) {
  if (!patient) return null;

  const { invoice, name, id, phone } = patient;

  return (
    <Modal open={open} onClose={onClose} title="" size="xl" className="max-w-3xl">
      <div className="space-y-5 text-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold">
              <Leaf className="h-5 w-5 text-white" />
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
            <p className="text-xs font-semibold uppercase text-text-muted">Patient Details</p>
            <p className="mt-1 font-semibold text-brown">{name}</p>
            <p className="text-text-muted">{id}</p>
            <p className="text-text-muted">{phone}</p>
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
            {invoice.items.map((item) => (
              <tr key={item.detail} className="border-b border-gray-50">
                <td className="py-2.5 text-brown">{item.detail}</td>
                <td className="py-2.5 text-text-muted">{item.description}</td>
                <td className="py-2.5 text-right text-brown">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
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
          <Button onClick={onClose}>Download PDF</Button>
        </div>
      </div>
    </Modal>
  );
}
