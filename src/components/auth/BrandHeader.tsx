import { cn } from '@/lib/utils';
import { assets } from '@/lib/assets';
import { PLATFORM_BRANDING } from '@/lib/platformBranding';

interface BrandHeaderProps {
  className?: string;
  centered?: boolean;
  /** Platform (Super Admin) branding vs clinic branding. */
  variant?: 'clinic' | 'platform';
}

export function BrandHeader({
  className,
  centered = true,
}: BrandHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2',
        centered ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      <img
        src={isPlatform ? assets.karnicsLogo : assets.brandLogo}
        alt={isPlatform ? PLATFORM_BRANDING.name : 'Ganesha Ayurvedaa'}
        className="h-16 w-16 object-contain"
      />
      <p className="font-sans text-base font-semibold leading-none tracking-normal text-brown">
        GANESHA AYURVEDAA
      </p>
      <p className="font-sans text-xs font-semibold leading-none tracking-normal text-[#BE880B]">
        A Journey of Healing
      </p>
    </div>
  );
}
