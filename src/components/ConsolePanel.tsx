import './ConsolePanel.css'

interface ConsolePanelProps {
  lines: string[]
  title?: string
}

export function ConsolePanel({ lines, title = 'console' }: ConsolePanelProps) {
  return (
    <div className="console-panel mono scanlines">
      <div className="console-panel-header">
        <span className="console-dot console-dot-red" />
        <span className="console-dot console-dot-gold" />
        <span className="console-dot console-dot-green" />
        <span className="console-panel-title">{title}</span>
      </div>
      <div className="console-panel-body" aria-live="polite">
        {lines.map((line, i) => (
          <p key={i} className="console-line">
            <span className="console-caret" aria-hidden="true">
              &gt;
            </span>{' '}
            {line}
          </p>
        ))}
      </div>
    </div>
  )
}
