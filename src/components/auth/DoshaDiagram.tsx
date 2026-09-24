import { assets } from '@/lib/assets';

/**
 * Equilateral “Know Your Dosha” triangle.
 * Arrows leave the Vata circle at the sides so they don’t cut the label.
 */
export function DoshaDiagram() {
  return (
    <div className="relative h-[min(720px,84dvh)] w-full max-w-[760px] shrink-0">
      <svg
        className="h-full w-full"
        viewBox="0 0 600 560"
        fill="none"
        aria-hidden
      >
        <defs>
          <marker
            id="dosha-arrow"
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="6"
            orient="auto"
          >
            <path d="M0 0 L12 6 L0 12 Z" fill="#422c23" fillOpacity="0.6" />
          </marker>
        </defs>

        {/* Vata circle (300,80) r≈48 — strokes start at the left/right rims */}
        <path
          d="M 348 100 L 483 397"
          stroke="#422c23"
          strokeWidth="1.6"
          strokeOpacity="0.55"
          markerEnd="url(#dosha-arrow)"
        />
        <path
          d="M 458 440 L 142 440"
          stroke="#422c23"
          strokeWidth="1.6"
          strokeOpacity="0.55"
          markerEnd="url(#dosha-arrow)"
        />
        <path
          d="M 117 397 L 252 100"
          stroke="#422c23"
          strokeWidth="1.6"
          strokeOpacity="0.55"
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
          fontFamily="Inria Serif, serif"
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
          fontFamily="Inria Serif, serif"
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
          fontFamily="Inria Serif, serif"
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
          fontSize="19"
          fontWeight="700"
        >
          Know Your
        </text>
        <text
          x="300"
          y="316"
          textAnchor="middle"
          fill="#422C23"
          fontFamily="Inria Serif, serif"
          fontSize="19"
          fontWeight="700"
        >
          Dosha
        </text>
      </svg>
    </div>
  );
}
