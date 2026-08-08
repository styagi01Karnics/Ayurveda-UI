import { Sparkles } from 'lucide-react';
import { BANNER_ACCENT_STYLES, type ClinicBanner } from '@/lib/bannerStorage';
import { cn } from '@/lib/utils';

interface BannerDisplayProps {
  banner: ClinicBanner;
  variant?: 'ribbon' | 'card' | 'compact';
  className?: string;
  onCtaClick?: () => void;
}

export function BannerDisplay({
  banner,
  variant = 'ribbon',
  className,
  onCtaClick,
}: BannerDisplayProps) {
  const accent = BANNER_ACCENT_STYLES[banner.accent];
  const layout = variant === 'ribbon' ? banner.layout : variant === 'card' ? 'split' : 'minimal';

  if (layout === 'split') {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border border-white/60 bg-gradient-to-br p-5 shadow-[0_20px_50px_rgba(66,44,35,0.08)] ring-1',
          accent.gradient,
          accent.ring,
          className,
        )}
      >
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/30 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 left-8 h-24 w-24 rounded-full border border-white/40" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl space-y-2">
            {banner.badge && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                  accent.badge,
                )}
              >
                <Sparkles className="h-3 w-3" />
                {banner.badge}
              </span>
            )}
            <p className="font-serif text-xl font-semibold leading-snug text-brown sm:text-2xl">
              {banner.headline || 'Your headline appears here'}
            </p>
            {banner.subtext && (
              <p className="text-sm leading-relaxed text-brown-muted">{banner.subtext}</p>
            )}
          </div>
          {banner.ctaLabel && (
            <button
              type="button"
              onClick={onCtaClick}
              className={cn(
                'shrink-0 rounded-xl bg-brown px-5 py-2.5 text-sm font-semibold text-cream transition hover:bg-brown/90',
              )}
            >
              {banner.ctaLabel}
            </button>
          )}
        </div>
      </div>
    );
  }

  if (layout === 'minimal') {
    return (
      <div
        className={cn(
          'flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#ebe4d8] px-4 py-3',
          `bg-gradient-to-r ${accent.gradient}`,
          className,
        )}
      >
        <p className="text-sm text-brown">
          <span className="font-semibold">{banner.headline || 'Banner headline'}</span>
          {banner.subtext ? (
            <span className="text-brown-muted"> — {banner.subtext}</span>
          ) : null}
        </p>
        {banner.ctaLabel && (
          <button
            type="button"
            onClick={onCtaClick}
            className={cn('text-sm font-semibold hover:underline', accent.text)}
          >
            {banner.ctaLabel} →
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 rounded-[10px] border border-[#ebe4d8] px-4 py-2.5',
        `bg-gradient-to-r ${accent.gradient}`,
        className,
      )}
    >
      <p className="flex-1 text-center text-xs text-brown sm:text-sm">
        {banner.headline || 'Your promotional message'}{' '}
        {banner.ctaLabel && (
          <button
            type="button"
            onClick={onCtaClick}
            className={cn('font-semibold hover:underline', accent.text)}
          >
            → {banner.ctaLabel}
          </button>
        )}
      </p>
    </div>
  );
}
