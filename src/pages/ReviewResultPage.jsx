import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  FileSearch,
  FileText,
  History as HistoryIcon,
  MessageSquare,
  RotateCcw,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAppData } from '../context/useAppData'
import { formatDate, formatDateTime, relativeTime } from '../utils/format'
import {
  getSeverityMeta,
  projectedScore,
  reviewNeedsApproval,
} from '../utils/status'
import { Avatar } from '../components/common/Avatar'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { Modal } from '../components/common/Modal'
import { PageHeader } from '../components/common/PageHeader'
import { ProgressRing } from '../components/common/ProgressRing'
import { SegmentedControl } from '../components/common/SegmentedControl'
import { StatusBadge } from '../components/common/StatusBadge'
import { TextAreaField } from '../components/common/Form'
import { ContentPreview } from '../components/review/ContentPreview'
import { FindingCard } from '../components/review/FindingCard'

const DECISION_OPTIONS = {
  approve: {
    title: 'Approve this review',
    description:
      'Approve the content for publication. This is a human decision and is recorded in the review history.',
    confirm: 'Approve review',
    variant: 'primary',
    icon: CheckCircle2,
  },
  'request-changes': {
    title: 'Request changes',
    description:
      'Send the review back to the creator with a clear explanation of what must change before approval.',
    confirm: 'Request changes',
    variant: 'glass',
    icon: RotateCcw,
  },
  reject: {
    title: 'Reject this review',
    description:
      'Reject the content. Use this when the draft cannot be corrected editorially or requires a new approach.',
    confirm: 'Reject review',
    variant: 'danger',
    icon: XCircle,
  },
}

