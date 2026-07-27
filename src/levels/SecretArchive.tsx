import { useEffect, useState } from 'react'
import { useGameDispatch } from '../context/GameContext'
import { useAsset } from '../hooks/useAssetManifest'
import { SECRET_CONTENT } from '../content/gameContent'
import { ConsolePanel } from '../components/ConsolePanel'
import { playTerminalBeep } from '../utils/sound'
import './SecretArchive.css'

export function SecretArchive() {
  const dispatch = useGameDispatch()
  const { url: maniPhoto } = useAsset('mani')
  const [lines, setLines] = useState<string[]>([])

  useEffect(() => {
    let i = 0
    const interval = window.setInterval(() => {
      i += 1
      setLines(SECRET_CONTENT.terminalLines.slice(0, i))
      playTerminalBeep()
      if (i >= SECRET_CONTENT.terminalLines.length) window.clearInterval(interval)
    }, 400)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="secret-archive app-shell">
      <div className="secret-archive-content stack">
        <p className="secret-archive-code mono">{SECRET_CONTENT.levelName}</p>
        <ConsolePanel title="mani_archive" lines={lines} />

        <div className="secret-archive-photo-frame">
          {maniPhoto ? (
            <img src={maniPhoto} alt="Mani, de La Era de Hielo" className="secret-archive-photo" />
          ) : (
            <div className="secret-archive-placeholder stack">
              <p className="mono">{SECRET_CONTENT.placeholderTitle}</p>
              <p>{SECRET_CONTENT.placeholderSubtitle}</p>
            </div>
          )}
        </div>

        <button type="button" className="btn btn-gold" onClick={() => dispatch({ type: 'EXIT_SECRET' })}>
          Volver al deploy final
        </button>
      </div>
    </div>
  )
}
