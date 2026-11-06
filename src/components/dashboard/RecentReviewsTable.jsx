import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { useAppData } from '../../context/useAppData'
import { relativeTime } from '../../utils/format'
import { getScoreTone } from '../../utils/status'
import { Avatar } from '../common/Avatar'
import { StatusBadge } from '../common/StatusBadge'

export function RecentReviewsTable() {
  const { reviews, getUser } = useAppData()
  const recent = [...reviews]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 6)

  return (
    <section className="glass-card overflow-hidden" aria-labelledby="recent-reviews-heading">
      <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
        <div>
          <h2 id="recent-reviews-heading" className="text-sm font-semibold tracking-tight text-ink">
            Recent reviews
          </h2>
          <p className="mt-0.5 text-[10px] text-subtle">Latest activity across the workspace</p>
        </div>
        <Link
          to="/history"
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-medium text-muted transition-colors hover:bg-[var(--hover-surface)] hover:text-ink"
        >
          View all
          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse text-left">
          <caption className="sr-only">Most recently updated content reviews</caption>
          <thead>
            <tr className="border-y border-[var(--line)] bg-[var(--panel-muted)]">
              {['Review', 'Status', 'Creator', 'Issues', 'Score', 'Updated'].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  className="px-4 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-subtle first:pl-5 last:pr-5"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map((review) => {
              const creator = getUser(review.createdBy)
              const tone = getScoreTone(review.complianceScore)
              const openCount = review.findings.filter((finding) => finding.status === 'pending').length
              return (
                <tr
                  key={review.id}
                  className="group border-b border-[var(--line)] transition-colors last:border-0 hover:bg-[var(--hover-surface)]"
                >
                  <td className="max-w-[240px] py-3 pl-5 pr-4">
                    <Link to={`/review/${review.id}`} className="block">
                      <span className="block truncate text-[11px] font-semibold text-ink transition-colors group-hover:text-[var(--accent)]">
                        {review.title}
                      </span>
                      <span className="mt-0.5 block text-[9px] text-subtle">
                        {review.id} · {review.contentType}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={review.status} className="!px-2 !py-0.5 !text-[9px]" />
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5">
                      <Avatar user={creator} size="xs" />
                      <span className="truncate text-[10px] text-muted">{creator?.name}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-medium text-ink tabular-nums">{openCount}</span>
                    <span className="ml-1 text-[9px] text-subtle">open</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] font-semibold tabular-nums" style={{ color: `var(--${tone.tone === 'success' ? 'success' : tone.tone === 'info' ? 'accent' : tone.tone === 'warning' ? 'warning' : 'danger'})` }}>
                      {review.complianceScore}
                    </span>
                    <span className="text-[9px] text-subtle">/100</span>
                  </td>
                  <td className="px-4 py-3 pr-5 text-[9px] text-subtle">{relativeTime(review.updatedAt)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
