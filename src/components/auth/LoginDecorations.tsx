export function LoginDecorations() {
  return (
    <>
      {/* Top-right tulsi branch */}
      <div
        className="pointer-events-none absolute right-0 top-0 hidden opacity-90 sm:block"
        aria-hidden
      >
        <svg
          width="220"
          height="200"
          viewBox="0 0 220 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M180 20 C160 40, 150 80, 130 100 C110 120, 90 130, 70 145"
            stroke="#5a7a4a"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
          <ellipse cx="175" cy="28" rx="10" ry="14" fill="#8fbc8f" opacity="0.7" />
          <ellipse cx="158" cy="52" rx="9" ry="13" fill="#7aad6e" opacity="0.75" />
          <ellipse cx="142" cy="78" rx="8" ry="12" fill="#8fbc8f" opacity="0.7" />
          <ellipse cx="118" cy="98" rx="9" ry="13" fill="#6b9a5e" opacity="0.75" />
          <ellipse cx="95" cy="118" rx="8" ry="12" fill="#8fbc8f" opacity="0.65" />
          <ellipse cx="78" cy="138" rx="7" ry="11" fill="#7aad6e" opacity="0.7" />
          <circle cx="168" cy="38" r="4" fill="#9b7bb8" opacity="0.8" />
          <circle cx="152" cy="62" r="3.5" fill="#b08ec4" opacity="0.75" />
          <circle cx="132" cy="88" r="4" fill="#9b7bb8" opacity="0.8" />
          <circle cx="108" cy="108" r="3.5" fill="#b08ec4" opacity="0.7" />
          <circle cx="88" cy="128" r="3" fill="#9b7bb8" opacity="0.75" />
        </svg>
      </div>

      {/* Bottom-left herbs & bowl */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 hidden opacity-95 md:block"
        aria-hidden
      >
        <svg
          width="260"
          height="180"
          viewBox="0 0 260 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse cx="70" cy="155" rx="42" ry="12" fill="#3c2a21" opacity="0.08" />
          <path
            d="M45 130 Q55 100 65 130 Q75 100 85 130"
            stroke="#5a8a4a"
            strokeWidth="2.5"
            fill="none"
          />
          <path
            d="M95 125 Q105 95 115 125 Q125 95 135 125"
            stroke="#6b9a5e"
            strokeWidth="2"
            fill="none"
          />
          <rect x="38" y="128" width="8" height="28" rx="2" fill="#8B4513" opacity="0.85" />
          <rect x="48" y="132" width="7" height="24" rx="2" fill="#A0522D" opacity="0.8" />
          <rect x="56" y="130" width="8" height="26" rx="2" fill="#8B4513" opacity="0.85" />
          <polygon
            points="120,140 128,125 136,140 132,148 124,148"
            fill="#6B4226"
            opacity="0.9"
          />
          <polygon
            points="145,138 153,122 161,138 157,146 149,146"
            fill="#7B4B28"
            opacity="0.85"
          />
          <ellipse cx="195" cy="138" rx="28" ry="14" fill="#f5f2eb" stroke="#ddd" strokeWidth="1" />
          <ellipse cx="195" cy="134" rx="22" ry="8" fill="#e8e0d5" />
          <circle cx="188" cy="132" r="3" fill="#8fbc8f" opacity="0.6" />
          <circle cx="198" cy="130" r="2.5" fill="#c5a059" opacity="0.5" />
          <circle cx="205" cy="133" r="2" fill="#8fbc8f" opacity="0.55" />
        </svg>
      </div>

      {/* Bottom-center slide indicator */}
      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:flex">
        <div className="flex items-center gap-3 rounded-full bg-brown/80 px-3 py-1.5">
          <span className="text-xs text-white/70">‹</span>
          <div className="flex gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          </div>
          <span className="text-xs text-white/70">›</span>
        </div>
      </div>
    </>
  );
}
