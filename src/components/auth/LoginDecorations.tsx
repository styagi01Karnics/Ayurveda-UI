import { assets } from '@/lib/assets';

/** Corner botanicals — bundled PNGs (SVGs were dropping out). */
export function LoginDecorations() {
  return (
    <>
      <img
        src={assets.auth.loginDecorTopRight}
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 z-[1] w-[180px] sm:w-[220px] lg:w-[240px]"
      />
      <img
        src={assets.auth.loginDecorBottomLeft}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 z-[1] w-[200px] md:w-[230px] lg:w-[250px]"
      />
    </>
  );
}
