import { assets } from '@/lib/assets';

/**
 * Figma “Know your Dosha” triangle.
 * Icons at vertices, labels outside the triangle, arrows along the edges.
 * Center title sits on a cream wash so strokes never cut through the type.
 */
export function DoshaDiagram() {
  return (
    <div className="relative mx-auto aspect-[1.08] w-full max-h-[min(540px,76dvh)] max-w-[min(520px,90%)]">
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

        {/* Equilateral-ish perimeter between icon rims (not through labels) */}
        <path
          d="M 58 20 L 78 58"
          stroke="#422c23"
          strokeWidth="0.38"
          strokeOpacity="0.48"
          markerEnd="url(#dosha-arrow)"
        />
        <path
          d="M 74 70 L 26 70"
          stroke="#422c23"
          strokeWidth="0.38"
          strokeOpacity="0.48"
          markerEnd="url(#dosha-arrow)"
        />
        <path
          d="M 22 58 L 42 20"
          stroke="#422c23"
          strokeWidth="0.38"
          strokeOpacity="0.48"
          markerEnd="url(#dosha-arrow)"
        />
      </svg>

      <p className="pointer-events-none absolute left-1/2 top-[47%] z-20 -translate-x-1/2 -translate-y-1/2 rounded-md bg-[#fbf6e8] px-3 py-1.5 text-center font-inria text-[17px] font-bold leading-tight tracking-wide text-[#422C23] sm:text-[19px]">
        Know Your
        <br />
        Dosha
      </p>

      <DoshaNode
        name="Vata"
        image={assets.dosha.vata}
        className="left-1/2 top-0 -translate-x-1/2"
      />
      <DoshaNode
        name="Kapha"
        image={assets.dosha.kapha}
        className="bottom-0 left-0"
      />
      <DoshaNode
        name="Pitta"
        image={assets.dosha.pitta}
        className="bottom-0 right-0"
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
      className={`absolute z-10 flex w-[118px] flex-col items-center sm:w-[128px] ${className}`}
    >
      <img
        src={image}
        alt=""
        className="h-[92px] w-[92px] object-contain mix-blend-multiply sm:h-[104px] sm:w-[104px]"
      />
      <span className="mt-1.5 text-center font-inria text-[20px] font-bold leading-none text-[#422C23] sm:text-[22px]">
        {name}
      </span>
    </div>
  );
}