export default function ReviewResultPage() {
  const { id } = useParams()
  const {
    reviews,
    getUser,
    getGuideline,
    updateFinding,
    addComment,
    decideReview,
    sendForApproval,
    role,
    currentUser,
  } = useAppData()

  const review = reviews.find((item) => item.id === id)

  const [mode, setMode] = useState('highlighted')
  const [severityFilter, setSeverityFilter] = useState('all')
  const [decisionFilter, setDecisionFilter] = useState('all')
  const [expandedFinding, setExpandedFinding] = useState(
    () => review?.findings?.[0]?.id ?? null,
  )
  const [selectedFindingId, setSelectedFindingId] = useState(
    () => review?.findings?.[0]?.id ?? null,
  )
  const [activityTab, setActivityTab] = useState('activity')
  const [comment, setComment] = useState('')
  const [decision, setDecision] = useState(null)
  const [note, setNote] = useState('')
  const [noteError, setNoteError] = useState('')
  const [deciding, setDeciding] = useState(false)

  const findings = review?.findings ?? []
  const selectedGuidelines = (review?.guidelines ?? [])
    .map((guidelineId) => getGuideline(guidelineId))
    .filter(Boolean)

  const severityCounts = findings.reduce(
    (acc, finding) => {
      acc[finding.severity] = (acc[finding.severity] ?? 0) + 1
      return acc
    },
    { critical: 0, high: 0, medium: 0, low: 0 },
  )

  const acceptedCount = findings.filter((finding) => finding.status === 'accepted').length
  const rejectedCount = findings.filter((finding) => finding.status === 'rejected').length
  const openCount = findings.filter((finding) => finding.status === 'pending').length
  const resolvedCount = acceptedCount + rejectedCount
  const resolvedPct = findings.length ? Math.round((resolvedCount / findings.length) * 100) : 100
  const openCritical = findings.filter(
    (finding) => finding.status === 'pending' && finding.severity === 'critical',
  ).length

  const filteredFindings = findings.filter((finding) => {
    if (severityFilter !== 'all' && finding.severity !== severityFilter) return false
    if (decisionFilter === 'open' && finding.status !== 'pending') return false
    if (decisionFilter === 'accepted' && finding.status !== 'accepted') return false
    if (decisionFilter === 'rejected' && finding.status !== 'rejected') return false
    return true
  })

  const expandedIndex = filteredFindings.findIndex(
    (finding) => finding.id === expandedFinding,
  )

  const openDecision = (type) => {
    setDecision(type)
    setNote('')
    setNoteError('')
  }

  const moveFinding = (direction) => {
    if (filteredFindings.length === 0) return
    const current = expandedIndex >= 0 ? expandedIndex : 0
    const nextIndex =
      (current + direction + filteredFindings.length) % filteredFindings.length
    const next = filteredFindings[nextIndex]
    setExpandedFinding(next.id)
    setSelectedFindingId(next.id)
  }

  const jumpToFinding = (findingId) => {
    setSelectedFindingId(findingId)
    window.requestAnimationFrame(() => {
      document.getElementById(`mark-${findingId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    })
  }

  const handleDecision = async () => {
    if (decision !== 'approve' && !note.trim()) {
      setNoteError('Add a note explaining this decision.')
      return
    }
    setDeciding(true)
    try {
      await decideReview(review.id, decision, note)
      const label =
        decision === 'approve'
          ? 'Review approved'
          : decision === 'request-changes'
            ? 'Changes requested'
            : 'Review rejected'
      toast.success(label, {
        description:
          decision === 'approve'
            ? 'A human decision was recorded. This demo does not publish content.'
            : 'The creator will see the note in the review history.',
      })
      setDecision(null)
      setNote('')
    } catch (error) {
      toast.error(error.message || 'Unable to record the decision.')
    } finally {
      setDeciding(false)
    }
  }

  const handleSendForApproval = () => {
    sendForApproval(
      review.id,
      'Creator marked the latest changes ready for human review.',
    )
    toast.success('Sent to the approval queue', {
      description: 'A human reviewer must still inspect every finding.',
    })
  }

  const handleComment = (event) => {
    event.preventDefault()
    if (!comment.trim()) return
    addComment(review.id, comment)
    setComment('')
    toast.success('Comment added', {
      description: 'Comments are stored in this browser only.',
    })
  }

  const handleFindingDecision = (finding, status) => {
    updateFinding(review.id, finding.id, status)
    if (status === 'accepted') {
      toast.success('Suggestion accepted', {
        description: 'The suggested correction is included in the preview. Re-run the review to verify.',
      })
    } else {
      toast('Suggestion rejected', {
        description: 'The original text is kept and the finding remains available for discussion.',
      })
    }
  }

  if (!review) {
    return (
      <div className="space-y-5">
        <PageHeader
          eyebrow="Review results"
          title="Review not found"
          description="This review ID is not in the local demo workspace. It may have been created in another browser session."
        />
        <EmptyState
          icon={FileSearch}
          title="We could not find that review"
          description="Return to the review history to choose an existing record, or start a new analysis."
          action={
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Link to="/history" className="btn btn-glass btn-sm">
                Review history
              </Link>
              <Link to="/review/new" className="btn btn-primary btn-sm">
                New review
              </Link>
            </div>
          }
        />
      </div>
    )
  }

  const owner = getUser(review.createdBy)
  const reviewer = review.reviewer ? getUser(review.reviewer) : null
  const projected = projectedScore(review)
  const canDecide = (role === 'Manager' || role === 'Reviewer') && reviewNeedsApproval(review)
  const isClosed = review.status === 'approved' || review.status === 'rejected'
  const decisionMeta = decision ? DECISION_OPTIONS[decision] : null
  const DecisionIcon = decisionMeta?.icon
  const timeline = [...review.history].sort((a, b) => new Date(b.at) - new Date(a.at))

  return (
    <div className="space-y-5">
      <div>
        <Link
          to="/history"
          className="mb-3 inline-flex items-center gap-1.5 rounded-lg px-1.5 py-1 text-[11px] font-medium text-muted transition-colors hover:bg-[var(--hover-surface)] hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to review history
        </Link>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-md border border-[var(--line)] bg-[var(--panel-muted)] px-1.5 py-0.5 font-mono text-[9px] font-semibold text-subtle">
                {review.id}
              </span>
              <Badge tone="neutral">Revision {review.revision}</Badge>
              <StatusBadge status={review.status} />
              {reviewNeedsApproval(review) && (
                <Badge tone="violet" icon={ClipboardCheck}>
                  Human decision pending
                </Badge>
              )}
            </div>
            <h1 className="mt-2 text-[25px] font-semibold leading-tight tracking-[-0.035em] text-ink sm:text-[30px]">
              {review.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-subtle">
              <span className="flex items-center gap-1.5">
                <FileText className="h-3 w-3" aria-hidden="true" />
                {review.contentType}
              </span>
              <span className="flex items-center gap-1.5">
                <Avatar user={owner} size="xs" />
                {owner?.name ?? 'Unknown creator'}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock3 className="h-3 w-3" aria-hidden="true" />
                Updated {relativeTime(review.updatedAt)}
              </span>
              <span>{formatDate(review.createdAt)}</span>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Link to="/guidelines" className="btn btn-glass btn-sm">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              View {selectedGuidelines.length} rules
            </Link>
            {canDecide && (
              <Button variant="primary" size="sm" icon={ClipboardCheck} onClick={() => openDecision('approve')}>
                Record decision
              </Button>
            )}
          </div>
        </div>
      </div>

      <section aria-label="Review summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="glass-card flex items-center gap-4 p-4">
          <ProgressRing value={review.complianceScore} size={76} strokeWidth={6} />
          <div className="min-w-0">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-subtle">
              Compliance score
            </p>
            <p className="mt-1 text-[12px] font-semibold text-ink">
              {review.complianceScore >= 90
                ? 'Excellent'
                : review.complianceScore >= 75
                  ? 'Good'
                  : review.complianceScore >= 60
                    ? 'Needs work'
                    : 'High risk'}
            </p>
            <p className="mt-0.5 text-[9px] leading-relaxed text-subtle">
              Projected {projected}/100 after accepted fixes
            </p>
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-subtle">
              Findings by severity
            </p>
            <Badge tone="neutral">{findings.length}</Badge>
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-1.5">
            {['critical', 'high', 'medium', 'low'].map((severity) => {
              const meta = getSeverityMeta(severity)
              return (
                <button
                  key={severity}
                  type="button"
                  onClick={() =>
                    setSeverityFilter((current) => (current === severity ? 'all' : severity))
                  }
                  className={`flex items-center justify-between rounded-lg border px-2 py-1.5 text-left transition-colors ${
                    severityFilter === severity
                      ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                      : 'border-[var(--line)] hover:border-[var(--line-strong)]'
                  }`}
                  aria-pressed={severityFilter === severity}
                >
                  <span className="text-[9px] font-medium text-muted">{meta.label}</span>
                  <span className="text-[11px] font-semibold text-ink tabular-nums">
                    {severityCounts[severity] ?? 0}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="glass-card p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-subtle">
              Suggestion decisions
            </p>
            <span className="text-[10px] font-semibold text-ink tabular-nums">{resolvedPct}%</span>
          </div>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--success)] transition-[width] duration-500"
              style={{ width: `${resolvedPct}%` }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between gap-1 text-[9px]">
            <span className="text-[var(--success)]">{acceptedCount} accepted</span>
            <span className="text-[var(--danger)]">{rejectedCount} rejected</span>
            <span className="text-subtle">{openCount} open</span>
          </div>
          {openCritical > 0 && (
            <p className="mt-2 flex items-center gap-1 text-[9px] font-medium text-[var(--danger)]">
              <AlertTriangle className="h-3 w-3" aria-hidden="true" />
              {openCritical} critical finding{openCritical === 1 ? '' : 's'} still open
            </p>
          )}
        </div>

        <div className="glass-card p-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-subtle">
            Review details
          </p>
          <dl className="mt-2 space-y-1.5 text-[10px]">
            <div className="flex items-center justify-between gap-2">
              <dt className="text-subtle">Reviewer</dt>
              <dd className="flex items-center gap-1.5 font-medium text-ink">
                {reviewer ? (
                  <>
                    <Avatar user={reviewer} size="xs" />
                    {reviewer.name}
                  </>
                ) : (
                  'Unassigned'
                )}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-subtle">Guidelines</dt>
              <dd className="font-medium text-ink tabular-nums">{selectedGuidelines.length} rules</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-subtle">Last activity</dt>
              <dd className="font-medium text-ink">{formatDate(review.updatedAt)}</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-subtle">Comments</dt>
              <dd className="font-medium text-ink tabular-nums">{review.comments.length}</dd>
            </div>
          </dl>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.32fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-4">
          <ContentPreview
            content={review.content}
            findings={findings}
            mode={mode}
            onModeChange={setMode}
            selectedId={selectedFindingId}
            onSelect={(findingId) => {
              setSelectedFindingId(findingId)
              setExpandedFinding(findingId)
            }}
          />

          <section className="glass-panel p-4 sm:p-5" aria-labelledby="decision-heading">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 id="decision-heading" className="text-sm font-semibold text-ink">
                  Human decision
                </h2>
                <p className="mt-1 max-w-xl text-[11px] leading-relaxed text-muted">
                  The analysis is advisory. A person must review the findings, note any exceptions and
                  record the final decision.
                </p>
              </div>
              <StatusBadge status={review.status} />
            </div>

            {isClosed ? (
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] p-3.5">
                <span
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${
                    review.status === 'approved'
                      ? 'bg-[var(--success-soft)] text-[var(--success)]'
                      : 'bg-[var(--danger-soft)] text-[var(--danger)]'
                  }`}
                >
                  {review.status === 'approved' ? (
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <XCircle className="h-4 w-4" aria-hidden="true" />
                  )}
                </span>
                <div>
                  <p className="text-xs font-semibold text-ink">
                    {review.status === 'approved'
                      ? 'Approved by a human reviewer'
                      : 'Rejected by a human reviewer'}
                  </p>
                  <p className="mt-1 text-[10px] leading-relaxed text-muted">
                    {reviewer ? `${reviewer.name} ` : 'A reviewer '}
                    recorded this decision on {formatDate(review.updatedAt)}. Suggestions are now
                    read-only. This demo does not publish content anywhere.
                  </p>
                </div>
              </div>
            ) : canDecide ? (
              <>
                {openCritical > 0 && (
                  <p className="mt-4 flex items-start gap-2 rounded-xl border border-[var(--danger-line)] bg-[var(--danger-soft)] px-3 py-2.5 text-[10px] leading-relaxed text-[var(--danger)]">
                    <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    {openCritical} critical finding{openCritical === 1 ? '' : 's'}{' '}
                    {openCritical === 1 ? 'remains' : 'remain'} open. You can
                    still record a decision, but approval should be an informed exception.
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="primary" icon={CheckCircle2} onClick={() => openDecision('approve')}>
                    Approve review
                  </Button>
                  <Button variant="glass" icon={RotateCcw} onClick={() => openDecision('request-changes')}>
                    Request changes
                  </Button>
                  <Button variant="danger" icon={XCircle} onClick={() => openDecision('reject')}>
                    Reject
                  </Button>
                </div>
                <p className="mt-3 text-[9px] leading-relaxed text-subtle">
                  Approval is never automatic. Every decision is attributed to {currentUser.name} and
                  recorded in the local demo history.
                </p>
              </>
            ) : role === 'Creator' ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {(review.status === 'draft' || review.status === 'changes-requested') && (
                  <Button variant="primary" icon={Send} onClick={handleSendForApproval}>
                    {review.status === 'draft' ? 'Send for approval' : 'Resubmit for approval'}
                  </Button>
                )}
                <p className="text-[10px] leading-relaxed text-muted">
                  {review.status === 'draft'
                    ? 'This draft has not been sent to the approval queue yet.'
                    : review.status === 'changes-requested'
                      ? 'Make the requested changes, then resubmit for a human decision.'
                      : 'Waiting for a reviewer to inspect every finding and record a decision.'}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-[10px] leading-relaxed text-muted">
                A reviewer with approval rights must record the final decision.
              </p>
            )}
          </section>
        </div>

        <aside className="min-w-0">
          <section className="glass-panel overflow-hidden" aria-labelledby="findings-heading">
            <div className="border-b border-[var(--line)] px-4 py-3.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 id="findings-heading" className="text-sm font-semibold text-ink">
                    Findings
                  </h2>
                  <p className="mt-0.5 text-[10px] text-subtle">
                    {filteredFindings.length} shown · {openCount} still open
                  </p>
                </div>
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => moveFinding(-1)}
                    disabled={filteredFindings.length === 0}
                    className="btn btn-ghost btn-icon"
                    aria-label="Previous finding"
                    title="Previous finding"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <span className="min-w-8 text-center text-[9px] font-medium text-subtle tabular-nums">
                    {expandedIndex >= 0 ? expandedIndex + 1 : 0}/{filteredFindings.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => moveFinding(1)}
                    disabled={filteredFindings.length === 0}
                    className="btn btn-ghost btn-icon"
                    aria-label="Next finding"
                    title="Next finding"
                  >
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {['all', 'critical', 'high', 'medium', 'low'].map((severity) => {
                  const label =
                    severity === 'all' ? 'All' : getSeverityMeta(severity).label
                  const count =
                    severity === 'all' ? findings.length : severityCounts[severity] ?? 0
                  return (
                    <button
                      key={severity}
                      type="button"
                      onClick={() => setSeverityFilter(severity)}
                      aria-pressed={severityFilter === severity}
                      className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold transition-colors ${
                        severityFilter === severity
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                          : 'border-[var(--line)] text-subtle hover:text-ink'
                      }`}
                    >
                      {label} <span className="tabular-nums">{count}</span>
                    </button>
                  )
                })}
              </div>

              <div className="mt-2">
                <SegmentedControl
                  size="sm"
                  label="Filter findings by decision"
                  options={[
                    { value: 'all', label: 'All' },
                    { value: 'open', label: 'Open' },
                    { value: 'accepted', label: 'Accepted' },
                    { value: 'rejected', label: 'Rejected' },
                  ]}
                  value={decisionFilter}
                  onChange={setDecisionFilter}
                />
              </div>
            </div>

            <div className="max-h-[720px] space-y-2 overflow-y-auto p-3">
              {filteredFindings.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[var(--line-strong)] px-4 py-8 text-center">
                  <p className="text-xs font-semibold text-ink">No findings match this filter</p>
                  <p className="mt-1 text-[10px] text-muted">
                    Try another severity or decision state.
                  </p>
                </div>
              ) : (
                filteredFindings.map((finding) => {
                  const index = findings.findIndex((item) => item.id === finding.id)
                  const guideline = getGuideline(finding.guidelineId)
                  return (
                    <FindingCard
                      key={finding.id}
                      finding={finding}
                      guideline={guideline}
                      index={index}
                      expanded={expandedFinding === finding.id}
                      selected={selectedFindingId === finding.id}
                      disabled={isClosed}
                      onToggle={() => {
                        setExpandedFinding((current) =>
                          current === finding.id ? null : finding.id,
                        )
                        setSelectedFindingId(finding.id)
                      }}
                      onAccept={() => handleFindingDecision(finding, 'accepted')}
                      onReject={() => handleFindingDecision(finding, 'rejected')}
                      onReset={() => handleFindingDecision(finding, 'pending')}
                      onLocate={() => jumpToFinding(finding.id)}
                    />
                  )
                })
              )}
            </div>
          </section>
        </aside>
      </div>

      <section className="glass-panel overflow-hidden" aria-labelledby="activity-heading">
        <div className="flex flex-col gap-3 border-b border-[var(--line)] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="activity-heading" className="text-sm font-semibold text-ink">
              Review record
            </h2>
            <p className="mt-0.5 text-[10px] text-subtle">
              Attributable history, discussion and the rules referenced by this review.
            </p>
          </div>
          <SegmentedControl
            size="sm"
            label="Review record view"
            options={[
              { value: 'activity', label: 'Activity' },
              { value: 'comments', label: `Comments (${review.comments.length})` },
              { value: 'rules', label: `Rules (${selectedGuidelines.length})` },
            ]}
            value={activityTab}
            onChange={setActivityTab}
          />
        </div>

        <div className="p-4 sm:p-5">
          {activityTab === 'activity' && (
            <ol className="space-y-0">
              {timeline.map((event, index) => {
                const actor = event.actorId === 'ai' ? null : getUser(event.actorId)
                const isAi = event.actorId === 'ai'
                return (
                  <li key={event.id} className="relative flex gap-3 pb-5 last:pb-0">
                    {index < timeline.length - 1 && (
                      <span
                        className="absolute bottom-0 left-4 top-8 w-px bg-[var(--line)]"
                        aria-hidden="true"
                      />
                    )}
                    {isAi ? (
                      <span className="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[var(--violet-line)] bg-[var(--violet-soft)] text-[var(--violet)]">
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    ) : (
                      <Avatar user={actor} size="md" className="relative z-10" />
                    )}
                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <p className="text-[11px] font-semibold text-ink">{event.action}</p>
                        <span className="text-[9px] text-subtle">
                          {isAi ? 'Demo analysis engine' : actor?.name ?? 'Unknown member'}
                        </span>
                        <span className="text-[9px] text-subtle">·</span>
                        <span className="text-[9px] text-subtle">{relativeTime(event.at)}</span>
                      </div>
                      <p className="mt-1 text-[10px] leading-relaxed text-muted">{event.note}</p>
                      <p className="mt-0.5 text-[9px] text-subtle">{formatDateTime(event.at)}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}

          {activityTab === 'comments' && (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div>
                {review.comments.length === 0 ? (
                  <EmptyState
                    icon={MessageSquare}
                    title="No comments yet"
                    description="Use comments to explain a decision, record an exception or ask the creator a question."
                    className="py-8"
                  />
                ) : (
                  <ul className="space-y-3">
                    {[...review.comments]
                      .sort((a, b) => new Date(a.at) - new Date(b.at))
                      .map((entry) => {
                        const author = getUser(entry.authorId)
                        return (
                          <li
                            key={entry.id}
                            className="flex items-start gap-3 rounded-xl border border-[var(--line)] bg-[var(--input-bg)] p-3"
                          >
                            <Avatar user={author} size="md" />
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-[11px] font-semibold text-ink">
                                  {author?.name ?? 'Unknown member'}
                                </p>
                                <span className="text-[9px] text-subtle">
                                  {relativeTime(entry.at)}
                                </span>
                              </div>
                              <p className="mt-1 whitespace-pre-wrap text-[11px] leading-relaxed text-muted">
                                {entry.body}
                              </p>
                            </div>
                          </li>
                        )
                      })}
                  </ul>
                )}
              </div>

              <form onSubmit={handleComment} className="rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] p-3.5">
                <div className="flex items-center gap-2">
                  <Avatar user={currentUser} size="sm" />
                  <p className="text-[11px] font-semibold text-ink">Add a comment</p>
                </div>
                <label htmlFor="review-comment" className="sr-only">
                  Comment on this review
                </label>
                <textarea
                  id="review-comment"
                  rows={4}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Explain a decision, record an exception or ask a question…"
                  className="glass-input mt-2.5 resize-y text-[11px]"
                />
                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="text-[9px] text-subtle">Stored locally in this demo.</p>
                  <Button type="submit" size="sm" variant="primary" disabled={!comment.trim()}>
                    Comment
                  </Button>
                </div>
              </form>
            </div>
          )}

          {activityTab === 'rules' && (
            <div className="grid gap-2 sm:grid-cols-2">
              {selectedGuidelines.map((guideline) => {
                const severity = getSeverityMeta(guideline.severity.toLowerCase())
                return (
                  <div
                    key={guideline.id}
                    className="rounded-xl border border-[var(--line)] bg-[var(--input-bg)] p-3"
                  >
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-[9px] font-semibold text-subtle">
                        {guideline.code}
                      </span>
                      <Badge tone={severity.tone}>{severity.label}</Badge>
                      <span className="ml-auto text-[9px] text-subtle">{guideline.category}</span>
                    </div>
                    <p className="mt-1.5 text-[11px] font-semibold leading-snug text-ink">
                      {guideline.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-muted">
                      {guideline.description}
                    </p>
                    <p className="mt-1.5 text-[9px] text-subtle">{guideline.source}</p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--line)] bg-[var(--panel-muted)] px-4 py-3">
        <p className="flex items-center gap-1.5 text-[10px] leading-relaxed text-subtle">
          <Sparkles className="h-3 w-3 text-[var(--violet)]" aria-hidden="true" />
          Findings were generated by a local demonstration rules engine, not an external AI service.
        </p>
        <p className="flex items-center gap-1.5 text-[10px] font-medium text-muted">
          <ShieldCheck className="h-3 w-3 text-[var(--success)]" aria-hidden="true" />
          No automatic approvals
        </p>
      </div>

      <Modal
        open={Boolean(decision)}
        onClose={() => (deciding ? null : setDecision(null))}
        title={decisionMeta?.title ?? 'Record decision'}
        description={decisionMeta?.description}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDecision(null)} disabled={deciding}>
              Cancel
            </Button>
            <Button
              variant={decisionMeta?.variant ?? 'primary'}
              icon={DecisionIcon}
              loading={deciding}
              onClick={handleDecision}
            >
              {decisionMeta?.confirm ?? 'Confirm'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] p-3.5">
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
              <p className="min-w-0 truncate text-[11px] font-semibold text-ink">{review.title}</p>
            </div>
            <p className="mt-1 text-[10px] text-subtle">
              {review.id} · Revision {review.revision} · {acceptedCount} accepted · {openCount} open
            </p>
          </div>

          {decision === 'approve' && (openCount > 0 || rejectedCount > 0) && (
            <p className="flex items-start gap-2 rounded-xl border border-[var(--warning-line)] bg-[var(--warning-soft)] px-3 py-2.5 text-[10px] leading-relaxed text-[var(--warning)]">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {openCount > 0
                ? `${openCount} suggestion${openCount === 1 ? ' has' : 's have'} no recorded decision. Approval will be logged as an explicit human exception.`
                : `${rejectedCount} suggestion${rejectedCount === 1 ? ' was' : 's were'} rejected. Confirm the remaining risk is acceptable.`}
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
                ? 'e.g. Legal reviewed the exception in the launch sync.'
                : 'Explain exactly what must change before this can be approved.'
            }
            hint={
              decision === 'approve'
                ? 'A note is recommended when approving with open findings.'
                : 'This note is shown to the creator and stored in the review record.'
            }
          />

          <p className="flex items-center gap-1.5 text-[9px] leading-relaxed text-subtle">
            <HistoryIcon className="h-3 w-3" aria-hidden="true" />
            Decision recorded as {currentUser.name}. No content is published by this demo.
          </p>
        </div>
      </Modal>
    </div>
  )
}
