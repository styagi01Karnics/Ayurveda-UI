import { useState } from 'react';
import { Gift, Tag, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { cn } from '@/lib/utils';

interface RedeemCouponModalProps {
  open: boolean;
  onClose: () => void;
}

const couponTabs = [
  { id: 'dietician', label: 'Dietician' },
  { id: 'therapy', label: 'Therapy' },
  { id: 'consultation', label: 'Consultation' },
] as const;

export function RedeemCouponModal({ open, onClose }: RedeemCouponModalProps) {
  const [activeTab, setActiveTab] = useState<string>('dietician');
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [applied, setApplied] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded p-1 text-text-muted hover:bg-brown/5"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
            <Gift className="h-6 w-6 text-gold" />
          </div>
        </div>

        <Tabs
          tabs={couponTabs.map((t) => ({ id: t.id, label: t.label }))}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-4"
        />

        <div className="rounded-xl border border-gold/30 bg-cream-light p-4">
          <div className="flex items-start gap-3">
            <Tag className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-brown">Flat 5% off</p>
              <p className="text-sm text-gold">Save ₹64 on {activeTab} visit</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="rounded-full border border-dashed border-gold px-3 py-1 text-xs font-semibold tracking-wider text-brown">
                  FIRST TIME
                </span>
                <button
                  type="button"
                  onClick={() => setApplied(true)}
                  className={cn(
                    'rounded-lg px-3 py-1 text-xs font-bold',
                    applied
                      ? 'bg-success/15 text-success'
                      : 'bg-gold text-white hover:bg-gold-dark',
                  )}
                >
                  {applied ? 'APPLIED' : 'APPLY'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setDetailsOpen((v) => !v)}
                className="mt-2 text-xs text-text-muted hover:text-brown"
              >
                {detailsOpen ? '▼' : '▶'} View Details
              </button>
              {detailsOpen && (
                <ul className="mt-2 space-y-1 text-xs text-text-muted">
                  <li>• Flat 5% off on the total order value</li>
                  <li>• Applicable only on your first order</li>
                  <li>• Applicable once per user</li>
                </ul>
              )}
            </div>
          </div>
        </div>

        <Button fullWidth className="mt-5" onClick={onClose}>
          Redeem Coupon
        </Button>
      </div>
    </div>
  );
}
