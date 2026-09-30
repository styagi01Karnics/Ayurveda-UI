import { assets } from '@/lib/assets';

const WIDTH = 620;
const HEIGHT = 540;
const ICON = 132;
const LINE_PAD = ICON / 2 + 10;

const nodes = {
  vata: {
    x: 310,
    y: 72,
    name: 'Vata',
    src: assets.dosha.vata,
    labelOffset: 4,
  },
  pitta: {
    x: 528,
    y: 418,
    name: 'Pitta',
    src: assets.dosha.pitta,
    labelOffset: 6,
  },
  kapha: {
    x: 92,
    y: 418,
    name: 'Kapha',
    src: assets.dosha.kapha,
    labelOffset: 6,
  },
};

const edges: Array<[keyof typeof nodes, keyof typeof nodes]> = [
  ['vata', 'pitta'],
  ['pitta', 'kapha'],
  ['kapha', 'vata'],
];

function edgeCoords(
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: from.x + ux * LINE_PAD,
    y1: from.y + uy * LINE_PAD,
    x2: to.x - ux * LINE_PAD,
    y2: to.y - uy * LINE_PAD,
  };
}

export function DoshaDiagram() {
  const centroid = {
    x: (nodes.vata.x + nodes.pitta.x + nodes.kapha.x) / 3,
    y: (nodes.vata.y + nodes.pitta.y + nodes.kapha.y) / 3 + 10,
  };

  return (
    <div
      className="relative mx-auto w-full max-w-[min(680px,calc((100vh-11rem)*1.15))]"
      style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        aria-hidden
      >
        <defs>
          <marker
            id="dosha-arrow"
            markerWidth="11"
            markerHeight="11"
            refX="9"
            refY="5.5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0 0 L11 5.5 L0 11 Z" fill="#3c2a21" opacity="0.75" />
          </marker>
        </defs>
        {edges.map(([fromKey, toKey]) => {
          const line = edgeCoords(nodes[fromKey], nodes[toKey]);
          return (
            <line
              key={`${fromKey}-${toKey}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#3c2a21"
              strokeWidth="1.4"
              strokeOpacity="0.6"
              markerEnd="url(#dosha-arrow)"
            />
          );
        })}
      </svg>

      <p
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-center font-inria text-[18.65px] font-bold leading-[1.35] tracking-normal text-brown"
        style={{
          left: `${(centroid.x / WIDTH) * 100}%`,
          top: `${(centroid.y / HEIGHT) * 100}%`,
        }}
      >
        Know your
        <br />
        Dosha
      </p>

      {Object.values(nodes).map((node) => (
        <div key={node.name}>
          <div
            className="absolute z-10"
            style={{
              left: `${(node.x / WIDTH) * 100}%`,
              top: `${(node.y / HEIGHT) * 100}%`,
              width: `${(ICON / WIDTH) * 100}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <img
              src={node.src}
              alt=""
              className="h-auto w-full object-contain"
            />
          </div>
          <span
            className="absolute z-10 font-serif text-[22px] text-brown"
            style={{
              left: `${(node.x / WIDTH) * 100}%`,
              top: `${((node.y + ICON / 2 + node.labelOffset) / HEIGHT) * 100}%`,
              transform: 'translateX(-50%)',
            }}
          >
            {node.name}
          </span>
        </div>
      ))}
    </div>
  );
}
