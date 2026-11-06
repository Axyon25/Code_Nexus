import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  Inbox,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAppData } from '../context/useAppData'
import { formatDate, relativeTime } from '../utils/format'
import { getSeverityMeta, reviewNeedsApproval } from '../utils/status'
import { Avatar } from '../components/common/Avatar'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { Modal } from '../components/common/Modal'
import { PageHeader } from '../components/common/PageHeader'
import { ProgressRing } from '../components/common/ProgressRing'
import { SearchInput } from '../components/common/SearchInput'
import { SegmentedControl } from '../components/common/SegmentedControl'
import { Select } from '../components/common/Form'
import { StatusBadge } from '../components/common/StatusBadge'
import { TextAreaField } from '../components/common/Form'

const DECISIONS = {
  approve: {
    label: 'Approve',
    description: 'Accept the content as reviewed and record a human approval.',
    icon: CheckCircle2,
    tone: 'text-[var(--success)]',
    variant: 'primary',
    confirm: 'Approve review',
  },
  'request-changes': {
    label: 'Request changes',
    description: 'Send back to the creator with a note explaining what must change.',
    icon: RotateCcw,
    tone: 'text-[var(--warning)]',
    variant: 'glass',
    confirm: 'Request changes',
  },
  reject: {
    label: 'Reject',
    description: 'Decline the content. A new draft and approach will be required.',
    icon: XCircle,
    tone: 'text-[var(--danger)]',
    variant: 'danger',
    confirm: 'Reject review',
  },
}

function openFindings(review) {
  return review.findings.filter((finding) => finding.status === 'pending')
}

function severityBreakdown(review) {
  return review.findings.reduce(
    (acc, finding) => {
      acc[finding.severity] = (acc[finding.severity] ?? 0) + 1
      return acc
    },
    { critical: 0, high: 0, medium: 0, low: 0 },
  )
}

