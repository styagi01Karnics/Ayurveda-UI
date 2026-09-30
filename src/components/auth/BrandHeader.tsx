import { cn } from '@/lib/utils';
import { assets } from '@/lib/assets';

interface BrandHeaderProps {
  className?: string;
  centered?: boolean;
}

export function BrandHeader({
  className,
  centered = true,
}: BrandHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5',
        centered ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      <img
        src={assets.brandLogo}
        alt="Ganesha Ayurvedaa"
        className="h-[72px] w-[72px] object-contain"
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
