import { LEVELS } from '../content/gameContent'
import { FixSequenceLevel } from '../components/FixSequenceLevel'
import { useGameDispatch } from '../context/GameContext'
import { useAsset } from '../hooks/useAssetManifest'
import './RestProtocolLevel.css'

const level = LEVELS.find((l) => l.id === 'rest-protocol')!

function Scene({ fixIndex, isComplete }: { fixIndex: number; isComplete: boolean }) {
  const notificationsPaused = fixIndex >= 1
  const brightnessAdjusted = fixIndex >= 2
  const autoSaveOn = fixIndex >= 3
  const breakTimerOn = fixIndex >= 4

  const { url: standingPhoto } = useAsset('zuku-standing')
  const { url: sittingPhoto } = useAsset('zuku-sitting')

  return (
    <div className="rest-scene">
      <div className={`rest-figure-frame${brightnessAdjusted ? ' rest-figure-dimmed' : ''}`}>
        {standingPhoto ? (
          <img
            src={standingPhoto}
            alt="Zuku programando de pie"
            className={`rest-figure rest-figure-standing${isComplete ? ' rest-figure-hidden' : ''}${!isComplete ? ' rest-figure-typing' : ''}`}
          />
        ) : (
          !isComplete && (
            <div className="rest-figure-placeholder mono" aria-hidden="true">
              Zuku standing
            </div>
          )
        )}

        {sittingPhoto ? (
          <img
            src={sittingPhoto}
            alt="Zuku sentado descansando"
            className={`rest-figure rest-figure-sitting${isComplete ? ' rest-figure-visible' : ''}`}
          />
        ) : (
          isComplete && (
            <div className="rest-figure-placeholder mono" aria-hidden="true">
              Zuku sitting
            </div>
          )
        )}

        {isComplete && <p className="rest-session-caption mono">Work session completed</p>}
      </div>

      <div className="rest-hud mono" role="status" aria-label="Estado del entorno de descanso">
        <p className={notificationsPaused ? 'rest-hud-ok' : ''}>
          {notificationsPaused ? '✓' : '○'} notifications: {notificationsPaused ? 'paused' : 'infinite'}
        </p>
        <p className={brightnessAdjusted ? 'rest-hud-ok' : ''}>
          {brightnessAdjusted ? '✓' : '○'} monitorBrightness: {brightnessAdjusted ? '70' : '180'}
        </p>
        <p className={autoSaveOn ? 'rest-hud-ok' : ''}>
          {autoSaveOn ? '✓' : '○'} autoSave: {autoSaveOn ? 'true' : 'false'}
        </p>
        <p className={breakTimerOn ? 'rest-hud-ok' : ''}>
          {breakTimerOn ? '✓' : '○'} breakTimer: {breakTimerOn ? 'enabled' : 'undefined'}
        </p>
      </div>
    </div>
  )
}

export function RestProtocolLevel() {
  const dispatch = useGameDispatch()
  return (
    <FixSequenceLevel
      level={level}
      introLine="Zuku lleva demasiado tiempo programando de pie."
      scene={({ fixIndex, isComplete }) => <Scene fixIndex={fixIndex} isComplete={isComplete} />}
      onFixApplied={(fixId) => {
        if (fixId === 'break-complete') dispatch({ type: 'SEAT_ZUKU' })
      }}
    />
  )
}
