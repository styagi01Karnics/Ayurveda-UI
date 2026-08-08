import { Monitor, Smartphone } from 'lucide-react';
import { BannerDisplay } from '@/components/banners/BannerDisplay';
import { assets } from '@/lib/assets';
import type { ClinicBanner } from '@/lib/bannerStorage';
import { cn } from '@/lib/utils';

interface BannerPreviewFrameProps {
  banner: ClinicBanner;
  viewport: 'desktop' | 'mobile';
  onViewportChange: (viewport: 'desktop' | 'mobile') => void;
}

export function BannerPreviewFrame({
  banner,
  viewport,
  onViewportChange,
}: BannerPreviewFrameProps) {
  return (
    <div className="relative">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
            Live Preview
          </p>
          <p className="font-serif text-lg text-brown">How patients see your banner</p>
        </div>
        <div className="flex rounded-xl border border-[#ebe4d8] bg-cream/80 p-1">
          <button
            type="button"
            onClick={() => onViewportChange('desktop')}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition',
              viewport === 'desktop'
                ? 'bg-white text-brown shadow-sm'
                : 'text-text-muted hover:text-brown',
            )}
          >
            <Monitor className="h-3.5 w-3.5" />
            Desktop
          </button>
          <button
            type="button"
            onClick={() => onViewportChange('mobile')}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition',
              viewport === 'mobile'
                ? 'bg-white text-brown shadow-sm'
                : 'text-text-muted hover:text-brown',
            )}
          >
            <Smartphone className="h-3.5 w-3.5" />
            Mobile
          </button>
        </div>
      </div>

      <div
        className={cn(
          'mx-auto overflow-hidden rounded-[28px] border border-[#e8dfd0] bg-[#faf7f2] shadow-[0_30px_80px_rgba(66,44,35,0.12)] transition-all duration-300',
          viewport === 'mobile' ? 'max-w-[320px]' : 'w-full',
        )}
      >
        <div className="flex items-center gap-2 border-b border-[#efe8dc] bg-white/80 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f4b9b0]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f0d89a]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#b8d4b0]" />
          <span className="ml-2 text-[10px] text-text-muted">Ganesha Ayurvedaa — Dashboard</span>
        </div>

        <div className="flex min-h-[360px]">
          {viewport === 'desktop' && (
            <div
              className="hidden w-[88px] shrink-0 border-r border-[#efe8dc] sm:block"
              style={{
                backgroundImage: `linear-gradient(rgba(242,235,225,0.92), rgba(242,235,225,0.92)), url(${assets.sidebarBg})`,
                backgroundSize: 'cover',
              }}
            />
          )}

          <div className="min-w-0 flex-1 p-3 sm:p-4">
            <div className="mb-3">
              <BannerDisplay banner={banner} variant="ribbon" />
            </div>

            <div className="mb-3 rounded-xl border border-[#efe8dc] bg-white px-4 py-3">
              <div className="h-2 w-24 rounded bg-brown/10" />
              <div className="mt-3 h-2 w-full rounded bg-brown/5" />
              <div className="mt-2 h-2 w-4/5 rounded bg-brown/5" />
            </div>

            <BannerDisplay banner={banner} variant="card" className="mb-3" />

            <div className="grid grid-cols-2 gap-2">
              <div className="h-20 rounded-xl bg-white/80 ring-1 ring-[#efe8dc]" />
              <div className="h-20 rounded-xl bg-white/80 ring-1 ring-[#efe8dc]" />
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute -left-6 top-16 hidden h-28 w-28 rounded-full border border-gold/20 lg:block" />
      <div className="pointer-events-none absolute -right-4 bottom-8 hidden h-20 w-20 rounded-full bg-gold/10 blur-xl lg:block" />
    </div>
  );
}
