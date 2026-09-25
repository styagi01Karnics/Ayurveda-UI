import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'md' | 'sm';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'border border-gold bg-gold text-white hover:bg-gold-dark focus-visible:ring-gold/50',
  outline:
    'border border-gold bg-transparent text-gold hover:bg-gold/10 focus-visible:ring-gold/50',
  ghost: 'border border-transparent bg-transparent text-brown hover:bg-brown/5',
  danger:
    'border border-danger bg-transparent text-danger hover:bg-danger/10 focus-visible:ring-danger/40',
};

const sizeStyles: Record<ButtonSize, string> = {
  md: 'px-5 py-3 text-sm',
  sm: 'h-8 px-4 py-0 text-xs',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      type = 'button',
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-[16px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);

Button.displayName = 'Button';
