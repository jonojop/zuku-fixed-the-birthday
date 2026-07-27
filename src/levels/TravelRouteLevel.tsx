import { LEVELS } from '../content/gameContent'
import { FixSequenceLevel } from '../components/FixSequenceLevel'
import './TravelRouteLevel.css'

const level = LEVELS.find((l) => l.id === 'travel-route')!

function Scene({ fixIndex, isComplete }: { fixIndex: number; isComplete: boolean }) {
  const destinationFixed = fixIndex >= 1
  const routeOrdered = fixIndex >= 2
  const passportReady = fixIndex >= 3

  return (
    <div className="travel-scene">
      <svg viewBox="0 0 320 180" className="travel-svg" role="img" aria-label="Ruta de viaje de Buenos Aires a Japón">
        {routeOrdered && (
          <path d="M60 130 Q160 30 260 60" stroke="var(--gold)" strokeWidth="2" strokeDasharray="6 6" fill="none" className="travel-route-path" />
        )}

        <g className="travel-node">
          <circle cx="60" cy="130" r="10" fill="var(--red-jp)" />
          <text x="60" y="150" textAnchor="middle" className="travel-label mono">
            BUE
          </text>
        </g>

        <g className="travel-node">
          <circle cx="260" cy="60" r="10" fill={destinationFixed ? 'var(--terminal-green)' : 'var(--white-warm)'} opacity={destinationFixed ? 1 : 0.3} />
          <text x="260" y="80" textAnchor="middle" className="travel-label mono">
            {destinationFixed ? 'NRT' : '???'}
          </text>
        </g>

        <g className={`travel-plane ${isComplete ? 'travel-plane-flying' : ''}`}>
          <path d="M0 0 L14 4 L0 8 L4 4 Z" fill="var(--sakura)" transform="translate(60,130) rotate(-35)" />
        </g>
      </svg>

      <div className="travel-items row">
        <div className={`travel-item ${passportReady ? 'travel-item-ready' : ''}`}>
          <span aria-hidden="true">🛂</span> Passport {passportReady ? '✓' : '…'}
        </div>
        <div className={`travel-item ${isComplete ? 'travel-item-ready' : ''}`}>
          <span aria-hidden="true">🧳</span> Suitcase {isComplete ? '✓' : '…'}
        </div>
      </div>
    </div>
  )
}

export function TravelRouteLevel() {
  return (
    <FixSequenceLevel
      level={level}
      introLine="La ruta de viaje hacia Japón está desconfigurada."
      scene={({ fixIndex, isComplete }) => <Scene fixIndex={fixIndex} isComplete={isComplete} />}
    />
  )
}
