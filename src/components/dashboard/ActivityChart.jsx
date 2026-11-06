import { useMemo, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { chartData } from '../../data/mockData'
import { formatNumber } from '../../utils/format'
import { SegmentedControl } from '../common/SegmentedControl'

const RANGES = [
  { value: '7', label: '7d' },
  { value: '14', label: '14d' },
  { value: '30', label: '30d' },
  { value: '90', label: '90d' },
]

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-popover px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-subtle">{label}</p>
      <div className="mt-1.5 space-y-1">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-5 text-[10px]">
            <span className="flex items-center gap-1.5 text-muted">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: entry.stroke }}
                aria-hidden="true"
              />
              {entry.dataKey === 'reviews' ? 'Reviews' : 'Issues'}
            </span>
            <span className="font-semibold text-ink tabular-nums">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ActivityChart() {
  const [range, setRange] = useState('14')
  const reduceMotion = useReducedMotion()
  const data = useMemo(() => chartData.slice(-Number(range)), [range])

  const totals = useMemo(
    () =>
      data.reduce(
        (acc, point) => ({ reviews: acc.reviews + point.reviews, issues: acc.issues + point.issues }),
        { reviews: 0, issues: 0 },
      ),
    [data],
  )

  return (
    <section className="glass-card flex flex-col p-4 sm:p-5" aria-labelledby="activity-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="activity-heading" className="text-sm font-semibold tracking-tight text-ink">
            Review activity
          </h2>
          <p className="mt-0.5 text-[10px] text-subtle">
            Content reviews and detected issues over time
          </p>
        </div>
        <SegmentedControl
          options={RANGES}
          value={range}
          onChange={setRange}
          size="sm"
          label="Chart range"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-5">
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-subtle">Reviews</p>
          <p className="mt-0.5 text-xl font-semibold tracking-tight text-ink tabular-nums">
            {formatNumber(totals.reviews)}
          </p>
        </div>
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-subtle">Issues</p>
          <p className="mt-0.5 text-xl font-semibold tracking-tight text-ink tabular-nums">
            {formatNumber(totals.issues)}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3 pb-0.5 text-[9px] text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" aria-hidden="true" />
            Reviews
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--orange)]" aria-hidden="true" />
            Issues
          </span>
        </div>
      </div>

      <div className="mt-2 h-[228px] w-full sm:h-[248px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 12, right: 4, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="reviewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.26} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="issuesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--orange)" stopOpacity={0.16} />
                <stop offset="100%" stopColor="var(--orange)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="var(--line)" vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              minTickGap={28}
              tick={{ fill: 'var(--ink-subtle)', fontSize: 9 }}
              dy={6}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={42}
              tick={{ fill: 'var(--ink-subtle)', fontSize: 9 }}
              allowDecimals={false}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--line-strong)', strokeDasharray: '3 4' }} />
            <Area
              type="monotone"
              dataKey="reviews"
              stroke="var(--accent)"
              strokeWidth={2}
              fill="url(#reviewsGradient)"
              isAnimationActive={!reduceMotion}
              animationDuration={600}
            />
            <Area
              type="monotone"
              dataKey="issues"
              stroke="var(--orange)"
              strokeWidth={1.5}
              fill="url(#issuesGradient)"
              isAnimationActive={!reduceMotion}
              animationDuration={600}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
