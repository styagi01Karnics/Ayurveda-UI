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
  variant = 'clinic',
}: BrandHeaderProps) {
  const isPlatform = variant === 'platform';

  return (
    <div
      className={cn(
        'flex flex-col gap-1',
        centered ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      <img
        src={isPlatform ? assets.karnicsLogo : assets.brandLogo}
        alt={isPlatform ? PLATFORM_BRANDING.name : 'Ganesha Ayurvedaa'}
        className="h-[78px] w-[78px] object-contain"
      />
      <h1 className="mt-1 font-serif text-base font-bold tracking-[0.08em] text-brown sm:text-[17px]">
        {isPlatform ? PLATFORM_BRANDING.name.toUpperCase() : 'GANESHA AYURVEDAA'}
      </h1>
      {!isPlatform ? (
        <p className="font-serif text-sm italic text-gold">A Journey of Healing</p>
      ) : null}
    </div>
  );
}
