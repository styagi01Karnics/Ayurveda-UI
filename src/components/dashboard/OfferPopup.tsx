import { X } from 'lucide-react';

interface OfferPopupProps {
  open: boolean;
  onClose: () => void;
  onClaimOffer: () => void;
}

export function OfferPopup({ open, onClose, onClaimOffer }: OfferPopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-brown/30"
        onClick={onClose}
        aria-label="Close offer"
      />
      <div
        className="relative z-10 w-full max-w-xl rounded-2xl border border-gold/25 bg-cream px-6 py-5 text-center shadow-[0_12px_40px_rgba(66,44,35,0.12)]"
        role="dialog"
        aria-labelledby="offer-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-brown-muted hover:bg-brown/5"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <p id="offer-title" className="pr-6 text-sm text-brown sm:text-base">
          Get Up to 50% Off on Ayurvedic Medicines &amp; Wellness Products{' '}
          <button
            type="button"
            onClick={() => {
              onClose();
              onClaimOffer();
            }}
            className="font-semibold text-gold hover:underline"
          >
            → Claim Offer
          </button>
        </p>
      </div>
    </div>
  );
}
