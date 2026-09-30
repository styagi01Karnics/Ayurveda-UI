import { cn } from '@/lib/utils';
import { assets } from '@/lib/assets';
import { AppIcon } from './AppIcon';

interface SearchFieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  wrapperClassName?: string;
  iconPosition?: 'left' | 'right';
}

export function SearchField({
  className,
  wrapperClassName,
  iconPosition = 'left',
  ...props
}: SearchFieldProps) {
  const iconOnRight = iconPosition === 'right';

  return (
    <div className={cn('relative', wrapperClassName)}>
      <AppIcon
        src={assets.icons.search}
        className={cn(
          'pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2',
          iconOnRight ? 'right-3' : 'left-3',
        )}
      />
      <input
        type="search"
        className={cn(
          'w-full rounded-lg border border-gray-200 bg-white py-2.5 text-sm text-brown focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20',
          iconOnRight ? 'pl-4 pr-10' : 'pl-10 pr-4',
          className,
        )}
        {...props}
      />
    </div>
  );
}
