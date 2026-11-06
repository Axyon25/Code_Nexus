import { BookMarked, Eye, Pencil, Trash2 } from 'lucide-react'
import { GUIDELINE_CATEGORY_META, getSeverityMeta } from '../../utils/status'
import { formatDate } from '../../utils/format'
import { Avatar } from '../common/Avatar'
import { Badge } from '../common/Badge'

const STATUS_TONE = {
  active: { label: 'Active', tone: 'approved' },
  review: { label: 'Needs review', tone: 'changes' },
  draft: { label: 'Draft', tone: 'draft' },
}

export function GuidelineCard({ guideline, owner, onView, onEdit, onDelete, canEdit = true, canDelete = true }) {
  const category = GUIDELINE_CATEGORY_META[guideline.category] ?? { tone: 'neutral' }
  const severity = getSeverityMeta(guideline.severity.toLowerCase())
  const status = STATUS_TONE[guideline.status] ?? STATUS_TONE.draft

  return (
    <article className="glass-card glass-card-lift flex flex-col p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-md border border-[var(--line)] bg-[var(--panel-muted)] px-1.5 py-0.5 font-mono text-[9px] font-semibold text-subtle">
            {guideline.code}
          </span>
          <Badge tone={category.tone}>{guideline.category}</Badge>
        </div>
        <Badge tone={status.tone} dot>
          {status.label}
        </Badge>
      </div>

      <button
        type="button"
        onClick={() => onView(guideline)}
        className="mt-3 text-left"
      >
        <h3 className="text-[13px] font-semibold leading-snug tracking-tight text-ink transition-colors hover:text-[var(--accent)]">
          {guideline.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-muted">
          {guideline.description}
        </p>
      </button>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge tone={severity.tone}>{severity.label} severity</Badge>
        <span className="flex items-center gap-1 text-[9px] text-subtle">
          <BookMarked className="h-2.5 w-2.5" aria-hidden="true" />
          {guideline.source}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-[var(--line)] pt-3">
        <div className="flex min-w-0 items-center gap-1.5">
          <Avatar user={owner} size="xs" />
          <span className="truncate text-[9px] text-subtle">
            {owner?.name?.split(' ')[0]} · {formatDate(guideline.updatedAt, { day: 'numeric', month: 'short' })}
          </span>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => onView(guideline)}
            className="btn btn-ghost btn-icon !p-1.5"
            aria-label={`View rule ${guideline.code}`}
            title="View rule"
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          {canEdit && (
            <button
              type="button"
              onClick={() => onEdit(guideline)}
              className="btn btn-ghost btn-icon !p-1.5"
              aria-label={`Edit rule ${guideline.code}`}
              title="Edit rule"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(guideline)}
              className="btn btn-ghost btn-icon !p-1.5 text-subtle hover:text-[var(--danger)]"
              aria-label={`Delete rule ${guideline.code}`}
              title="Delete rule"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
