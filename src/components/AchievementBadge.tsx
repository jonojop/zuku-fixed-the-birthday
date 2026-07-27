import { useEffect, useRef, useState } from 'react'
import './AchievementBadge.css'

interface AchievementBadgeProps {
  id: string
  icon: string
  title: string
  description: string
}

export function AchievementBadge({ id, icon, title, description }: AchievementBadgeProps) {
  const [open, setOpen] = useState(false)
  const [shiftX, setShiftX] = useState(0)
  const badgeRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLSpanElement>(null)
  const tooltipId = `achievement-tooltip-${id}`

  useEffect(() => {
    if (!open) return
    const badge = badgeRef.current
    const tooltip = tooltipRef.current
    if (!badge || !tooltip) return

    const margin = 8
    const badgeRect = badge.getBoundingClientRect()
    const tooltipWidth = tooltip.getBoundingClientRect().width
    const idealLeft = badgeRect.left + badgeRect.width / 2 - tooltipWidth / 2
    const idealRight = idealLeft + tooltipWidth

    let shift = 0
    if (idealLeft < margin) shift = margin - idealLeft
    else if (idealRight > window.innerWidth - margin) shift = window.innerWidth - margin - idealRight
    setShiftX(shift)
  }, [open])

  return (
    <span className="achievement-badge" ref={badgeRef}>
      <button
        type="button"
        className="achievement-icon-btn"
        aria-describedby={tooltipId}
        aria-label={title}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setOpen(false)
        }}
      >
        <span aria-hidden="true">{icon}</span>
      </button>
      <span
        role="tooltip"
        id={tooltipId}
        ref={tooltipRef}
        className={`achievement-tooltip${open ? ' achievement-tooltip-open' : ''}`}
        style={open ? { transform: `translateX(calc(-50% + ${shiftX}px)) translateY(0)` } : undefined}
      >
        <strong className="achievement-tooltip-title">{title}</strong>
        <span className="achievement-tooltip-desc">{description}</span>
      </span>
    </span>
  )
}
