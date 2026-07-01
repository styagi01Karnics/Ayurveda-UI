import { useState } from 'react';
import { X } from 'lucide-react';

interface TopBannerProps {
  onClaimOffer?: () => void;
}

export function TopBanner({ onClaimOffer }: TopBannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="flex items-center justify-between gap-4 bg-gold/20 px-4 py-2 text-xs text-brown sm:px-6 sm:text-sm">
      <p className="min-w-0 flex-1 truncate text-center sm:text-left">
        Get Up to 50% Off on Ayurvedic Medicines & Wellness Products{' '}
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
        className="shrink-0 rounded p-1 hover:bg-brown/10"
        aria-label="Close banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
