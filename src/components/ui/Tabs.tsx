import { cn } from '@/lib/utils';

interface TabsProps<T extends string> {
  tabs: { id: T; label: string }[];
  activeTab: T;
  onChange: (tab: T) => void;
  className?: string;
}

export function Tabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className,
}: TabsProps<T>) {
  return (
    <div className={cn('flex gap-2', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            activeTab === tab.id
              ? 'bg-gold/15 text-brown'
              : 'text-text-muted hover:text-brown',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
