import { BookMarked, CalendarDays, Pencil, Quote, ShieldAlert } from 'lucide-react'
import { useAppData } from '../../context/useAppData'
import {
  GUIDELINE_CATEGORY_META,
  getSeverityMeta,
} from '../../utils/status'
import { formatDate } from '../../utils/format'
import { Avatar } from '../common/Avatar'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'
import { Modal } from '../common/Modal'

const STATUS_TONE = {
  active: { label: 'Active', tone: 'approved' },
  review: { label: 'Needs review', tone: 'changes' },
  draft: { label: 'Draft', tone: 'draft' },
}

export function GuidelineDetailModal({ open, onClose, guideline, onEdit, canEdit = true }) {
  const { getUser, reviews } = useAppData()
  if (!guideline) return null

  const category = GUIDELINE_CATEGORY_META[guideline.category] ?? { tone: 'neutral' }
  const severity = getSeverityMeta(guideline.severity.toLowerCase())
  const status = STATUS_TONE[guideline.status] ?? STATUS_TONE.draft
  const owner = getUser(guideline.ownerId)
  const usage = reviews.filter((review) => review.guidelines.includes(guideline.id)).length

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Guideline rule"
      description={guideline.code}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          {canEdit && (
            <Button variant="primary" icon={Pencil} onClick={() => onEdit(guideline)}>
              Edit rule
            </Button>
          )}
        </>
      }
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={category.tone}>{guideline.category}</Badge>
        <Badge tone={severity.tone} icon={ShieldAlert}>
          {severity.label} severity
        </Badge>
        <Badge tone={status.tone} dot>
          {status.label}
        </Badge>
      </div>

      <h3 className="mt-4 text-xl font-semibold leading-snug tracking-[-0.03em] text-ink">
        {guideline.title}
      </h3>
      <p className="mt-3 text-[13px] leading-relaxed text-muted">{guideline.description}</p>

      {guideline.example && (
        <div className="mt-5 rounded-2xl border border-[var(--line)] bg-[var(--panel-muted)] p-4">
          <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-subtle">
            <Quote className="h-3 w-3" aria-hidden="true" />
            Example in practice
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-ink">{guideline.example}</p>
        </div>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--line)] p-3.5">
          <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-subtle">
            <BookMarked className="h-3 w-3" aria-hidden="true" />
            Source reference
          </p>
          <p className="mt-1.5 text-[11px] font-medium leading-relaxed text-ink">{guideline.source}</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] p-3.5">
          <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-subtle">
            <CalendarDays className="h-3 w-3" aria-hidden="true" />
            Last updated
          </p>
          <p className="mt-1.5 text-[11px] font-medium text-ink">{formatDate(guideline.updatedAt)}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
        <div className="flex items-center gap-2">
          <Avatar user={owner} size="md" />
          <div>
            <p className="text-[11px] font-semibold text-ink">{owner?.name ?? 'Unassigned'}</p>
            <p className="text-[9px] text-subtle">Rule owner</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold text-ink tabular-nums">{usage}</p>
          <p className="text-[9px] text-subtle">reviews reference this rule</p>
        </div>
      </div>
    </Modal>
  )
}
