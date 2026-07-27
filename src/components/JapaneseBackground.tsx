import './JapaneseBackground.css'

const PETALS = Array.from({ length: 10 }, (_, i) => i)

export function JapaneseBackground() {
  return (
    <div className="app-background" aria-hidden="true">
      <svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMax slice" focusable="false">
        <defs>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f8f3e7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f8f3e7" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="fujiGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c2740" />
            <stop offset="100%" stopColor="#0d1220" />
          </linearGradient>
        </defs>

        <circle cx="960" cy="130" r="140" fill="url(#moonGlow)" />
        <circle cx="960" cy="130" r="58" fill="#f8f3e7" opacity="0.95" />

        {/* Mount Fuji */}
        <path d="M300 560 L560 220 L640 300 L760 190 L1020 560 Z" fill="url(#fujiGrad)" />
        <path d="M560 220 L610 270 L640 300 L660 280 L620 245 Z" fill="#f8f3e7" opacity="0.85" />
        <path d="M760 190 L800 235 L830 260 L790 300 L740 250 Z" fill="#f8f3e7" opacity="0.6" />

        {/* Torii gate */}
        <g stroke="#9d1c2f" strokeWidth="10" strokeLinecap="round" fill="none">
          <line x1="150" y1="420" x2="150" y2="600" />
          <line x1="330" y1="420" x2="330" y2="600" />
          <line x1="120" y1="430" x2="360" y2="430" />
          <line x1="100" y1="400" x2="380" y2="400" />
        </g>
        <line x1="180" y1="470" x2="300" y2="470" stroke="#9d1c2f" strokeWidth="6" />

        {/* Ground line */}
        <line x1="0" y1="600" x2="1200" y2="600" stroke="#1c2740" strokeWidth="2" opacity="0.6" />
      </svg>

      <div className="sakura-layer">
        {PETALS.map((i) => (
          <span
            key={i}
            className="sakura-petal"
            style={{
              left: `${(i * 97) % 100}%`,
              animationDelay: `${i * 1.7}s`,
              animationDuration: `${14 + (i % 5) * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
