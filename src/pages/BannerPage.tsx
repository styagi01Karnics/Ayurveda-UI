import { useMemo, useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { usePageAction } from '@/app/PageActionContext';
import { useToast } from '@/app/ToastContext';
import { BannerCollection } from '@/components/banners/BannerCollection';
import { BannerEditorPanel } from '@/components/banners/BannerEditorPanel';
import { BannerPreviewFrame } from '@/components/banners/BannerPreviewFrame';
import { PageShell } from '@/components/layout/PageShell';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useClinicBanners } from '@/hooks/useClinicBanners';
import { assets } from '@/lib/assets';
import { createEmptyBanner, getActiveBanner, type ClinicBanner } from '@/lib/bannerStorage';
import { UI_MESSAGES } from '@/lib/uiMessages';

export function BannerPage() {
  const { showToast } = useToast();
  const { banners, activeBannerId, persist, setActiveBanner } = useClinicBanners();
  const [editingBanner, setEditingBanner] = useState<ClinicBanner>(
    () => getActiveBanner(banners) ?? banners[0] ?? createEmptyBanner(),
  );
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');
  const [deleteBannerId, setDeleteBannerId] = useState<string | null>(null);

  const headerAction = useMemo(
    () => (
      <Button
        className="gap-1.5 px-4 py-2 text-sm"
        onClick={() => setEditingBanner(createEmptyBanner())}
      >
        <Plus className="h-4 w-4" />
        New Banner
      </Button>
    ),
    [],
  );

  usePageAction(headerAction);

  const upsertBanner = (banner: ClinicBanner) => {
    const exists = banners.some((b) => b.id === banner.id);
    const next = exists
      ? banners.map((b) => (b.id === banner.id ? banner : b))
      : [...banners, banner];
    persist(next);
    setEditingBanner(banner);
  };

  const handleSave = () => {
    if (!editingBanner.headline.trim()) {
      showToast({
        title: 'Headline required',
        message: 'Add a headline before saving your banner.',
      });
      return;
    }

    upsertBanner({
      ...editingBanner,
      status: editingBanner.status === 'active' ? 'active' : 'draft',
    });
    showToast({
      title: 'Banner saved',
      message: `"${editingBanner.title}" has been saved.`,
    });
  };

  const handlePublish = () => {
    if (!editingBanner.headline.trim()) {
      showToast({
        title: 'Headline required',
        message: 'Add a headline before publishing.',
      });
      return;
    }

    const published: ClinicBanner = {
      ...editingBanner,
      status: 'active',
      updatedAt: new Date().toISOString(),
    };
    const next = banners.some((b) => b.id === published.id)
      ? banners.map((b) =>
          b.id === published.id ? published : { ...b, status: 'draft' as const },
        )
      : [...banners.map((b) => ({ ...b, status: 'draft' as const })), published];

    persist(next);
    setActiveBanner(published.id);
    setEditingBanner(published);
    showToast({
      title: 'Banner is live',
      message: 'This banner now appears across the clinic dashboard.',
    });
  };

  const handleDuplicate = (id: string) => {
    const source = banners.find((b) => b.id === id);
    if (!source) return;
    const copy: ClinicBanner = {
      ...source,
      id: `banner-${Date.now()}`,
      title: `${source.title} Copy`,
      status: 'draft',
      updatedAt: new Date().toISOString(),
    };
    persist([...banners, copy]);
    setEditingBanner(copy);
  };

  const handleDelete = (id: string) => {
    const next = banners.filter((b) => b.id !== id);
    persist(next);
    if (editingBanner.id === id) {
      setEditingBanner(next[0] ?? createEmptyBanner());
    }
    setDeleteBannerId(null);
    showToast({
      title: 'Banner deleted',
      message: UI_MESSAGES.success.bannerDeleted,
    });
  };

  const handleActivate = (id: string) => {
    const next = banners.map((b) => ({
      ...b,
      status: b.id === id ? ('active' as const) : ('draft' as const),
    }));
    persist(next);
    setActiveBanner(id);
    const live = next.find((b) => b.id === id);
    if (live) setEditingBanner(live);
    showToast({ title: 'Banner activated', message: 'Live banner updated across the app.' });
  };

  return (
    <PageShell className="space-y-6">
      <section className="relative overflow-hidden rounded-[28px] border border-[#e8dfd0] bg-gradient-to-br from-[#faf6ee] via-[#f5ecda] to-[#ebe3d2] px-6 py-8 sm:px-10 sm:py-10">
        <img
          src={assets.scheduleDecor}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-6 top-0 h-36 w-36 object-contain opacity-70 sm:h-44 sm:w-44"
        />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-dark ring-1 ring-gold/15">
            <Sparkles className="h-3.5 w-3.5" />
            Banner Studio
          </span>
          <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-brown sm:text-4xl">
            Craft elegant clinic announcements
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-brown-muted sm:text-base">
            Design promotional ribbons and hero banners that match the warmth of Ganesha
            Ayurvedaa — then publish them live across your dashboard in one click.
          </p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-5">
          <Card className="p-0">
            <div className="border-b border-[#f0ebe3] px-5 py-4">
              <h2 className="font-semibold text-brown">Your Banners</h2>
              <p className="text-xs text-text-muted">{banners.length} saved designs</p>
            </div>
            <div className="max-h-[420px] overflow-y-auto p-4">
              <BannerCollection
                banners={banners}
                selectedId={editingBanner.id}
                activeId={activeBannerId}
                onSelect={(id) => {
                  const banner = banners.find((b) => b.id === id);
                  if (banner) setEditingBanner(banner);
                }}
                onActivate={handleActivate}
                onDuplicate={handleDuplicate}
                onDelete={(id) => setDeleteBannerId(id)}
              />
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 font-semibold text-brown">Edit Banner</h2>
            <BannerEditorPanel
              banner={editingBanner}
              onChange={setEditingBanner}
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={handleSave}>Save Draft</Button>
              <Button variant="outline" onClick={handlePublish}>
                Publish Live
              </Button>
            </div>
          </Card>
        </div>

        <Card className="xl:col-span-7 xl:p-6">
          <BannerPreviewFrame
            banner={editingBanner}
            viewport={viewport}
            onViewportChange={setViewport}
          />
        </Card>
      </div>

      <ConfirmDialog
        open={Boolean(deleteBannerId)}
        onClose={() => setDeleteBannerId(null)}
        onConfirm={() => {
          if (deleteBannerId) handleDelete(deleteBannerId);
        }}
        title={UI_MESSAGES.confirm.deleteBannerTitle}
        message={UI_MESSAGES.confirm.deleteBannerMessage}
        confirmLabel={UI_MESSAGES.confirm.delete}
      />
    </PageShell>
  );
}
