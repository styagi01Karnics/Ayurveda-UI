import { cn } from '@/lib/utils';

interface AppIconProps {
  src: string;
  alt?: string;
  className?: string;
  active?: boolean;
}

export function AppIcon({
  src,
  alt = '',
  className,
  active = false,
}: AppIconProps) {
  return (
    <img
      src={src}
      alt={alt}
      aria-hidden={!alt}
      className={cn(
        'shrink-0 object-contain',
        active ? 'opacity-100' : 'opacity-75',
        className,
      )}
    />
  );
}
