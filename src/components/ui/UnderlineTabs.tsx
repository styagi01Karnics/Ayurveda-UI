import { cn } from '@/lib/utils';

interface UnderlineTabsProps<T extends string> {
  tabs: { id: T; label: string }[];
  activeTab: T;
  onChange: (tab: T) => void;
  className?: string;
}

export function UnderlineTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className,
}: UnderlineTabsProps<T>) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'rounded-lg px-4 py-1.5 font-sans text-[14px] font-semibold leading-[24px] tracking-normal transition-colors',
            activeTab === tab.id
              ? 'bg-[#FAF4E5] text-brown'
              : 'text-text-muted hover:text-brown',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
