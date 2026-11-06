import { useMemo, useState } from 'react'
import {
  FileUp,
  LibraryBig,
  Plus,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAppData } from '../context/useAppData'
import { formatDate, formatNumber } from '../utils/format'
import {
  GUIDELINE_CATEGORIES,
  GUIDELINE_STATUS_META,
  SEVERITIES,
  SEVERITY_META,
} from '../utils/status'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { PageHeader } from '../components/common/PageHeader'
import { SearchInput } from '../components/common/SearchInput'
import { SegmentedControl } from '../components/common/SegmentedControl'
import { Select } from '../components/common/Form'
import { GuidelineCard } from '../components/guidelines/GuidelineCard'
import { GuidelineDetailModal } from '../components/guidelines/GuidelineDetailModal'
import { GuidelineFormModal } from '../components/guidelines/GuidelineFormModal'
import { DeleteGuidelineModal } from '../components/guidelines/DeleteGuidelineModal'
import { UploadGuidelinesModal } from '../components/guidelines/UploadGuidelinesModal'
import { Badge } from '../components/common/Badge'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All rules' },
  { value: 'active', label: 'Active' },
  { value: 'review', label: 'Needs review' },
  { value: 'draft', label: 'Draft' },
]

const SORT_OPTIONS = [
  { value: 'updated', label: 'Recently updated' },
  { value: 'severity', label: 'Severity' },
  { value: 'title', label: 'Title A–Z' },
]

const SEED_IMPORTS = [
  {
    id: 'doc-demo-1',
    name: 'Brand Book v4.2.pdf',
    size: 1482000,
    rules: 5,
    at: '2026-10-18T10:00:00.000Z',
  },
]

