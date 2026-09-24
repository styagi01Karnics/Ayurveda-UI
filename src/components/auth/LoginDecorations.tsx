import { assets } from '@/lib/assets';

/** Corner botanicals — bundled PNGs (SVGs were dropping out). */
export function LoginDecorations() {
  return (
    <>
      <img
        src={assets.auth.loginDecorTopRight}
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 z-[1] w-[110px] select-none object-contain sm:w-[150px] lg:w-[180px]"
      />
      <img
        src={assets.auth.loginDecorBottomLeft}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 z-[1] w-[120px] select-none object-contain sm:w-[160px] lg:w-[190px]"
      />
    </>
  );
}
