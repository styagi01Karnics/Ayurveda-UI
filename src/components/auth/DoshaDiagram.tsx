import { assets } from '@/lib/assets';

/**
 * Figma “Know Your / Dosha” triangle.
 * Sized with viewport units so it stays on-screen at 100% zoom (no scroll).
 */
export function DoshaDiagram() {
  return (
    <div className="relative mx-auto aspect-square w-[min(100%,min(34vw,calc(100dvh-3.5rem)))] max-w-[560px] pb-[8%]">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        fill="none"
        aria-hidden
      >
        <defs>
          <marker
            id="dosha-arrow"
            markerWidth="3.4"
            markerHeight="3.4"
            refX="3"
            refY="1.7"
            orient="auto"
          >
            <path d="M0 0 L3.4 1.7 L0 3.4 Z" fill="#422c23" fillOpacity="0.55" />
          </marker>
        </defs>

        <path
          d="M 56 27 L 75 64"
          stroke="#422c23"
          strokeWidth="0.4"
          strokeOpacity="0.5"
          markerEnd="url(#dosha-arrow)"
        />
        <path
          d="M 71 78 L 29 78"
          stroke="#422c23"
          strokeWidth="0.4"
          strokeOpacity="0.5"
          markerEnd="url(#dosha-arrow)"
        />
        <path
          d="M 25 64 L 44 27"
          stroke="#422c23"
          strokeWidth="0.4"
          strokeOpacity="0.5"
          markerEnd="url(#dosha-arrow)"
        />
      </svg>

      <p className="pointer-events-none absolute left-1/2 top-[48%] z-20 -translate-x-1/2 -translate-y-1/2 text-center font-inria text-[clamp(16px,2.2dvh,24px)] font-bold leading-[1.15] text-[#422C23]">
        Know Your
        <br />
        Dosha
      </p>

      <DoshaNode
        name="Vata"
        image={assets.dosha.vata}
        className="left-[50%] top-[18%]"
      />
      <DoshaNode
        name="Kapha"
        image={assets.dosha.kapha}
        className="left-[17%] top-[74%]"
      />
      <DoshaNode
        name="Pitta"
        image={assets.dosha.pitta}
        className="left-[83%] top-[74%]"
      />
    </div>
  );
}

function DoshaNode({
  name,
  image,
  className,
}: {
  name: string;
  image: string;
  className: string;
}) {
  return (
    <div
      className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 ${className}`}
    >
      <img
        src={image}
        alt=""
        className="block h-[clamp(72px,12dvh,128px)] w-[clamp(72px,12dvh,128px)] object-contain mix-blend-multiply"
      />
      <span className="absolute left-1/2 top-full mt-0.5 -translate-x-1/2 whitespace-nowrap text-center font-inria text-[clamp(16px,2.2dvh,24px)] font-bold leading-none text-[#422C23]">
        {name}
      </span>
    </div>
  );
}
