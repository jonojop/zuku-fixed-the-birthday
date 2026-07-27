import { LEVELS } from '../content/gameContent'
import { FixSequenceLevel } from '../components/FixSequenceLevel'
import { useAsset } from '../hooks/useAssetManifest'
import './FirstMatchLevel.css'

const level = LEVELS.find((l) => l.id === 'first-match')!

function Scene({ fixIndex, isComplete }: { fixIndex: number; isComplete: boolean }) {
  const leftGoalFixed = fixIndex >= 1
  const rightGoalFixed = fixIndex >= 2
  const ballVisible = fixIndex >= 3
  const { url: handballPhoto } = useAsset('handball-photo')

  return (
    <div className="handball-scene">
      <svg viewBox="0 0 320 180" className="handball-court" role="img" aria-label="Cancha de handball, orientación horizontal, un arco a cada lado">
        {/* Court outline */}
        <rect x="10" y="10" width="300" height="160" fill="none" stroke="var(--white-warm)" strokeOpacity="0.35" strokeWidth="2" />
        {/* Center line */}
        <line x1="160" y1="10" x2="160" y2="170" stroke="var(--white-warm)" strokeOpacity="0.25" strokeWidth="2" />
        <circle cx="160" cy="90" r="14" fill="none" stroke="var(--white-warm)" strokeOpacity="0.25" strokeWidth="2" />

        {/* Left goal + 6m area */}
        <g className={`handball-goal-group ${leftGoalFixed ? 'handball-goal-fixed' : 'handball-goal-broken-left'}`}>
          <path d="M10,45 A62,62 0 0,1 10,135" fill="none" stroke="var(--gold)" strokeOpacity="0.5" strokeWidth="2" />
          <path
            d="M10,20 A98,98 0 0,1 10,160"
            fill="none"
            stroke="var(--white-warm)"
            strokeOpacity="0.2"
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />
          <rect x="4" y="72" width="10" height="36" fill="var(--gold)" />
        </g>

        {/* Right goal + 6m area */}
        <g className={`handball-goal-group ${rightGoalFixed ? 'handball-goal-fixed' : 'handball-goal-broken-right'}`}>
          <path d="M310,45 A62,62 0 0,0 310,135" fill="none" stroke="var(--gold)" strokeOpacity="0.5" strokeWidth="2" />
          <path
            d="M310,20 A98,98 0 0,0 310,160"
            fill="none"
            stroke="var(--white-warm)"
            strokeOpacity="0.2"
            strokeWidth="1.5"
            strokeDasharray="4 5"
          />
          <rect x="306" y="72" width="10" height="36" fill="var(--gold)" />
        </g>

        {/* Players: red = Jono, pink = Zuku — separated until the match kicks off */}
        <g className={`handball-player-group ${isComplete ? 'handball-players-met' : ''}`}>
          <circle className="handball-player handball-player-jono" cx={isComplete ? 140 : 250} cy={isComplete ? 90 : 40} r="16" fill="var(--red-jp)" />
          <text className="handball-player-label" x={isComplete ? 140 : 250} y={isComplete ? 94 : 44} textAnchor="middle">
            Jono
          </text>

          <circle className="handball-player handball-player-zuku" cx={isComplete ? 180 : 60} cy={isComplete ? 90 : 145} r="16" fill="var(--sakura)" />
          <text className="handball-player-label handball-player-label-dark" x={isComplete ? 180 : 60} y={isComplete ? 94 : 149} textAnchor="middle">
            Zuku
          </text>
        </g>

        <circle
          className={`handball-ball ${isComplete ? 'handball-ball-in-play' : ''}`}
          cx="160"
          cy="90"
          r="6"
          fill="var(--white-warm)"
          opacity={ballVisible ? 1 : 0}
        />
      </svg>

      {isComplete && (
        <div className="handball-memory stack">
          <p className="handball-memory-text">
            Acá empezó todo:
            <br />
            una cancha de handball,
            <br />
            dos jugadores
            <br />y una amistad que siguió creciendo.
          </p>
          {handballPhoto && <img src={handballPhoto} alt="Recuerdo de la cancha de handball" className="handball-photo" />}
        </div>
      )}
    </div>
  )
}

export function FirstMatchLevel() {
  return (
    <FixSequenceLevel
      level={level}
      introLine="El registro de la primera cancha está corrupto."
      scene={({ fixIndex, isComplete }) => <Scene fixIndex={fixIndex} isComplete={isComplete} />}
    />
  )
}
