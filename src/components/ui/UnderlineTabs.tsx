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
    <div className={cn('flex gap-6 border-b border-gray-100', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            '-mb-px border-b-2 pb-3 text-sm font-medium transition-colors',
            activeTab === tab.id
              ? 'border-gold text-gold'
              : 'border-transparent text-text-muted hover:text-brown',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
