import { useEffect, useRef } from 'react'
import { LEVELS } from '../content/gameContent'
import { FixSequenceLevel } from '../components/FixSequenceLevel'
import { playDeployTick } from '../utils/sound'
import './EventHandlerLevel.css'

const level = LEVELS.find((l) => l.id === 'event-handler')!

function Scene({ fixIndex, isComplete }: { fixIndex: number; isComplete: boolean }) {
  const stage = Math.min(fixIndex, 3)
  const announced = useRef(false)

  useEffect(() => {
    if (isComplete && !announced.current) {
      announced.current = true
      playDeployTick()
    }
  }, [isComplete])

  return (
    <div className={`event-scene event-scene-stage-${stage}`}>
      <div className="event-scene-glitch mono">
        {stage === 0 && 'TypeError: undefined is not a function'}
        {stage === 1 && 'Warning: default action not prevented'}
        {stage === 2 && 'Warning: handler not connected'}
        {stage >= 3 && 'All systems nominal'}
      </div>
      <button type="button" className="event-scene-button" tabIndex={-1} aria-hidden="true">
        {stage >= 3 ? 'DEPLOY ✓' : 'START'}
      </button>
      {isComplete && (
        <div className="event-deploy-stamp mono" aria-hidden="true">
          DEPLOYED
        </div>
      )}
    </div>
  )
}

export function EventHandlerLevel() {
  return (
    <FixSequenceLevel
      level={level}
      introLine="3 errores críticos detectados en el sistema de eventos."
      scene={({ fixIndex, isComplete }) => <Scene fixIndex={fixIndex} isComplete={isComplete} />}
    />
  )
}
