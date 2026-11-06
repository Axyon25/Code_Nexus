import { Link } from 'react-router-dom'
import { ArrowUpRight, ClipboardCheck } from 'lucide-react'
import { useAppData } from '../../context/useAppData'
import { SEVERITIES, SEVERITY_META, getScoreTone, reviewNeedsApproval } from '../../utils/status'
import { ProgressRing } from '../common/ProgressRing'

export function ReviewHealth() {
  const { reviews } = useAppData()
  const average = reviews.length
    ? Math.round(reviews.reduce((total, review) => total + review.complianceScore, 0) / reviews.length)
    : 0
  const openFindings = reviews.flatMap((review) => review.findings).filter((finding) => finding.status === 'pending')
  const pendingApprovals = reviews.filter(reviewNeedsApproval).length
  const tone = getScoreTone(average)

  const counts = SEVERITIES.map((severity) => ({
    severity,
    count: openFindings.filter((finding) => finding.severity === severity).length,
  }))
  const max = Math.max(...counts.map((item) => item.count), 1)

  return (
    <section className="glass-card flex flex-col p-4 sm:p-5" aria-labelledby="health-heading">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 id="health-heading" className="text-sm font-semibold tracking-tight text-ink">
            Review health
          </h2>
          <p className="mt-0.5 text-[10px] text-subtle">Across all demo reviews</p>
        </div>
        <span className="badge tone-approved">{tone.label}</span>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <ProgressRing value={average} size={104} strokeWidth={8} label={`Average compliance ${average}`} />
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-subtle">
            Average score
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            Baseline compliance across {reviews.length} recorded reviews.
          </p>
          <div className="mt-2.5 flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--panel-muted)] px-2 py-1.5">
            <ClipboardCheck className="h-3 w-3 text-[var(--accent)]" aria-hidden="true" />
            <span className="text-[10px] font-medium text-ink">
              {pendingApprovals} awaiting human approval
            </span>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-subtle">
          Open findings by severity
        </p>
        {counts.map(({ severity, count }) => {
          const meta = SEVERITY_META[severity]
          return (
            <div key={severity} className="flex items-center gap-2.5">
              <span className={`badge tone-${meta.tone} w-[68px] justify-center !px-1.5 !py-0 !text-[9px]`}>
                {meta.label}
              </span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--line)]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.round((count / max) * 100)}%`,
                    background: `var(--${severity === 'medium' ? 'teal' : severity === 'high' ? 'warning' : severity === 'critical' ? 'danger' : 'neutral'})`,
                  }}
                />
              </div>
              <span className="w-5 text-right text-[10px] font-semibold text-ink tabular-nums">{count}</span>
            </div>
          )
        })}
      </div>

      <Link
        to="/history"
        className="mt-auto flex items-center justify-between border-t border-[var(--line)] pt-3 text-[10px] font-medium text-muted transition-colors hover:text-ink"
      >
        Open review history
        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
      </Link>
    </section>
  )
}
