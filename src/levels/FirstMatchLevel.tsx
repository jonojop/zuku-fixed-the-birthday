import { LEVELS } from '../content/gameContent'
import { FixSequenceLevel } from '../components/FixSequenceLevel'
import { useAsset } from '../hooks/useAssetManifest'
import './FirstMatchLevel.css'

const level = LEVELS.find((l) => l.id === 'first-match')!

function Scene({ fixIndex, isComplete }: { fixIndex: number; isComplete: boolean }) {
  const goalFixed = fixIndex >= 1
  const ballVisible = fixIndex >= 2
  const playersFixed = fixIndex >= 3
  const { url: handballPhoto } = useAsset('handball-photo')

  return (
    <div className="handball-scene">
      <svg viewBox="0 0 300 200" className="handball-court" role="img" aria-label="Cancha de handball">
        <rect x="4" y="4" width="292" height="192" fill="none" stroke="var(--white-warm)" strokeOpacity="0.3" strokeWidth="2" />
        <line x1="150" y1="4" x2="150" y2="196" stroke="var(--white-warm)" strokeOpacity="0.2" strokeWidth="2" />
        <circle cx="150" cy="100" r="24" fill="none" stroke="var(--white-warm)" strokeOpacity="0.2" strokeWidth="2" />

        <rect
          className="handball-goal"
          x={goalFixed ? 130 : 250}
          y={goalFixed ? 8 : 90}
          width="40"
          height="14"
          fill="var(--gold)"
          rx="2"
        />

        <circle
          className="handball-player"
          cx={playersFixed ? 120 : 20}
          cy={playersFixed ? 120 : 190}
          r="9"
          fill="var(--red-jp)"
        />
        <circle
          className="handball-player"
          cx={playersFixed ? 180 : 280}
          cy={playersFixed ? 120 : 10}
          r="9"
          fill="var(--sakura)"
        />

        <circle className="handball-ball" cx="150" cy="140" r="6" fill="var(--white-warm)" opacity={ballVisible ? 1 : 0} />
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
