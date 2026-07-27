import './FinalBalloons.css'

const BALLOONS = [
  { left: 4, size: 34, duration: 11, delay: 0, color: 'var(--red-jp)' },
  { left: 14, size: 26, duration: 9, delay: 1.2, color: 'var(--gold)' },
  { left: 24, size: 40, duration: 13, delay: 2.4, color: 'var(--sakura)' },
  { left: 36, size: 28, duration: 10, delay: 0.6, color: 'var(--terminal-green)' },
  { left: 48, size: 32, duration: 12, delay: 3.1, color: 'var(--red-jp)' },
  { left: 60, size: 24, duration: 8.5, delay: 1.8, color: 'var(--gold)' },
  { left: 70, size: 36, duration: 11.5, delay: 0.3, color: 'var(--sakura)' },
  { left: 80, size: 27, duration: 9.5, delay: 2.7, color: 'var(--terminal-green)' },
  { left: 90, size: 30, duration: 12.5, delay: 1.1, color: 'var(--gold)' },
  { left: 96, size: 22, duration: 10.5, delay: 3.6, color: 'var(--red-jp)' },
]

export function FinalBalloons() {
  return (
    <div className="final-balloons" aria-hidden="true">
      {BALLOONS.map((b, i) => (
        <span
          key={i}
          className={`final-balloon${i >= 5 ? ' final-balloon-desktop-only' : ''}`}
          style={{
            left: `${b.left}%`,
            width: `${b.size}px`,
            height: `${b.size * 1.2}px`,
            background: b.color,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
