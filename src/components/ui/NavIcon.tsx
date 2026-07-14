import { cn } from '@/lib/utils';

interface NavIconProps {
  outline: string;
  filled: string;
  active?: boolean;
  className?: string;
}

function colorizeSvg(svg: string): string {
  return svg
    .replace(/\s(width|height)="100%"/g, '')
    .replace(/\spreserveAspectRatio="[^"]*"/g, '')
    .replace(/fill="var\([^"]*\)"/gi, 'fill="currentColor"')
    .replace(/fill="#[^"]*"/gi, 'fill="currentColor"');
}

/** Sidebar nav icon — outline when inactive, filled when active (gold / brown). */
export function NavIcon({
  outline,
  filled,
  active = false,
  className,
}: NavIconProps) {
  const svg = active ? filled : outline;

  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center [&_svg]:block [&_svg]:h-[22px] [&_svg]:w-[22px]',
        active ? 'text-gold' : 'text-brown',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: colorizeSvg(svg) }}
    />
  );
}
