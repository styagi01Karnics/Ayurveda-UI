import { assets } from '@/lib/assets';

const doshas = [
  {
    name: 'Vata',
    image: assets.dosha.vata,
    position: 'top-[6%] left-1/2 -translate-x-1/2',
  },
  {
    name: 'Pitta',
    image: assets.dosha.pitta,
    position: 'bottom-[4%] right-[6%]',
  },
  {
    name: 'Kapha',
    image: assets.dosha.kapha,
    position: 'bottom-[4%] left-[6%]',
  },
] as const;

export function DoshaDiagram() {
  return (
    <div className="relative mx-auto h-[min(380px,62vh)] w-full max-w-[480px]">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 580 540"
        aria-hidden
      >
        <defs>
          <marker
            id="dosha-arrow"
            markerWidth="10"
            markerHeight="10"
            refX="8"
            refY="5"
            orient="auto"
          >
            <polygon points="0 0, 10 5, 0 10" fill="#3c2a21" opacity="0.45" />
          </marker>
        </defs>
        <path
          d="M 290 108 L 480 400 L 100 400 Z"
          fill="none"
          stroke="#3c2a21"
          strokeWidth="1.2"
          strokeOpacity="0.3"
        />
        <path
          d="M 290 108 L 480 400"
          fill="none"
          stroke="#3c2a21"
          strokeWidth="1"
          strokeOpacity="0.35"
          markerEnd="url(#dosha-arrow)"
        />
        <path
          d="M 480 400 L 100 400"
          fill="none"
          stroke="#3c2a21"
          strokeWidth="1"
          strokeOpacity="0.35"
          markerEnd="url(#dosha-arrow)"
        />
        <path
          d="M 100 400 L 290 108"
          fill="none"
          stroke="#3c2a21"
          strokeWidth="1"
          strokeOpacity="0.35"
          markerEnd="url(#dosha-arrow)"
        />
      </svg>

      <p className="absolute left-1/2 top-[53%] z-10 -translate-x-1/2 -translate-y-1/2 font-serif text-[15px] italic text-brown/65">
        Know your Dosha
      </p>

      {doshas.map(({ name, image, position }) => (
        <div
          key={name}
          className={`absolute ${position} z-10 flex flex-col items-center gap-2.5`}
        >
          <img
            src={image}
            alt=""
            className="h-[72px] w-[72px] object-contain sm:h-[80px] sm:w-[80px]"
          />
          <span className="font-serif text-lg text-brown">{name}</span>
        </div>
      ))}
    </div>
  );
}
