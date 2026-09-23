import { assets } from '@/lib/assets';

/** Corner botanicals from Figma — multiply blend clears black PNG backgrounds on cream. */
export function LoginDecorations() {
  return (
    <>
      <img
        src={assets.auth.loginDecorTopRight}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-1 -top-1 z-[1] w-[90px] select-none object-contain mix-blend-multiply opacity-95 sm:w-[120px] lg:w-[150px]"
      />
      <img
        src={assets.auth.loginDecorBottomLeft}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-1 -left-1 z-[1] w-[100px] select-none object-contain mix-blend-multiply opacity-95 sm:w-[130px] lg:w-[160px]"
      />
    </>
  );
}
