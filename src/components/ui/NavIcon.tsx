import { cn } from '@/lib/utils';

interface NavIconProps {
  outline: string;
  filled: string;
  active?: boolean;
  className?: string;
}

/** Same path for both states — stroke when idle, fill when selected. */
function renderNavSvg(svg: string, filled: boolean): string {
  const cleaned = svg
    .replace(/\s(width|height)="100%"/g, '')
    .replace(/\spreserveAspectRatio="[^"]*"/g, '')
    .replace(/\sfill="[^"]*"/gi, '')
    .replace(/\sstroke="[^"]*"/gi, '')
    .replace(/\sstroke-width="[^"]*"/gi, '');

  if (filled) {
    return cleaned.replace(/<path\b/gi, '<path fill="currentColor"');
  }

  return cleaned.replace(
    /<path\b/gi,
    '<path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"',
  );
}

export function NavIcon({
  outline,
  filled,
  active = false,
  className,
}: NavIconProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex shrink-0 items-center justify-center [&_svg]:block [&_svg]:h-[22px] [&_svg]:w-[22px]',
        active ? 'text-[#BE880B]' : 'text-brown',
        className,
      )}
      dangerouslySetInnerHTML={{
        __html: renderNavSvg(filled || outline, active),
      }}
    />
  );
}
