const doshas = [
  {
    name: 'Vata',
    image: '/assets/vata.png',
    position: 'top-[4%] left-1/2 -translate-x-1/2',
  },
  {
    name: 'Pitta',
    image: '/assets/pitta.png',
    position: 'bottom-[6%] right-[4%]',
  },
  {
    name: 'Kapha',
    image: '/assets/kapha.png',
    position: 'bottom-[6%] left-[4%]',
  },
] as const;

export function DoshaDiagram() {
  return (
    <div className="relative mx-auto h-[min(520px,78vh)] w-full max-w-[560px]">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 560 520"
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
            <polygon points="0 0, 10 5, 0 10" fill="#3c2a21" opacity="0.5" />
          </marker>
        </defs>
        <path
          d="M 280 100 L 470 390 L 90 390 Z"
          fill="none"
          stroke="#3c2a21"
          strokeWidth="1.2"
          strokeOpacity="0.35"
        />
        <path
          d="M 280 100 L 470 390"
          fill="none"
          stroke="#3c2a21"
          strokeWidth="1"
          strokeOpacity="0.4"
          markerEnd="url(#dosha-arrow)"
        />
        <path
          d="M 470 390 L 90 390"
          fill="none"
          stroke="#3c2a21"
          strokeWidth="1"
          strokeOpacity="0.4"
          markerEnd="url(#dosha-arrow)"
        />
        <path
          d="M 90 390 L 280 100"
          fill="none"
          stroke="#3c2a21"
          strokeWidth="1"
          strokeOpacity="0.4"
          markerEnd="url(#dosha-arrow)"
        />
      </svg>

      <p className="absolute left-1/2 top-[52%] z-10 -translate-x-1/2 -translate-y-1/2 font-serif text-[15px] italic text-brown/70">
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
            className="h-[96px] w-[96px] object-contain sm:h-[108px] sm:w-[108px]"
          />
          <span className="font-serif text-lg text-brown">{name}</span>
        </div>
      ))}
    </div>
  );
}
