import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileSearch,
  Files,
  ShieldCheck,
  Timer,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAppData } from '../context/useAppData'
import { relativeTime } from '../utils/format'
import { CONTENT_TYPES, REVIEW_STATUS_META } from '../utils/status'
import { Avatar } from '../components/common/Avatar'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { PageHeader } from '../components/common/PageHeader'
import { SearchInput } from '../components/common/SearchInput'
import { Select } from '../components/common/Form'
import { StatusBadge } from '../components/common/StatusBadge'

function csvCell(value) {
  return `"${String(value ?? '').replaceAll('"', '""')}"`
}

function scoreTone(score) {
  if (score >= 90) return 'text-[var(--success)]'
  if (score >= 75) return 'text-[var(--accent)]'
  if (score >= 60) return 'text-[var(--warning)]'
  return 'text-[var(--danger)]'
}

export default function HistoryPage() {
  const { reviews, getUser } = useAppData()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [contentType, setContentType] = useState('all')
  const [sort, setSort] = useState('newest')

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    const items = reviews.filter((review) => {
      if (status !== 'all' && review.status !== status) return false
      if (contentType !== 'all' && review.contentType !== contentType) return false
      if (!term) return true
      const owner = getUser(review.createdBy)
      return [review.title, review.id, review.contentType, owner?.name ?? '']
        .join(' ')
        .toLowerCase()
        .includes(term)
    })

    return [...items].sort((a, b) => {
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sort === 'score-low') return a.complianceScore - b.complianceScore
      if (sort === 'score-high') return b.complianceScore - a.complianceScore
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    })
  }, [contentType, getUser, query, reviews, sort, status])

  const approvedCount = reviews.filter((review) => review.status === 'approved').length
  const needsAction = reviews.filter(
    (review) => review.status === 'in-review' || review.status === 'changes-requested',
  ).length
  const averageScore = reviews.length
    ? Math.round(reviews.reduce((total, review) => total + review.complianceScore, 0) / reviews.length)
    : 0
  const totalFindings = reviews.reduce((total, review) => total + review.findings.length, 0)

  const hasFilters = query.trim() || status !== 'all' || contentType !== 'all'

  const clearFilters = () => {
    setQuery('')
    setStatus('all')
    setContentType('all')
  }

  const exportHistory = () => {
    const header = [
      'ID',
      'Title',
      'Content type',
      'Status',
      'Score',
      'Findings',
      'Open findings',
      'Creator',
      'Reviewer',
      'Updated',
    ]
    const rows = filtered.map((review) => [
      review.id,
      review.title,
      review.contentType,
      REVIEW_STATUS_META[review.status]?.label ?? review.status,
      review.complianceScore,
      review.findings.length,
      review.findings.filter((finding) => finding.status === 'pending').length,
      getUser(review.createdBy)?.name ?? '',
      review.reviewer ? getUser(review.reviewer)?.name ?? '' : '',
      review.updatedAt,
    ])
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'truth-nuke-review-history.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    toast.success('Review history exported', {
      description: `${filtered.length} review${filtered.length === 1 ? '' : 's'} exported as CSV.`,
    })
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Review history"
        title={
          <>
            Every review, every{' '}
            <span className="font-serif font-normal italic text-[var(--accent)]">decision</span>.
          </>
        }
        description="A complete record of submitted content, compliance scores and human outcomes. Open any review to inspect the full finding trail."
        actions={
          <Button variant="glass" size="sm" icon={Download} onClick={exportHistory}>
            Export CSV
          </Button>
        }
      />

      <section aria-label="Review history summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total reviews', value: reviews.length, hint: `${totalFindings} findings detected`, icon: Files },
          { label: 'Approved', value: approvedCount, hint: 'Human-approved content', icon: CheckCircle2 },
          { label: 'Needs action', value: needsAction, hint: 'Awaiting a human decision', icon: Timer },
          { label: 'Average score', value: `${averageScore}`, hint: 'Across all reviews', icon: ShieldCheck },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="glass-card flex items-start gap-3 p-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--panel-muted)] text-muted">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
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
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
              <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold text-ink">All reviews</p>
              <p className="text-[9px] text-subtle">
                {filtered.length} of {reviews.length} records
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search reviews or people…"
              label="Search review history"
              className="w-full sm:w-56"
            />
            <Select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              aria-label="Filter by review status"
              className="w-auto py-2 text-xs"
            >
              <option value="all">All statuses</option>
              {Object.entries(REVIEW_STATUS_META).map(([value, meta]) => (
                <option key={value} value={value}>
                  {meta.label}
                </option>
              ))}
            </Select>
            <Select
              value={contentType}
              onChange={(event) => setContentType(event.target.value)}
              aria-label="Filter by content type"
              className="w-auto py-2 text-xs"
            >
              <option value="all">All types</option>
              {CONTENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
            <Select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort reviews"
              className="w-auto py-2 text-xs"
            >
              <option value="newest">Recently updated</option>
              <option value="oldest">Oldest first</option>
              <option value="score-low">Lowest score</option>
              <option value="score-high">Highest score</option>
            </Select>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={FileSearch}
              title="No reviews match these filters"
              description="Try a different status, content type or search term."
              action={
                <Button variant="glass" size="sm" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-[var(--line)]">
                    {['Review', 'Type', 'Owner', 'Status', 'Score', 'Findings', 'Updated', ''].map(
                      (heading) => (
                        <th
                          key={heading || 'actions'}
                          scope="col"
                          className="whitespace-nowrap px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-subtle"
                        >
                          {heading}
                          {heading === '' && <span className="sr-only">Actions</span>}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((review) => {
                    const owner = getUser(review.createdBy)
                    const open = review.findings.filter((finding) => finding.status === 'pending').length
                    return (
                      <tr
                        key={review.id}
                        className="border-b border-[var(--line)] transition-colors last:border-0 hover:bg-[var(--hover-surface)]"
                      >
                        <td className="min-w-[240px] px-4 py-3">
                          <Link
                            to={`/review/${review.id}`}
                            className="text-[11px] font-semibold leading-snug text-ink transition-colors hover:text-[var(--accent)]"
                          >
                            {review.title}
                          </Link>
                          <p className="mt-0.5 font-mono text-[9px] text-subtle">
                            {review.id} · rev {review.revision}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-[10px] text-muted">
                          {review.contentType}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className="flex items-center gap-1.5 text-[10px] text-muted">
                            <Avatar user={owner} size="xs" />
                            {owner?.name?.split(' ')[0] ?? 'Unknown'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <StatusBadge status={review.status} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className={`text-[12px] font-semibold tabular-nums ${scoreTone(review.complianceScore)}`}>
                            {review.complianceScore}
                          </span>
                          <span className="text-[9px] text-subtle">/100</span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <span className="text-[10px] text-muted tabular-nums">
                            {open} open / {review.findings.length}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-[10px] text-subtle">
                          {relativeTime(review.updatedAt)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <Link
                            to={`/review/${review.id}`}
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)]"
                          >
                            Open
                            <ArrowRight className="h-3 w-3" aria-hidden="true" />
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="space-y-2.5 p-4 md:hidden">
              {filtered.map((review) => {
                const owner = getUser(review.createdBy)
                const open = review.findings.filter((finding) => finding.status === 'pending').length
                return (
                  <article key={review.id} className="glass-card p-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-md border border-[var(--line)] bg-[var(--panel-muted)] px-1.5 py-0.5 font-mono text-[9px] font-semibold text-subtle">
                        {review.id}
                      </span>
                      <StatusBadge status={review.status} />
                      <Badge tone="neutral" className="ml-auto">
                        {review.contentType}
                      </Badge>
                    </div>
                    <Link
                      to={`/review/${review.id}`}
                      className="mt-2 block text-[12px] font-semibold leading-snug text-ink"
                    >
                      {review.title}
                    </Link>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[9px] text-subtle">
                      <span className="flex items-center gap-1.5">
                        <Avatar user={owner} size="xs" />
                        {owner?.name ?? 'Unknown'}
                      </span>
                      <span>{open} open / {review.findings.length} findings</span>
                      <span>{relativeTime(review.updatedAt)}</span>
                      <span className={`flex items-center gap-1 text-[11px] font-semibold tabular-nums ${scoreTone(review.complianceScore)}`}>
                        {review.complianceScore}/100
                      </span>
                    </div>
                    <Link
                      to={`/review/${review.id}`}
                      className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--accent)]"
                    >
                      Open review
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  </article>
                )
              })}
            </div>
          </>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] bg-[var(--panel-muted)] px-4 py-2.5">
          <p className="text-[9px] text-subtle">
            Showing {filtered.length} record{filtered.length === 1 ? '' : 's'} · data is stored locally
          </p>
          <p className="text-[9px] text-subtle">
            CSV export includes the current filtered set · local demo data
          </p>
        </div>
      </div>
    </div>
  )
}
