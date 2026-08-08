import { Check, Copy, Trash2 } from 'lucide-react';
import { BANNER_ACCENT_STYLES, type ClinicBanner } from '@/lib/bannerStorage';
import { UI_MESSAGES } from '@/lib/uiMessages';
import { cn } from '@/lib/utils';

interface BannerCollectionProps {
  banners: ClinicBanner[];
  selectedId: string | null;
  activeId: string | null;
  onSelect: (id: string) => void;
  onActivate: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function BannerCollection({
  banners,
  selectedId,
  activeId,
  onSelect,
  onActivate,
  onDuplicate,
  onDelete,
}: BannerCollectionProps) {
  if (banners.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[#e8dfd0] bg-cream/40 px-4 py-8 text-center text-sm text-text-muted">
        {UI_MESSAGES.empty.banners}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {banners.map((banner) => {
        const accent = BANNER_ACCENT_STYLES[banner.accent];
        const isSelected = banner.id === selectedId;
        const isActive = banner.id === activeId;

        return (
          <article
            key={banner.id}
            className={cn(
              'group relative overflow-hidden rounded-2xl border bg-white p-4 transition-all',
              isSelected
                ? 'border-gold shadow-[0_8px_30px_rgba(190,136,11,0.12)] ring-1 ring-gold/20'
                : 'border-[#f0ebe3] hover:border-gold/30',
            )}
          >
            <button
              type="button"
              onClick={() => onSelect(banner.id)}
              className="w-full text-left"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-medium text-brown">{banner.title}</h3>
                    {isActive && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-success">
                        <Check className="h-3 w-3" />
                        Live
                      </span>
                    )}
                    {banner.status === 'draft' && !isActive && (
                      <span className="rounded-full bg-brown/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-text-muted">
                    {banner.headline || 'No headline yet'}
                  </p>
                </div>
                <span
                  className={cn(
                    'h-10 w-10 shrink-0 rounded-full bg-gradient-to-br ring-2 ring-white',
                    accent.gradient,
                  )}
                />
              </div>
            </button>

            <div className="mt-3 flex flex-wrap gap-2 border-t border-[#f5f0e8] pt-3">
              {!isActive && (
                <button
                  type="button"
                  onClick={() => onActivate(banner.id)}
                  className="rounded-lg bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold-dark hover:bg-gold/15"
                >
                  Set Live
                </button>
              )}
              <button
                type="button"
                onClick={() => onDuplicate(banner.id)}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-brown hover:bg-brown/5"
              >
                <Copy className="h-3.5 w-3.5" />
                Duplicate
              </button>
              <button
                type="button"
                onClick={() => onDelete(banner.id)}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
