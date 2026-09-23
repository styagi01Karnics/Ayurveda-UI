import { cn } from '@/lib/utils';
import { assets } from '@/lib/assets';
import { AppIcon } from './AppIcon';

interface SearchFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  wrapperClassName?: string;
}

export function SearchField({
  className,
  wrapperClassName,
  ...props
}: SearchFieldProps) {
  return (
    <div className={cn('relative', wrapperClassName)}>
      <AppIcon
        src={assets.icons.search}
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-70"
      />
      <input
        type="search"
        className={cn(
          'w-full rounded-lg border border-[#EFF0F6] bg-white py-2 pl-10 pr-4 font-sans text-[12px] font-medium leading-6 tracking-normal text-[#67554D] placeholder:text-[#67554D]/70 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20',
          className,
        )}
        {...props}
      />
    </div>
  );
}
