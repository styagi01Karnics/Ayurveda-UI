import type { PaymentModeId } from '@/types';

interface PaymentModeIconProps {
  mode: PaymentModeId;
  className?: string;
}

export function PaymentModeIcon({ mode, className = 'h-11 w-11' }: PaymentModeIconProps) {
  switch (mode) {
    case 'upi':
      return <UpiIcon className={className} />;
    case 'card':
      return <CardIcon className={className} />;
    case 'wallet':
      return <WalletIcon className={className} />;
    case 'partial':
      return <PartialPaymentIcon className={className} />;
    case 'emi':
      return <EmiIcon className={className} />;
    default:
      return null;
  }
}

function UpiIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="44" height="44" rx="10" fill="#097939" />
      <path
        d="M12 28V16.5L18.5 22.25L12 28Z"
        fill="#FF6F00"
      />
      <path
        d="M18.5 16.5H32V19.5H22.5L32 28H27.5L19.5 20.5V28H18.5V16.5Z"
        fill="white"
      />
    </svg>
  );
}

function CardIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="44" height="44" rx="10" fill="#F3F4F6" />
      <rect x="8" y="13" width="28" height="18" rx="3" fill="#1A1F71" />
      <rect x="8" y="19" width="28" height="4" fill="#F7B600" opacity="0.9" />
      <rect x="11" y="26" width="10" height="2" rx="1" fill="white" opacity="0.7" />
      <circle cx="30" cy="27" r="4" fill="#EB001B" />
      <circle cx="33.5" cy="27" r="4" fill="#F79E1B" fillOpacity="0.85" />
    </svg>
  );
}

function WalletIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="44" height="44" rx="10" fill="#5F259F" />
      <path
        d="M12 16C12 14.3431 13.3431 13 15 13H27C28.6569 13 30 14.3431 30 16V18H31C32.1046 18 33 18.8954 33 20V28C33 29.1046 32.1046 30 31 30H15C13.3431 30 12 28.6569 12 27V16Z"
        fill="white"
        fillOpacity="0.95"
      />
      <rect x="12" y="18" width="18" height="10" rx="2" fill="#FF6D00" />
      <circle cx="28" cy="23" r="2.5" fill="#5F259F" />
      <path
        d="M15 16H27V17H15V16Z"
        fill="#5F259F"
        fillOpacity="0.35"
      />
    </svg>
  );
}

function PartialPaymentIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="44" height="44" rx="10" fill="#FFF7ED" />
      <rect
        x="10"
        y="14"
        width="24"
        height="16"
        rx="3"
        fill="#C9A227"
        fillOpacity="0.15"
        stroke="#C9A227"
        strokeWidth="1.5"
      />
      <path
        d="M17 14V12.5C17 11.6716 17.6716 11 18.5 11H25.5C26.3284 11 27 11.6716 27 12.5V14"
        stroke="#8B6914"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M22 19V25M19 22H25"
        stroke="#8B6914"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EmiIcon({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="44" height="44" rx="10" fill="#EFF6FF" />
      <rect x="9" y="14" width="26" height="16" rx="3" fill="#2563EB" />
      <rect x="9" y="19" width="26" height="3" fill="#60A5FA" />
      <text
        x="22"
        y="27"
        textAnchor="middle"
        fill="white"
        fontSize="7"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        EMI
      </text>
      <circle cx="32" cy="24" r="5" fill="#FBBF24" />
      <path
        d="M32 21.5V26.5M29.5 24H34.5"
        stroke="#92400E"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
