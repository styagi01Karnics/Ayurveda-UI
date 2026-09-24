import { assets } from '@/lib/assets';

/**
 * Equilateral “Know Your Dosha” triangle.
 * Arrows leave the Vata circle at the sides so they don’t cut the label.
 */
export function DoshaDiagram() {
  return (
    <div className="relative ml-auto h-[min(520px,72dvh)] w-full max-w-none shrink-0">
      <svg
        className="h-full w-full"
        viewBox="0 0 555 535"
        fill="none"
        aria-hidden
      >
        <defs>
          <marker
            id="dosha-arrow"
            viewBox="0 0 10 10"
            markerWidth="8"
            markerHeight="8"
            refX="8"
            refY="5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path
              d="M 1.5 1.5 L 8.5 5 L 1.5 8.5"
              fill="none"
              stroke="#422C23"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        </defs>

        {/* Vata circle (300,80) r≈48 — strokes start at the left/right rims */}
        <path
          d="M 348 100 L 483 397"
          stroke="#422C23"
          strokeWidth="1.86"
          vectorEffect="non-scaling-stroke"
          markerEnd="url(#dosha-arrow)"
        />
        <path
          d="M 458 440 L 142 440"
          stroke="#422C23"
          strokeWidth="1.86"
          vectorEffect="non-scaling-stroke"
          markerEnd="url(#dosha-arrow)"
        />
        <path
          d="M 117 397 L 252 100"
          stroke="#422C23"
          strokeWidth="1.86"
          vectorEffect="non-scaling-stroke"
          markerEnd="url(#dosha-arrow)"
        />

        <image
          href={assets.dosha.vata}
          x="252"
          y="32"
          width="96"
          height="96"
          style={{ mixBlendMode: 'multiply' }}
        />
        <image
          href={assets.dosha.kapha}
          x="44"
          y="392"
          width="96"
          height="96"
          style={{ mixBlendMode: 'multiply' }}
        />
        <image
          href={assets.dosha.pitta}
          x="460"
          y="392"
          width="96"
          height="96"
          style={{ mixBlendMode: 'multiply' }}
        />

        <text
          x="300"
          y="148"
          textAnchor="middle"
          fill="#422C23"
          fontFamily="Inter, sans-serif"
          fontSize="28"
          fontWeight="700"
        >
          Vata
        </text>
        <text
          x="92"
          y="522"
          textAnchor="middle"
          fill="#422C23"
          fontFamily="Inter, sans-serif"
          fontSize="28"
          fontWeight="700"
        >
          Kapha
        </text>
        <text
          x="508"
          y="522"
          textAnchor="middle"
          fill="#422C23"
          fontFamily="Inter, sans-serif"
          fontSize="28"
          fontWeight="700"
        >
          Pitta
        </text>

        <text
          x="300"
          y="292"
          textAnchor="middle"
          fill="#422C23"
          fontFamily="Inria Serif, serif"
          fontSize="18.65"
          fontWeight="700"
          letterSpacing="0"
        >
          Know Your
        </text>
        <text
          x="300"
          y="316"
          textAnchor="middle"
          fill="#422C23"
          fontFamily="Inria Serif, serif"
          fontSize="18.65"
          fontWeight="700"
          letterSpacing="0"
        >
          Dosha
        </text>
      </svg>
    </div>
  );
}
