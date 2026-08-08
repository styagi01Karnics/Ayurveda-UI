import { useState } from 'react';
import { X } from 'lucide-react';
import { BannerDisplay } from '@/components/banners/BannerDisplay';
import { useActiveBanner } from '@/hooks/useClinicBanners';

interface TopBannerProps {
  onClaimOffer?: () => void;
}

export function TopBanner({ onClaimOffer }: TopBannerProps) {
  const [visible, setVisible] = useState(true);
  const activeBanner = useActiveBanner();

  if (!visible || !activeBanner) return null;

  return (
    <div className="relative mx-4 mt-3 shrink-0 sm:mx-6">
      <BannerDisplay
        banner={activeBanner}
        variant="ribbon"
        className="pr-10"
        onCtaClick={onClaimOffer}
      />
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded p-1 text-brown-muted hover:bg-brown/10"
        aria-label="Close banner"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
