import { cn } from '@/lib/utils';

interface BrandHeaderProps {
  className?: string;
  centered?: boolean;
}

export function BrandHeader({ className, centered = true }: BrandHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5',
        centered ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      <img
        src="/assets/brand-logo.png"
        alt="Ganesha Ayurvedaa"
        className="h-[72px] w-[72px] object-contain"
      />
      <h1 className="text-[15px] font-semibold tracking-[0.12em] text-brown">
        GANESHA AYURVEDAA
      </h1>
      <p className="font-serif text-[13px] italic text-gold">A Journey of Healing</p>
    </div>
  );
}
