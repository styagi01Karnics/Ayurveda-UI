import { assets } from '@/lib/assets';

const doshas = [
  {
    name: 'Vata',
    image: assets.dosha.vata,
    position: 'top-[4%] left-1/2 -translate-x-1/2',
  },
  {
    name: 'Pitta',
    image: assets.dosha.pitta,
    position: 'bottom-[2%] right-[4%]',
  },
  {
    name: 'Kapha',
    image: assets.dosha.kapha,
    position: 'bottom-[2%] left-[4%]',
  },
] as const;

export function DoshaDiagram() {
  return (
    <div className="relative mx-auto h-[min(520px,70vh)] w-full max-w-[580px]">
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
            <polygon points="0 0, 10 5, 0 10" fill="#422c23" opacity="0.5" />
          </marker>
        </defs>
        <path
          d="M 290 108 L 480 400 L 100 400 Z"
          fill="none"
          stroke="#422c23"
          strokeWidth="1.2"
          strokeOpacity="0.35"
        />
        <path
          d="M 290 108 L 480 400"
          fill="none"
          stroke="#422c23"
          strokeWidth="1.1"
          strokeOpacity="0.4"
          markerEnd="url(#dosha-arrow)"
        />
        <path
          d="M 480 400 L 100 400"
          fill="none"
          stroke="#422c23"
          strokeWidth="1.1"
          strokeOpacity="0.4"
          markerEnd="url(#dosha-arrow)"
        />
        <path
          d="M 100 400 L 290 108"
          fill="none"
          stroke="#422c23"
          strokeWidth="1.1"
          strokeOpacity="0.4"
          markerEnd="url(#dosha-arrow)"
        />
      </svg>

      <p className="absolute left-1/2 top-[53%] z-10 -translate-x-1/2 -translate-y-1/2 text-center font-inria text-[18.65px] font-bold leading-none tracking-normal text-brown">
        Know your Dosha
      </p>

      {doshas.map(({ name, image, position }) => (
        <div
          key={name}
          className={`absolute ${position} z-10 flex flex-col items-center gap-2`}
        >
          <img
            src={image}
            alt=""
            className="h-[96px] w-[96px] object-contain sm:h-[112px] sm:w-[112px]"
          />
          <span className="text-center font-inria text-[27.78px] font-bold leading-none tracking-normal text-brown">
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}
