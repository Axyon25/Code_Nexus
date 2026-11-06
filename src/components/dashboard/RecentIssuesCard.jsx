import { Link } from 'react-router-dom'
import { ArrowUpRight, ScanSearch } from 'lucide-react'
import { useAppData } from '../../context/useAppData'
import { CATEGORY_META, SEVERITY_META } from '../../utils/status'
import { EmptyState } from '../common/EmptyState'

export function RecentIssuesCard() {
  const { reviews } = useAppData()
  const issues = [...reviews]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .flatMap((review) =>
      review.findings
        .filter((finding) => finding.status === 'pending')
        .map((finding) => ({ ...finding, review })),
    )
    .slice(0, 4)

  return (
    <section className="glass-card flex flex-col p-4 sm:p-5" aria-labelledby="issues-heading">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 id="issues-heading" className="text-sm font-semibold tracking-tight text-ink">
            Recent detected issues
          </h2>
          <p className="mt-0.5 text-[10px] text-subtle">Open findings awaiting a human decision</p>
        </div>
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--violet-soft)] text-[var(--violet)]">
          <ScanSearch className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-3 flex-1 space-y-2">
        {issues.length === 0 ? (
          <EmptyState
            icon={ScanSearch}
            title="No open issues"
            description="Every finding has a recorded decision."
            className="py-6"
          />
        ) : (
          issues.map((issue) => {
            const category = CATEGORY_META[issue.category] ?? { label: issue.category, tone: 'neutral' }
            const severity = SEVERITY_META[issue.severity] ?? SEVERITY_META.low
            return (
              <Link
                key={issue.id}
                to={`/review/${issue.review.id}`}
                className="group block rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] p-3 transition-all hover:border-[var(--line-strong)] hover:bg-[var(--hover-surface)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`badge tone-${category.tone} !px-1.5 !py-0 !text-[8px]`}>
                    {category.label}
                  </span>
                  <span className={`badge tone-${severity.tone} !px-1.5 !py-0 !text-[8px]`}>
                    {severity.label}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-[10px] leading-relaxed text-ink">
                  “{issue.originalText}”
                </p>
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <span className="truncate text-[9px] text-subtle">{issue.review.title}</span>
                  <ArrowUpRight className="h-3 w-3 shrink-0 text-subtle opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                </div>
              </Link>
            )
          })
        )}
      </div>
    </section>
  )
}
