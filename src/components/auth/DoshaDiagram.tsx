function VataIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 text-white" fill="currentColor">
      <path d="M4 20c6-2 10-6 12-12 2 6 6 10 12 12-6 2-10 6-12 12-2-6-6-10-12-12z" opacity="0.9" />
      <path d="M8 14c3-1 5-3 6-6 1 3 3 5 6 6-3 1-5 3-6 6-1-3-3-5-6-6z" opacity="0.7" />
    </svg>
  );
}

function PittaIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 text-white" fill="currentColor">
      <path d="M16 6c-2 6-6 10-6 16 0 3.3 2.7 6 6 6s6-2.7 6-6c0-6-4-10-6-16z" />
    </svg>
  );
}

function KaphaIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 text-white" fill="currentColor">
      <path d="M16 8c-4 6-8 8-8 14 0 2.2 1.8 4 4 4h8c2.2 0 4-1.8 4-4 0-6-4-8-8-14z" />
      <path d="M16 6c-1 2-2 3-3 4 1-1 2-2 3-4z" opacity="0.8" />
    </svg>
  );
}

const doshas = [
  {
    name: 'Vata',
    icon: VataIcon,
    bg: 'bg-[#b8d9ea]',
    position: 'top-[2%] left-1/2 -translate-x-1/2',
  },
  {
    name: 'Pitta',
    icon: PittaIcon,
    bg: 'bg-[#e8b896]',
    position: 'bottom-[8%] right-[2%]',
  },
  {
    name: 'Kapha',
    icon: KaphaIcon,
    bg: 'bg-[#b8d4a8]',
    position: 'bottom-[8%] left-[2%]',
  },
] as const;

export function DoshaDiagram() {
  return (
    <div className="relative mx-auto h-[min(480px,75vh)] w-[min(520px,90vw)]">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 520 480"
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
          d="M 260 90 L 430 360 L 90 360 Z"
          fill="none"
          stroke="#3c2a21"
          strokeWidth="1.2"
          strokeOpacity="0.3"
        />
        <path
          d="M 260 90 L 430 360"
          fill="none"
          stroke="#3c2a21"
          strokeWidth="1"
          strokeOpacity="0.35"
          markerEnd="url(#dosha-arrow)"
        />
        <path
          d="M 430 360 L 90 360"
          fill="none"
          stroke="#3c2a21"
          strokeWidth="1"
          strokeOpacity="0.35"
          markerEnd="url(#dosha-arrow)"
        />
        <path
          d="M 90 360 L 260 90"
          fill="none"
          stroke="#3c2a21"
          strokeWidth="1"
          strokeOpacity="0.35"
          markerEnd="url(#dosha-arrow)"
        />
      </svg>

      <p className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 font-serif text-base italic text-text-muted/80">
        know your dosha
      </p>

      {doshas.map(({ name, icon: Icon, bg, position }) => (
        <div
          key={name}
          className={`absolute ${position} z-10 flex flex-col items-center gap-2.5`}
        >
          <div
            className={`flex h-[88px] w-[88px] items-center justify-center rounded-full shadow-[0_4px_20px_rgba(60,42,33,0.12)] sm:h-[100px] sm:w-[100px] ${bg}`}
          >
            <Icon />
          </div>
          <span className="font-serif text-lg font-medium text-brown">{name}</span>
        </div>
      ))}
    </div>
  );
}
