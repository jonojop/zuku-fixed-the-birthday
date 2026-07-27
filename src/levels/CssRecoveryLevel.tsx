import { LEVELS } from '../content/gameContent'
import { FixSequenceLevel } from '../components/FixSequenceLevel'
import './CssRecoveryLevel.css'

const level = LEVELS.find((l) => l.id === 'css-recovery')!

function Scene({ fixIndex }: { fixIndex: number }) {
  const stage = Math.min(fixIndex, 4)
  return (
    <div className={`css-scene css-scene-stage-${stage}`}>
      <div className="css-card">
        <div className="css-card-avatar" />
        <div className="css-card-title mono">card.tsx</div>
        <p className="css-card-text">Bienvenido de nuevo, Zuku.</p>
        <button type="button" className="css-card-button" tabIndex={-1} aria-hidden="true">
          Ver detalles
        </button>
      </div>
    </div>
  )
}

export function CssRecoveryLevel() {
  return (
    <FixSequenceLevel
      level={level}
      introLine="La tarjeta de bienvenida perdió todos sus estilos."
      scene={({ fixIndex }) => <Scene fixIndex={fixIndex} />}
    />
  )
}
