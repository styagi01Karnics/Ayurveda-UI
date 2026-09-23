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
        'flex flex-col gap-1.5',
        centered ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      <img
        src={isPlatform ? assets.karnicsLogo : assets.brandLogo}
        alt={isPlatform ? PLATFORM_BRANDING.name : 'Ganesha Ayurvedaa'}
        className="h-16 w-16 object-contain"
      />
      <h1 className="font-sans text-[18.8px] font-semibold leading-none tracking-normal text-[#422C23] normal-case">
        {isPlatform ? PLATFORM_BRANDING.name.toUpperCase() : 'GANESHA AYURVEDAA'}
      </h1>
      {!isPlatform ? (
        <p className="font-sans text-[12px] font-semibold leading-none tracking-normal text-[#BE880B] normal-case">
          A Journey of Healing
        </p>
      ) : null}
    </div>
  );
}
