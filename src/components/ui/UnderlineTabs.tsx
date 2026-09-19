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
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-1 gap-y-1 border-b border-[#ebe4d8]',
        className,
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            '-mb-px border-b-2 px-4 py-2.5 font-sans text-[14px] font-semibold leading-[24px] tracking-normal transition-colors',
            activeTab === tab.id
              ? 'border-gold text-brown'
              : 'border-transparent text-text-muted hover:text-brown',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
