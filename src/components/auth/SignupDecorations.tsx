import { assets } from '@/lib/assets';

export function SignupDecorations() {
  return (
    <>
      <img
        src={assets.auth.loginDecorTopRight}
        alt=""
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 z-[1] w-[180px] mix-blend-multiply opacity-90 sm:w-[220px] lg:w-[260px] xl:w-[300px]"
      />
      <img
        src={assets.auth.signupDecorBottomRight}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 z-[1] w-[280px] mix-blend-multiply opacity-90 md:w-[360px] lg:w-[400px] xl:w-[440px]"
      />
    </>
  );
}
