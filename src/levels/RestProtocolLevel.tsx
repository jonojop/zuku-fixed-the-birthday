import { LEVELS } from '../content/gameContent'
import { FixSequenceLevel } from '../components/FixSequenceLevel'
import { useGameDispatch } from '../context/GameContext'
import { useAsset } from '../hooks/useAssetManifest'
import './RestProtocolLevel.css'

const level = LEVELS.find((l) => l.id === 'rest-protocol')!

function Scene({ fixIndex, isComplete }: { fixIndex: number; isComplete: boolean }) {
  const chairVisible = fixIndex >= 1
  const chairPositioned = fixIndex >= 2
  const monitorDimmed = fixIndex >= 3
  const restModeOn = fixIndex >= 4
  const seated = isComplete
  const { url: zukuPhoto } = useAsset('zuku-animated')

  const headBox = seated ? { x: 118, y: 108, size: 44 } : { x: 128, y: 40, size: 44 }

  return (
    <div className="rest-scene">
      <svg viewBox="0 0 300 220" className="rest-svg" role="img" aria-label="Escena de descanso de Zuku">
        <defs>
          <clipPath id="headClip">
            <circle cx={headBox.x + headBox.size / 2} cy={headBox.y + headBox.size / 2} r={headBox.size / 2} />
          </clipPath>
        </defs>

        {/* Desk */}
        <rect x="60" y="150" width="150" height="8" fill="var(--gold)" opacity="0.7" />
        <rect x="70" y="158" width="8" height="40" fill="var(--gold)" opacity="0.5" />
        <rect x="192" y="158" width="8" height="40" fill="var(--gold)" opacity="0.5" />

        {/* Monitor */}
        <rect x="95" y="110" width="70" height="46" rx="4" fill="#1c2740" stroke="var(--sakura)" strokeWidth="2" />
        <rect x="99" y="114" width="62" height="34" rx="2" fill="var(--white-warm)" opacity={monitorDimmed ? 0.25 : 0.9} className="rest-monitor-glow" />

        {/* Chair */}
        <g
          className={`rest-chair ${chairVisible ? 'rest-chair-visible' : 'rest-chair-hidden'}`}
          transform={chairPositioned ? 'translate(150,150)' : 'translate(250,20)'}
        >
          <rect x="-16" y="0" width="32" height="8" rx="2" fill="var(--red-jp)" />
          <rect x="-16" y="8" width="6" height="26" fill="var(--red-jp)" opacity="0.8" />
          <rect x="10" y="8" width="6" height="26" fill="var(--red-jp)" opacity="0.8" />
          <rect x="-16" y="-26" width="32" height="26" rx="4" fill="var(--red-jp)" opacity="0.9" />
        </g>

        {/* Zuku body (SVG), head is the real photo when available */}
        <g className={seated ? 'rest-body rest-body-seated' : 'rest-body rest-body-standing'}>
          {seated ? (
            <>
              <rect x="103" y="140" width="34" height="30" rx="8" fill="var(--sakura)" />
              <rect x="98" y="168" width="16" height="24" fill="#2b2f3a" />
              <rect x="126" y="168" width="16" height="24" fill="#2b2f3a" />
            </>
          ) : (
            <>
              <rect x="103" y="72" width="34" height="46" rx="8" fill="var(--sakura)" />
              <rect x="98" y="116" width="16" height="50" fill="#2b2f3a" />
              <rect x="126" y="116" width="16" height="50" fill="#2b2f3a" />
              <rect x="86" y="90" width="18" height="8" rx="4" fill="var(--sakura)" />
              <rect x="136" y="90" width="18" height="8" rx="4" fill="var(--sakura)" />
            </>
          )}

          {zukuPhoto ? (
            <image
              href={zukuPhoto}
              x={headBox.x}
              y={headBox.y}
              width={headBox.size}
              height={headBox.size}
              clipPath="url(#headClip)"
              preserveAspectRatio="xMidYMid slice"
            />
          ) : (
            <g clipPath="url(#headClip)">
              <rect x={headBox.x} y={headBox.y} width={headBox.size} height={headBox.size} fill="var(--gold)" />
              <circle cx={headBox.x + 14} cy={headBox.y + 20} r="2.5" fill="#1c1208" />
              <circle cx={headBox.x + 30} cy={headBox.y + 20} r="2.5" fill="#1c1208" />
            </g>
          )}
        </g>

        {restModeOn && (
          <g className="rest-cup">
            <rect x="170" y="140" width="14" height="12" rx="2" fill="var(--white-warm)" />
          </g>
        )}
      </svg>

      {seated && <p className="rest-scene-caption mono">restMode: stable</p>}
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
        if (fixId === 'sit-zuku') dispatch({ type: 'SEAT_ZUKU' })
      }}
    />
  )
}
