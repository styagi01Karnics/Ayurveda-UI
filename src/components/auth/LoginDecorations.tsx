import { assets } from '@/lib/assets';

export function LoginDecorations() {
  return (
    <>
      <img
        src={assets.auth.loginDecorTopRight}
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 z-[1] w-[200px] sm:w-[240px] lg:w-[280px] xl:w-[320px]"
      />
      <img
        src={assets.auth.loginDecorBottomLeft}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 z-[1] w-[240px] md:w-[300px] lg:w-[340px] xl:w-[380px]"
      />
    </>
  );
}