export default function GuidelinesPage() {
  const { guidelines, getUser, role } = useAppData()
  const [tab, setTab] = useState('rules')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [severity, setSeverity] = useState('all')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('updated')
  const [imports, setImports] = useState(SEED_IMPORTS)

  const [detail, setDetail] = useState(null)
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)

  const canManage = role === 'Manager' || role === 'Reviewer'
  const canDelete = role === 'Manager'

  const activeCount = guidelines.filter((guideline) => guideline.status === 'active').length
  const reviewCount = guidelines.filter((guideline) => guideline.status === 'review').length
  const categoryCount = new Set(guidelines.map((guideline) => guideline.category)).size
  const coverage = guidelines.length
    ? Math.round((activeCount / guidelines.length) * 100)
    : 0

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    const items = guidelines.filter((guideline) => {
      if (category !== 'all' && guideline.category !== category) return false
      if (severity !== 'all' && guideline.severity.toLowerCase() !== severity) return false
      if (status !== 'all' && guideline.status !== status) return false
      if (!term) return true
      return [guideline.title, guideline.code, guideline.description, guideline.category, guideline.source]
        .join(' ')
        .toLowerCase()
        .includes(term)
    })

    return [...items].sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title)
      if (sort === 'severity') {
        return (
          (SEVERITY_META[a.severity.toLowerCase()]?.rank ?? 9) -
          (SEVERITY_META[b.severity.toLowerCase()]?.rank ?? 9)
        )
      }
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    })
  }, [category, guidelines, query, severity, sort, status])

  const hasFilters =
    query.trim() !== '' || category !== 'all' || severity !== 'all' || status !== 'all'

  const clearFilters = () => {
    setQuery('')
    setCategory('all')
    setSeverity('all')
    setStatus('all')
  }

  const openAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (guideline) => {
    setDetail(null)
    setEditing(guideline)
    setFormOpen(true)
  }

  const handleUploaded = (document) => {
    setImports((prev) => [
      {
        id: document.id,
        name: document.name,
        size: document.size,
        rules: document.extractedRules,
        at: new Date().toISOString(),
      },
      ...prev,
    ])
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Governance library"
        title={
          <>
            The rules behind every{' '}
            <span className="font-serif font-normal italic text-[var(--accent)]">decision</span>.
          </>
        }
        description="One searchable source of truth for brand voice, approved facts, terminology, claims and accessibility. Every finding cites a rule from this library."
        actions={
          <>
            {canManage && (
              <Button
                variant="glass"
                size="sm"
                icon={FileUp}
                onClick={() => setUploadOpen(true)}
              >
                Import document
              </Button>
            )}
            {canManage && (
              <Button variant="primary" size="sm" icon={Plus} onClick={openAdd}>
                Add rule
              </Button>
            )}
          </>
        }
      />

      <section
        aria-label="Guideline library summary"
        className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          { label: 'Total rules', value: guidelines.length, hint: 'Across the workspace' },
          { label: 'Active rules', value: activeCount, hint: `${coverage}% coverage` },
          { label: 'Needs review', value: reviewCount, hint: 'Overdue or changed policy' },
          { label: 'Categories', value: categoryCount, hint: 'Distinct governance areas' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-subtle">
              {stat.label}
            </p>
            <div className="mt-2 flex items-end justify-between gap-2">
              <p className="text-2xl font-semibold tracking-tight text-ink tabular-nums">
                {formatNumber(stat.value)}
              </p>
              <p className="text-[9px] text-subtle">{stat.hint}</p>
            </div>
          </div>
        ))}
      </section>

      <h2 className="sr-only">Guideline library</h2>
      <div className="glass-panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-[var(--line)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <SegmentedControl
            label="Guideline library view"
            options={[
              { value: 'rules', label: `Rules (${guidelines.length})` },
              { value: 'imports', label: `Imports (${imports.length})` },
            ]}
            value={tab}
            onChange={setTab}
          />
          {tab === 'rules' && (
            <div className="flex flex-wrap items-center gap-2">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Search rules, codes or sources…"
                label="Search guidelines"
                className="w-full sm:w-64"
              />
              <Select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                aria-label="Filter by category"
                className="w-auto py-2 text-xs"
              >
                <option value="all">All categories</option>
                {GUIDELINE_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
              <Select
                value={severity}
                onChange={(event) => setSeverity(event.target.value)}
                aria-label="Filter by severity"
                className="w-auto py-2 text-xs"
              >
                <option value="all">All severities</option>
                {SEVERITIES.map((item) => (
                  <option key={item} value={item}>
                    {SEVERITY_META[item].label}
                  </option>
                ))}
              </Select>
              <Select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                aria-label="Sort guidelines"
                className="w-auto py-2 text-xs"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>

        {tab === 'rules' ? (
          <div className="p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <SegmentedControl
                size="sm"
                label="Filter by rule status"
                options={STATUS_OPTIONS}
                value={status}
                onChange={setStatus}
              />
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-subtle">
                  {filtered.length} of {guidelines.length} rules
                </p>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)]"
                  >
                    <X className="h-3 w-3" aria-hidden="true" />
                    Clear filters
                  </button>
                )}
              </div>
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                icon={LibraryBig}
                title="No rules match these filters"
                description="Try a different category, severity or search term. New rules can be added to the local demo library at any time."
                action={
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button variant="glass" size="sm" onClick={clearFilters}>
                      Clear filters
                    </Button>
                    {canManage && (
                      <Button variant="primary" size="sm" icon={Plus} onClick={openAdd}>
                        Add a rule
                      </Button>
                    )}
                  </div>
                }
              />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((guideline) => (
                  <GuidelineCard
                    key={guideline.id}
                    guideline={guideline}
                    owner={getUser(guideline.ownerId)}
                    canEdit={canManage}
                    canDelete={canDelete}
                    onView={setDetail}
                    onEdit={openEdit}
                    onDelete={setDeleting}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] px-3.5 py-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-ink">Document import is simulated</p>
                  <p className="mt-0.5 text-[10px] text-muted">
                    Files never leave your browser. No rules are extracted automatically in this demo.
                  </p>
                </div>
              </div>
              {canManage && (
                <Button size="sm" variant="glass" icon={FileUp} onClick={() => setUploadOpen(true)}>
                  Import document
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {imports.map((document) => (
                <div
                  key={document.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--line)] p-3.5"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[var(--panel-muted)] text-muted">
                    <FileUp className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-ink">{document.name}</p>
                    <p className="mt-0.5 text-[10px] text-subtle">
                      {formatNumber(Math.round(document.size / 1024))} KB ·{' '}
                      {formatDate(document.at)} · {document.rules} suggested rules
                    </p>
                  </div>
                  <Badge tone="approved" dot>
                    Simulated
                  </Badge>
                  <button
                    type="button"
                    onClick={() => {
                      setImports((prev) => prev.filter((item) => item.id !== document.id))
                      toast('Import record removed', {
                        description: 'Only the local demo record was removed.',
                      })
                    }}
                    className="btn btn-ghost btn-icon"
                    aria-label={`Remove import record for ${document.name}`}
                    title="Remove import record"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] p-3.5 text-[10px] leading-relaxed text-muted">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--success)]" aria-hidden="true" />
              <p>
                A connected backend would parse documents into citeable rules and require a human to
                accept each import. This build records the interaction only.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--line)] bg-[var(--panel-muted)] px-4 py-3">
        <p className="text-[10px] leading-relaxed text-subtle">
          {GUIDELINE_STATUS_META.active.label} rules are used by the demo rules engine during review.
          Changes persist in your browser.
        </p>
        <p className="flex items-center gap-1.5 text-[10px] font-medium text-muted">
          <ShieldCheck className="h-3 w-3 text-[var(--success)]" aria-hidden="true" />
          AI suggests. Humans approve.
        </p>
      </div>

      {formOpen && (
        <GuidelineFormModal
          open
          guideline={editing}
          onClose={() => {
            setFormOpen(false)
            setEditing(null)
          }}
        />
      )}
      <GuidelineDetailModal
        open={Boolean(detail)}
        guideline={detail}
        canEdit={canManage}
        onClose={() => setDetail(null)}
        onEdit={openEdit}
      />
      <DeleteGuidelineModal
        open={Boolean(deleting)}
        guideline={deleting}
        onClose={() => setDeleting(null)}
        onDeleted={() => setDeleting(null)}
      />
      {uploadOpen && (
        <UploadGuidelinesModal
          open
          onClose={() => setUploadOpen(false)}
          onUploaded={handleUploaded}
        />
      )}
    </div>
  )
}
