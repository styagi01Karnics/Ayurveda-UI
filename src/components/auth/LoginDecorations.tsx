import { assets } from '@/lib/assets';

/** Corner botanicals from Figma — multiply blend clears black PNG backgrounds on cream. */
export function LoginDecorations() {
  return (
    <>
      <img
        src={assets.auth.loginDecorTopRight}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-1 -top-1 z-[1] w-[110px] select-none object-contain mix-blend-multiply opacity-95 sm:w-[150px] lg:w-[190px]"
      />
      <img
        src={assets.auth.loginDecorBottomLeft}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-1 -left-1 z-[1] w-[130px] select-none object-contain mix-blend-multiply opacity-95 sm:w-[165px] lg:w-[200px]"
      />
    </>
  );
}
