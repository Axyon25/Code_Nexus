import { useId } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '../../utils/cn'

const TONE = {
  info: { icon: 'bg-[var(--accent-soft)] text-[var(--accent)]', stroke: 'var(--accent)' },
  success: { icon: 'bg-[var(--success-soft)] text-[var(--success)]', stroke: 'var(--success)' },
  warning: { icon: 'bg-[var(--warning-soft)] text-[var(--warning)]', stroke: 'var(--warning)' },
  danger: { icon: 'bg-[var(--danger-soft)] text-[var(--danger)]', stroke: 'var(--danger)' },
  violet: { icon: 'bg-[var(--violet-soft)] text-[var(--violet)]', stroke: 'var(--violet)' },
}

function Sparkline({ series, stroke }) {
  const rawId = useId()
  const id = `spark-${rawId.replace(/[^a-zA-Z0-9]/g, '')}`
  const width = 84
  const height = 30
  const max = Math.max(...series, 1)
  const min = Math.min(...series, 0)
  const range = max - min || 1
  const points = series.map((value, index) => {
    const x = (index / (series.length - 1)) * width
    const y = height - ((value - min) / range) * (height - 4) - 2
    return [x, y]
  })
  const line = points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const area = `${line} L${width},${height} L0,${height} Z`

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="shrink-0" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.24" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function StatCard({ label, value, delta, deltaLabel = 'vs last month', icon: Icon, tone = 'info', series = [3, 5, 4, 6, 5, 8, 7, 9] }) {
  const toneMeta = TONE[tone] ?? TONE.info
  const positive = delta >= 0

  return (
    <article className="glass-card glass-card-lift relative overflow-hidden p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-subtle">{label}</p>
          <p className="mt-2 text-[28px] font-semibold leading-none tracking-[-0.04em] text-ink tabular-nums">
            {value}
          </p>
        </div>
        {Icon && (
          <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl', toneMeta.icon)}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between gap-2">
        <div>
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-[10px] font-semibold',
              positive ? 'text-[var(--success)]' : 'text-[var(--danger)]',
            )}
          >
            {positive ? (
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            ) : (
              <ArrowDownRight className="h-3 w-3" aria-hidden="true" />
            )}
            {Math.abs(delta)}%
          </span>
          <span className="ml-1.5 text-[9px] text-subtle">{deltaLabel}</span>
        </div>
        <Sparkline series={series} stroke={toneMeta.stroke} />
      </div>
    </article>
  )
}
