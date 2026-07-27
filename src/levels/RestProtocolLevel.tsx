import { useState } from 'react'
import { LEVELS, REST_PROTOCOL_CONTENT } from '../content/gameContent'
import { FixSequenceLevel } from '../components/FixSequenceLevel'
import { LevelLayout } from '../components/LevelLayout'
import { useGameDispatch, useGameState } from '../context/GameContext'
import { useAsset } from '../hooks/useAssetManifest'
import { playDeployTick, playSessionClose } from '../utils/sound'
import { LEVEL_ORDER } from '../types/game'
import './RestProtocolLevel.css'

const level = LEVELS.find((l) => l.id === 'rest-protocol')!

function DebuggingScene({ fixIndex, isComplete }: { fixIndex: number; isComplete: boolean }) {
  const notificationsPaused = fixIndex >= 1
  const brightnessAdjusted = fixIndex >= 2
  const autoSaveOn = fixIndex >= 3
  const breakTimerOn = fixIndex >= 4

  const { url: standingPhoto } = useAsset('zuku-standing')
  const { url: sittingPhoto } = useAsset('zuku-sitting')

  const dim = isComplete ? 0.62 : brightnessAdjusted ? 0.82 : 1

  return (
    <div className="rest-scene">
      <div className="rest-figure-frame" style={{ filter: `brightness(${dim})` }}>
        {standingPhoto ? (
          <img
            src={standingPhoto}
            alt="Zuku programando de pie, de espaldas"
            className={`rest-figure zukuStanding rest-figure-enter${isComplete ? ' rest-figure-hidden' : ' rest-figure-breathing'}`}
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
            alt="Zuku sentado descansando, de espaldas"
            className={`rest-figure zukuSitting${isComplete ? ' rest-figure-visible' : ''}`}
          />
        ) : (
          isComplete && (
            <div className="rest-figure-placeholder mono" aria-hidden="true">
              Zuku sitting
            </div>
          )
        )}

        {!notificationsPaused && (
          <div className="rest-notifications" aria-hidden="true">
            <span className="rest-notification-dot" />
            <span className="rest-notification-dot rest-notification-dot-2" />
          </div>
        )}

        {!isComplete && (
          <div className={`rest-badge rest-badge-save mono${autoSaveOn ? ' rest-badge-done' : ''}`}>
            {autoSaveOn ? '✓ All changes saved' : '● Saving...'}
          </div>
        )}

        {breakTimerOn && !isComplete && <div className="rest-badge rest-badge-timer mono">⏱ break timer ready</div>}

        {isComplete && <p className="rest-session-caption mono">{REST_PROTOCOL_CONTENT.sessionCompletedCaption}</p>}
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

function IntroScene({ transitioning }: { transitioning: boolean }) {
  const { url: selfiePhoto } = useAsset('zuku-selfie')
  const { url: standingFallback } = useAsset('zuku-standing')
  const photo = selfiePhoto ?? standingFallback
  const usingFallbackFraming = !selfiePhoto && !!standingFallback

  return (
    <div className="rest-scene">
      <div className={`rest-figure-frame${transitioning ? ' rest-intro-transitioning' : ''}`}>
        {photo ? (
          <img
            src={photo}
            alt="Zuku mirando hacia la cámara"
            className={`rest-figure zukuSelfie${usingFallbackFraming ? ' zukuSelfieFallbackFraming' : ''}`}
          />
        ) : (
          <div className="rest-figure-placeholder mono" aria-hidden="true">
            Zuku selfie
          </div>
        )}
      </div>
    </div>
  )
}

export function RestProtocolLevel() {
  const dispatch = useGameDispatch()
  const state = useGameState()
  const [debuggingStarted, setDebuggingStarted] = useState(false)
  const [transitioning, setTransitioning] = useState(false)

  function handleStartDebugging() {
    playDeployTick()
    setTransitioning(true)
    const delay = state.skipAnimations ? 60 : 850
    window.setTimeout(() => {
      setDebuggingStarted(true)
      setTransitioning(false)
    }, delay)
  }

  if (!debuggingStarted) {
    return (
      <LevelLayout
        code={level.code}
        title={level.title}
        mission={level.mission}
        fixDone={0}
        fixTotal={level.fixCount}
        overallDone={state.levelsCompleted.length}
        overallTotal={LEVEL_ORDER.length}
        consoleLines={REST_PROTOCOL_CONTENT.introLines}
        scene={<IntroScene transitioning={transitioning} />}
      >
        <div className="panel stack rest-intro-panel">
          <p className="mono">Cinco correcciones requeridas antes de poder descansar.</p>
          <button type="button" className="btn btn-primary" onClick={handleStartDebugging} disabled={transitioning}>
            {REST_PROTOCOL_CONTENT.startButtonLabel}
          </button>
        </div>
      </LevelLayout>
    )
  }

  return (
    <FixSequenceLevel
      level={level}
      introLine="Zuku lleva demasiado tiempo programando de pie."
      scene={({ fixIndex, isComplete }) => <DebuggingScene fixIndex={fixIndex} isComplete={isComplete} />}
      onFixApplied={(fixId) => {
        if (fixId === 'break-complete') {
          playSessionClose()
          dispatch({ type: 'SEAT_ZUKU' })
        }
      }}
    />
  )
}
