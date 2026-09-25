import type { ComponentType } from 'react';
import { cn } from '@/lib/utils';

export interface NavGlyphProps {
  className?: string;
  fill?: string;
  strokeWidth?: string | number;
}

export type NavGlyph = ComponentType<NavGlyphProps>;

interface NavIconProps {
  icon: NavGlyph;
  active?: boolean;
  className?: string;
}

/** Closed medical plus — same path outline and filled. */
export function MedicalCross({ className, fill, strokeWidth }: NavGlyphProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9.5 3.5h5v5.5H20v5h-5.5V20h-5v-6H4v-5h5.5V3.5z" />
    </svg>
  );
}

/** Same glyph for both states — outline when idle, filled when selected. */
export function NavIcon({ icon: Icon, active = false, className }: NavIconProps) {
  return (
    <Icon
      className={cn(
        'h-[22px] w-[22px] shrink-0',
        active ? 'text-[#BE880B]' : 'text-brown',
        className,
      )}
      fill={active ? 'currentColor' : 'none'}
      strokeWidth={1.5}
    />
  );
}
