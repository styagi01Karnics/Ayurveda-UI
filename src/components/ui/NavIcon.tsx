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
    .replace(/fill="#[^"]*"/gi, 'fill="currentColor"')
    .replace(/stroke="var\([^"]*\)"/gi, 'stroke="currentColor"')
    .replace(/stroke="#[^"]*"/gi, 'stroke="currentColor"');
}

/** Sidebar nav icon — same outline glyph for active and inactive; only color changes. */
export function NavIcon({
  outline,
  active = false,
  className,
}: NavIconProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center [&_svg]:block [&_svg]:h-[22px] [&_svg]:w-[22px]',
        active ? 'text-gold' : 'text-brown',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: colorizeSvg(outline) }}
    />
  );
}
