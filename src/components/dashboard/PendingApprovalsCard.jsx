import { Link } from 'react-router-dom'
import { ArrowUpRight, Inbox } from 'lucide-react'
import { useAppData } from '../../context/useAppData'
import { relativeTime } from '../../utils/format'
import { reviewNeedsApproval } from '../../utils/status'
import { Avatar } from '../common/Avatar'
import { EmptyState } from '../common/EmptyState'
import { StatusBadge } from '../common/StatusBadge'

export function PendingApprovalsCard() {
  const { reviews, getUser } = useAppData()
  const pending = reviews
    .filter(reviewNeedsApproval)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3)

  return (
    <section className="glass-card flex flex-col p-4 sm:p-5" aria-labelledby="pending-heading">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 id="pending-heading" className="text-sm font-semibold tracking-tight text-ink">
            Pending approvals
          </h2>
          <p className="mt-0.5 text-[10px] text-subtle">Human decisions waiting</p>
        </div>
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--warning-soft)] text-[var(--warning)]">
          <Inbox className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-3 flex-1 space-y-2">
        {pending.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No approvals waiting"
            description="Everything submitted has a human decision on record."
            className="py-6"
          />
        ) : (
          pending.map((review) => {
            const creator = getUser(review.createdBy)
            return (
              <Link
                key={review.id}
                to="/approvals"
                className="group block rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] p-3 transition-all hover:border-[var(--line-strong)] hover:bg-[var(--hover-surface)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-2 text-[11px] font-semibold leading-snug text-ink">
                    {review.title}
                  </p>
                  <ArrowUpRight className="h-3 w-3 shrink-0 text-subtle opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <Avatar user={creator} size="xs" />
                    <span className="truncate text-[9px] text-muted">{creator?.name}</span>
                  </span>
                  <StatusBadge status={review.status} className="!px-1.5 !py-0 !text-[8px]" />
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-[var(--line)] pt-1.5">
                  <span className="text-[9px] text-subtle">Updated {relativeTime(review.updatedAt)}</span>
                  <span className="text-[9px] font-semibold text-ink tabular-nums">{review.complianceScore}/100</span>
                </div>
              </Link>
            )
          })
        )}
      </div>

      <Link
        to="/approvals"
        className="mt-3 flex items-center justify-between border-t border-[var(--line)] pt-3 text-[10px] font-medium text-muted transition-colors hover:text-ink"
      >
        Open approval center
        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
      </Link>
    </section>
  )
}
