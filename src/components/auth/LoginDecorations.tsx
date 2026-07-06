import { assets } from '@/lib/assets';

export function LoginDecorations() {
  return (
    <>
      <img
        src={assets.auth.loginDecorTopRight}
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 z-[1] w-[160px] sm:w-[200px] lg:w-[220px]"
      />
      <img
        src={assets.auth.loginDecorBottomLeft}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 z-[1] w-[180px] md:w-[220px] lg:w-[260px]"
      />
    </>
  );
}
