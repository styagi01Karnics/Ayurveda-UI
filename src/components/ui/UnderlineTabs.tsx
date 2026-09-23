import { cn } from '@/lib/utils';

interface UnderlineTabsProps<T extends string> {
  tabs: { id: T; label: string }[];
  activeTab: T;
  onChange: (tab: T) => void;
  className?: string;
  /** Pill tabs (Patients Active/Inactive). Default is underline. */
  variant?: 'underline' | 'pill';
}

export function UnderlineTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'underline',
}: UnderlineTabsProps<T>) {
  if (variant === 'pill') {
    return (
      <div className={cn('flex flex-wrap items-center gap-2', className)}>
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                'rounded-lg px-4 py-1.5 font-sans text-[14px] leading-6 tracking-normal transition-colors',
                selected
                  ? 'bg-[#FAF4E5] font-semibold text-[#422C23]'
                  : 'bg-transparent font-medium text-[#422C23] hover:bg-[#FAF4E5]/60',
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
            '-mb-px border-b-2 px-4 py-2.5 font-sans text-[14px] leading-6 tracking-normal transition-colors',
            activeTab === tab.id
              ? 'border-[#BE880B] font-semibold text-[#BE880B]'
              : 'border-transparent font-medium text-[#422C23] hover:text-[#BE880B]',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