export default function ApprovalPage() {
  const { reviews, getUser, role, decideReview, currentUser } = useAppData()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sort, setSort] = useState('priority')

  const [activeReview, setActiveReview] = useState(null)
  const [decision, setDecision] = useState('approve')
  const [note, setNote] = useState('')
  const [noteError, setNoteError] = useState('')
  const [deciding, setDeciding] = useState(false)

  const queue = useMemo(
    () => reviews.filter(reviewNeedsApproval),
    [reviews],
  )

  const awaitingCritical = queue.reduce(
    (total, review) =>
      total +
      openFindings(review).filter((finding) => finding.severity === 'critical').length,
    0,
  )
  const now = new Date()
  const awaitingOld = queue.filter(
    (review) => now - new Date(review.updatedAt) > 24 * 60 * 60 * 1000,
  ).length
  const averageScore = queue.length
    ? Math.round(queue.reduce((total, review) => total + review.complianceScore, 0) / queue.length)
    : 0

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    const items = queue.filter((review) => {
      if (statusFilter !== 'all' && review.status !== statusFilter) return false
      if (!term) return true
      const owner = getUser(review.createdBy)
      return [review.title, review.id, review.contentType, owner?.name ?? '']
        .join(' ')
        .toLowerCase()
        .includes(term)
    })

    return [...items].sort((a, b) => {
      if (sort === 'oldest') return new Date(a.updatedAt) - new Date(b.updatedAt)
      if (sort === 'score') return a.complianceScore - b.complianceScore
      const aCritical = openFindings(a).filter((finding) => finding.severity === 'critical').length
      const bCritical = openFindings(b).filter((finding) => finding.severity === 'critical').length
      if (bCritical !== aCritical) return bCritical - aCritical
      return new Date(a.updatedAt) - new Date(b.updatedAt)
    })
  }, [getUser, query, queue, sort, statusFilter])

  const openDecision = (review) => {
    setActiveReview(review)
    setDecision('approve')
    setNote('')
    setNoteError('')
  }

  const closeDecision = () => {
    if (deciding) return
    setActiveReview(null)
    setNote('')
    setNoteError('')
  }

  const submitDecision = async () => {
    if (decision !== 'approve' && !note.trim()) {
      setNoteError('A note is required for this decision.')
      return
    }
    setDeciding(true)
    try {
      await decideReview(activeReview.id, decision, note)
      toast.success(
        decision === 'approve'
          ? 'Review approved'
          : decision === 'request-changes'
            ? 'Changes requested'
            : 'Review rejected',
        {
          description:
            decision === 'approve'
              ? 'A human approval was recorded in the local demo workspace.'
              : 'The creator will see your note in the review history.',
        },
      )
      setActiveReview(null)
      setNote('')
    } catch (error) {
      toast.error(error.message || 'Unable to record the decision.')
    } finally {
      setDeciding(false)
    }
  }

  if (role === 'Creator') {
    return (
      <div className="space-y-5">
        <PageHeader
          eyebrow="Approval center"
          title="Human decisions live here"
          description="Approval is a reviewer responsibility. Creators can follow progress from review history."
        />
        <EmptyState
          icon={ShieldCheck}
          title="Approval rights are limited to reviewers and managers"
          description="In this demo you can switch role from Settings → Profile. Choose Reviewer or Manager to inspect the queue."
          action={
            <Link to="/history" className="btn btn-primary btn-sm">
              Go to review history
            </Link>
          }
        />
      </div>
    )
  }

  const activeOwner = activeReview ? getUser(activeReview.createdBy) : null
  const activeOpen = activeReview ? openFindings(activeReview) : []
  const selectedDecision = DECISIONS[decision]
  const DecisionIcon = selectedDecision.icon

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Approval center"
        title={
          <>
            Nothing ships without a{' '}
            <span className="font-serif font-normal italic text-[var(--accent)]">human</span>.
          </>
        }
        description="Inspect findings, add decision notes and record the final outcome. AI suggestions never approve content on their own."
        actions={
          <Badge tone={queue.length ? 'changes' : 'approved'} dot>
            {queue.length ? `${queue.length} awaiting decision` : 'Queue clear'}
          </Badge>
        }
      />

      <section aria-label="Approval queue summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Awaiting decision',
            value: queue.length,
            hint: 'Submitted or resubmitted',
            icon: ClipboardCheck,
            tone: 'text-[var(--accent)]',
          },
          {
            label: 'Open critical findings',
            value: awaitingCritical,
            hint: 'Need explicit attention',
            icon: AlertTriangle,
            tone: 'text-[var(--danger)]',
          },
          {
            label: 'Waiting over 24 hours',
            value: awaitingOld,
            hint: 'Older than one day',
            icon: Clock3,
            tone: 'text-[var(--warning)]',
          },
          {
            label: 'Average score',
            value: averageScore ? `${averageScore}` : '—',
            hint: 'Current queue',
            icon: ShieldCheck,
            tone: 'text-[var(--success)]',
          },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="glass-card flex items-start gap-3 p-4">
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--panel-muted)] ${stat.tone}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-subtle">
                  {stat.label}
                </p>
                <p className="mt-1 text-xl font-semibold leading-none text-ink tabular-nums">
                  {stat.value}
                </p>
                <p className="mt-1 text-[9px] text-subtle">{stat.hint}</p>
              </div>
            </div>
          )
        })}
      </section>

      <div className="glass-panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[var(--line)] p-4 lg:flex-row lg:items-center lg:justify-between">
          <SegmentedControl
            label="Filter approval queue"
            options={[
              { value: 'all', label: `All (${queue.length})` },
              {
                value: 'in-review',
                label: `Under review (${queue.filter((review) => review.status === 'in-review').length})`,
              },
              {
                value: 'changes-requested',
                label: `Changes requested (${queue.filter((review) => review.status === 'changes-requested').length})`,
              },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search the queue…"
              label="Search approval queue"
              className="w-full sm:w-56"
            />
            <Select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort approval queue"
              className="w-auto py-2 text-xs"
            >
              <option value="priority">Priority</option>
              <option value="oldest">Oldest first</option>
              <option value="score">Lowest score</option>
            </Select>
          </div>
        </div>

        <div className="space-y-2.5 p-4">
          {filtered.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title={queue.length === 0 ? 'The approval queue is clear' : 'No reviews match this filter'}
              description={
                queue.length === 0
                  ? 'Every submitted review has a recorded human decision. New submissions will appear here automatically.'
                  : 'Try clearing the search or choosing another status.'
              }
              action={
                queue.length > 0 ? (
                  <Button variant="glass" size="sm" onClick={() => { setQuery(''); setStatusFilter('all') }}>
                    Clear filters
                  </Button>
                ) : (
                  <Link to="/history" className="btn btn-glass btn-sm">
                    Review history
                  </Link>
                )
              }
            />
          ) : (
            filtered.map((review) => {
              const owner = getUser(review.createdBy)
              const reviewer = review.reviewer ? getUser(review.reviewer) : null
              const open = openFindings(review)
              const critical = open.filter((finding) => finding.severity === 'critical').length
              const breakdown = severityBreakdown(review)
              return (
                <article key={review.id} className="glass-card p-4">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-md border border-[var(--line)] bg-[var(--panel-muted)] px-1.5 py-0.5 font-mono text-[9px] font-semibold text-subtle">
                          {review.id}
                        </span>
                        <StatusBadge status={review.status} />
                        {critical > 0 && (
                          <Badge tone="critical" icon={AlertTriangle}>
                            {critical} critical open
                          </Badge>
                        )}
                        <Badge tone="neutral">{review.contentType}</Badge>
                      </div>
                      <Link
                        to={`/review/${review.id}`}
                        className="mt-2 block text-[13px] font-semibold leading-snug tracking-tight text-ink transition-colors hover:text-[var(--accent)]"
                      >
                        {review.title}
                      </Link>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[9px] text-subtle">
                        <span className="flex items-center gap-1.5">
                          <Avatar user={owner} size="xs" />
                          {owner?.name ?? 'Unknown creator'}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock3 className="h-3 w-3" aria-hidden="true" />
                          {relativeTime(review.updatedAt)} · {formatDate(review.updatedAt)}
                        </span>
                        {reviewer && (
                          <span className="flex items-center gap-1.5">
                            <FileText className="h-3 w-3" aria-hidden="true" />
                            Reviewer {reviewer.name}
                          </span>
                        )}
                        <span>{open.length} open of {review.findings.length} findings</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2.5 rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] px-3 py-2">
                        <ProgressRing value={review.complianceScore} size={44} strokeWidth={4} showValue={false} />
                        <div>
                          <p className="text-sm font-semibold leading-none text-ink tabular-nums">
                            {review.complianceScore}
                            <span className="text-[9px] font-normal text-subtle">/100</span>
                          </p>
                          <div className="mt-1 flex items-center gap-1">
                            {['critical', 'high', 'medium', 'low'].map((severity) => {
                              const count = breakdown[severity]
                              if (!count) return null
                              const meta = getSeverityMeta(severity)
                              return (
                                <span
                                  key={severity}
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    severity === 'critical'
                                      ? 'bg-[var(--danger)]'
                                      : severity === 'high'
                                        ? 'bg-[var(--warning)]'
                                        : severity === 'medium'
                                          ? 'bg-[var(--teal)]'
                                          : 'bg-[var(--neutral)]'
                                  }`}
                                  title={`${meta.label}: ${count}`}
                                />
                              )
                            })}
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="primary" icon={ClipboardCheck} onClick={() => openDecision(review)}>
                        Decide
                      </Button>
                      <Link to={`/review/${review.id}`} className="btn btn-glass btn-sm">
                        Review
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-2xl border border-[var(--line)] bg-[var(--panel-muted)] px-4 py-3">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--success)]" aria-hidden="true" />
        <p className="text-[10px] leading-relaxed text-subtle">
          Every decision is attributed, timestamped and stored in your browser. A note is required
          when requesting changes or rejecting. This demo never publishes or sends content.
        </p>
      </div>

      <Modal
        open={Boolean(activeReview)}
        onClose={closeDecision}
        title="Record a human decision"
        description={
          activeReview
            ? `${activeReview.id} · ${activeReview.title}`
            : 'Choose an outcome and add a note.'
        }
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={closeDecision} disabled={deciding}>
              Cancel
            </Button>
            <Button
              variant={selectedDecision.variant}
              icon={DecisionIcon}
              loading={deciding}
              onClick={submitDecision}
            >
              {selectedDecision.confirm}
            </Button>
          </>
        }
      >
        {activeReview && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] px-3.5 py-2.5 text-[10px] text-muted">
              <Avatar user={activeOwner} size="xs" />
              <span>{activeOwner?.name}</span>
              <span className="text-subtle">·</span>
              <span>{activeReview.contentType}</span>
              <span className="text-subtle">·</span>
              <span>{activeOpen.length} open findings</span>
              <span className="text-subtle">·</span>
              <span>Score {activeReview.complianceScore}/100</span>
            </div>

            <fieldset>
              <legend className="field-label">Decision</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {Object.entries(DECISIONS).map(([key, option]) => {
                  const Icon = option.icon
                  const active = decision === key
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setDecision(key)
                        setNoteError('')
                      }}
                      aria-pressed={active}
                      className={`rounded-xl border p-3 text-left transition-colors ${
                        active
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                          : 'border-[var(--line)] bg-[var(--input-bg)] hover:border-[var(--line-strong)]'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${option.tone}`} aria-hidden="true" />
                      <p className="mt-2 text-[11px] font-semibold text-ink">{option.label}</p>
                      <p className="mt-1 text-[9px] leading-relaxed text-muted">
                        {option.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </fieldset>

            {decision === 'approve' && activeOpen.length > 0 && (
              <p className="flex items-start gap-2 rounded-xl border border-[var(--warning-line)] bg-[var(--warning-soft)] px-3 py-2.5 text-[10px] leading-relaxed text-[var(--warning)]">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {activeOpen.length} finding{activeOpen.length === 1 ? ' is' : 's are'} still open.
                Approval will be recorded as an explicit human exception.
              </p>
            )}

            <TextAreaField
              label={decision === 'approve' ? 'Decision note (optional)' : 'Decision note'}
              required={decision !== 'approve'}
              rows={4}
              value={note}
              onChange={(event) => {
                setNote(event.target.value)
                setNoteError('')
              }}
              error={noteError}
              placeholder={
                decision === 'approve'
                  ? 'e.g. Reviewed with Legal; remaining risk accepted.'
                  : 'Explain what must change before this can be approved.'
              }
              hint={
                decision === 'approve'
                  ? 'Recommended when approving with open findings.'
                  : 'The creator will see this note in the review record.'
              }
            />

            <p className="flex items-center gap-1.5 text-[9px] leading-relaxed text-subtle">
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              Recorded as {currentUser.name}. Approval is never automatic.
            </p>
          </div>
        )}
      </Modal>
    </div>
  )
}
