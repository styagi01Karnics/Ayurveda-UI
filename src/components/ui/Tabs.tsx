import { cn } from '@/lib/utils';

interface TabsProps<T extends string> {
  tabs: { id: T; label: string }[];
  activeTab: T;
  onChange: (tab: T) => void;
  className?: string;
  variant?: 'pill' | 'switch';
}

export function Tabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'pill',
}: TabsProps<T>) {
  if (variant === 'switch') {
    return (
      <div
        className={cn(
          'flex items-center rounded-[10px] bg-white p-0.5 shadow-[0px_0px_3px_1px_#BE880B26]',
          className,
        )}
        role="group"
      >
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-pressed={selected}
              className={cn(
                'flex-1 rounded-lg px-3.5 py-2 text-center text-sm font-semibold transition-colors',
                selected
                  ? 'bg-[#BE880B] text-white shadow-[0px_0px_3px_1px_#BE880B26]'
                  : 'bg-transparent text-[#422C23]',
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex gap-2', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors',
            activeTab === tab.id
              ? 'bg-[#FBF6E8] text-[#161616]'
              : 'text-text-muted hover:text-[#161616]',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
