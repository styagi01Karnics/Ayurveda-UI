import { useState } from 'react';
import { X } from 'lucide-react';

interface TopBannerProps {
  onClaimOffer?: () => void;
}

export function TopBanner({ onClaimOffer }: TopBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="mx-4 mt-3 flex shrink-0 items-center justify-between gap-3 rounded-[10px] border border-[#ebe4d8] bg-[#f3e8d4] px-4 py-2.5 opacity-100 sm:mx-6 sm:px-6">
      <p className="flex-1 text-center text-xs text-brown sm:text-sm">
        Get Up to 50% Off on Ayurvedic Medicines &amp; Wellness Products{' '}
        <button
          type="button"
          onClick={onClaimOffer}
          className="font-semibold text-gold hover:underline"
        >
          → Claim Offer
        </button>
      </p>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="shrink-0 rounded p-1 text-brown-muted hover:bg-brown/10"
        aria-label="Close banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
