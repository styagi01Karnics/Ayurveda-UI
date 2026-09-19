import { assets } from '@/lib/assets';

export function LoginDecorations() {
  return (
    <>
      <img
        src={assets.auth.loginDecorTopRight}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-2 top-0 z-[1] w-[150px] opacity-95 sm:right-0 sm:w-[190px] lg:w-[230px]"
      />
      <img
        src={assets.auth.loginDecorBottomLeft}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 z-[1] w-[170px] opacity-95 md:w-[210px] lg:w-[250px]"
      />
    </>
  );
}
