import { cn } from '../../utils/cn'
import { getScoreTone } from '../../utils/status'

const STROKE = {
  success: 'var(--success)',
  info: 'var(--accent)',
  warning: 'var(--warning)',
  danger: 'var(--danger)',
}

export function ProgressRing({
  value = 0,
  size = 92,
  strokeWidth = 7,
  showValue = true,
  label,
  tone,
  className,
  children,
}) {
  const clamped = Math.max(0, Math.min(100, value))
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (clamped / 100) * circumference
  const derivedTone = getScoreTone(clamped).tone
  const colour = STROKE[tone ?? derivedTone] ?? STROKE.info

  return (
    <div
      className={cn('relative inline-grid place-items-center', className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label ?? `Compliance score ${Math.round(clamped)} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--line)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colour}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center">
        {children ?? (
          showValue && (
            <span className="flex flex-col items-center leading-none">
              <span className="text-xl font-semibold tracking-tight text-ink">
                {Math.round(clamped)}
              </span>
              <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-subtle">
                / 100
              </span>
            </span>
          )
        )}
      </span>
    </div>
  )
}
