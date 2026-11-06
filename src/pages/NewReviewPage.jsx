import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  FileText,
  ListChecks,
  Loader2,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Wand2,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAppData } from '../context/useAppData'
import { analyseContent } from '../services/reviewService'
import { CONTENT_TYPES, GUIDELINE_CATEGORY_META, getSeverityMeta } from '../utils/status'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { PageHeader } from '../components/common/PageHeader'
import { SearchInput } from '../components/common/SearchInput'
import { SelectField, TextAreaField, TextField } from '../components/common/Form'

const SAMPLE_CONTENT = `Introducing Aurora X1 — the world's first fully recyclable smart speaker.

At Northwind, we believe technology should feel effortless. The Aurora X1 is clinically proven to reduce stress by 40% and delivers the fastest setup in the industry.

Utilize the companion app to get started in under 60 seconds. Simply CLICK HERE to download the app and pair your speaker.

Early access pricing is valid until March 2025. Aurora X1 is available now across Europe and the US, with global availability to follow.

Our customers love it — 100% of users say it changed their lives.`

const SAMPLE_GUIDELINES = [
  'g-bv-01',
  'g-af-01',
  'g-af-02',
  'g-af-03',
  'g-tb-02',
  'g-tb-03',
  'g-mc-01',
  'g-mc-02',
  'g-mc-03',
  'g-ac-02',
]

const STEPS = [
  'Checking claims against the Approved Facts Register',
  'Comparing terminology with the brand voice rules',
  'Flagging stale dates and accessibility issues',
  'Scoring findings and preparing a human decision pack',
]

export default function NewReviewPage() {
  const { guidelines, submitReview, isSubmitting, role } = useAppData()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [contentType, setContentType] = useState('Blog post')
  const [content, setContent] = useState('')
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [query, setQuery] = useState('')
  const [errors, setErrors] = useState({})
  const [stepIndex, setStepIndex] = useState(0)

  const selectableGuidelines = useMemo(
    () => guidelines.filter((guideline) => guideline.status !== 'draft'),
    [guidelines],
  )

  const grouped = useMemo(() => {
    const term = query.trim().toLowerCase()
    return Object.keys(GUIDELINE_CATEGORY_META)
      .map((category) => ({
        category,
        items: selectableGuidelines.filter((guideline) => {
          if (guideline.category !== category) return false
          if (!term) return true
          return [guideline.title, guideline.code, guideline.description]
            .join(' ')
            .toLowerCase()
            .includes(term)
        }),
      }))
      .filter((group) => group.items.length > 0)
  }, [query, selectableGuidelines])

  const words = content.trim() ? content.trim().split(/\s+/).length : 0
  const selectedGuidelines = selectableGuidelines.filter((guideline) => selectedIds.has(guideline.id))
  const criticalSelected = selectedGuidelines.filter(
    (guideline) => guideline.severity.toLowerCase() === 'critical',
  ).length

  const preview = useMemo(() => {
    if (content.trim().length < 40 || selectedGuidelines.length === 0) return null
    return analyseContent({ content, guidelines: selectedGuidelines })
  }, [content, selectedGuidelines])

  useEffect(() => {
    if (!isSubmitting) return undefined
    const timer = window.setInterval(() => {
      setStepIndex((index) => Math.min(index + 1, STEPS.length - 1))
    }, 480)
    return () => window.clearInterval(timer)
  }, [isSubmitting])

  const toggle = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setErrors((prev) => ({ ...prev, guidelines: undefined }))
  }

  const toggleCategory = (items) => {
    const allSelected = items.every((item) => selectedIds.has(item.id))
    setSelectedIds((prev) => {
      const next = new Set(prev)
      for (const item of items) {
        if (allSelected) next.delete(item.id)
        else next.add(item.id)
      }
      return next
    })
    setErrors((prev) => ({ ...prev, guidelines: undefined }))
  }

  const loadSample = () => {
    setTitle('Aurora X1 launch announcement')
    setContentType('Blog post')
    setContent(SAMPLE_CONTENT)
    setSelectedIds(new Set(SAMPLE_GUIDELINES))
    setErrors({})
    toast('Sample brief loaded', {
      description: 'Aurora launch copy and 10 governance rules are ready to analyse.',
    })
  }

  const validate = () => {
    const next = {}
    if (!title.trim()) next.title = 'Give this review a short, recognisable title.'
    else if (title.trim().length > 100) next.title = 'Keep the title under 100 characters.'
    if (content.trim().length < 40) next.content = 'Paste at least 40 characters of content to review.'
    if (selectedIds.size === 0) next.guidelines = 'Select at least one guideline rule.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) {
      document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    try {
      setStepIndex(0)
      const review = await submitReview({
        title: title.trim(),
        contentType,
        content,
        guidelineIds: [...selectedIds],
      })
      toast.success('Demo analysis complete', {
        description: `${review.findings.length} findings are ready for human review. Nothing was published.`,
      })
      navigate(`/review/${review.id}`)
    } catch (error) {
      toast.error(error.message || 'Unable to analyse the content.')
    }
  }

  if (role === 'Reviewer') {
    return (
      <div className="glass-panel p-8 text-center">
        <ShieldCheck className="mx-auto h-8 w-8 text-[var(--accent)]" aria-hidden="true" />
        <h1 className="mt-3 text-xl font-semibold text-ink">Creators submit content</h1>
        <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-muted">
          Your reviewer role can inspect and decide on submitted reviews from the approval centre.
          Switch to a Creator or Manager role from Settings → Profile to start a new review in this demo.
        </p>
        <Button variant="primary" className="mt-5" onClick={() => navigate('/approvals')}>
          Open approval centre
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="New review"
        title={
          <>
            Check the content before it{' '}
            <span className="font-serif font-normal italic text-[var(--accent)]">ships</span>.
          </>
        }
        description="Paste a draft, choose the rules that apply and run the demo analysis. Findings are suggestions only — a human still makes the final decision."
        actions={
          <Button variant="glass" size="sm" icon={Wand2} onClick={loadSample}>
            Load sample brief
          </Button>
        }
      />

      <div className="flex items-start gap-2.5 rounded-2xl border border-[var(--info-line)] bg-[var(--info-soft)] px-4 py-3">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--info)]" aria-hidden="true" />
        <p className="text-[11px] leading-relaxed text-[var(--info)]">
          <strong className="font-semibold">Demo analysis.</strong> A small local rules engine runs in
          your browser. No AI model, external API or upload is connected, and no content leaves this
          page.
        </p>
      </div>

      <form id="review-form" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-4">
            <section className="glass-panel p-5" aria-labelledby="content-details-heading">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                    <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <h2 id="content-details-heading" className="text-sm font-semibold text-ink">
                    Content details
                  </h2>
                </div>
                <span className="text-[10px] text-subtle">Step 1 of 2</span>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px]">
                <TextField
                  label="Review title"
                  placeholder="e.g. Aurora X1 launch announcement"
                  value={title}
                  maxLength={100}
                  onChange={(event) => {
                    setTitle(event.target.value)
                    setErrors((prev) => ({ ...prev, title: undefined }))
                  }}
                  error={errors.title}
                  required
                />
                <SelectField
                  label="Content type"
                  value={contentType}
                  onChange={(event) => setContentType(event.target.value)}
                >
                  {CONTENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </SelectField>
              </div>

              <div className="mt-4">
                <TextAreaField
                  label="Content to review"
                  rows={15}
                  placeholder="Paste the draft copy, email, article or documentation here…"
                  value={content}
                  onChange={(event) => {
                    setContent(event.target.value)
                    setErrors((prev) => ({ ...prev, content: undefined }))
                  }}
                  error={errors.content}
                  required
                  hint={`${content.length.toLocaleString('en-GB')} characters · ${words.toLocaleString('en-GB')} words`}
                  className="font-mono text-[12px] leading-relaxed"
                />
              </div>
            </section>

            <section className="glass-panel p-5" aria-labelledby="rules-heading">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                      <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <h2 id="rules-heading" className="text-sm font-semibold text-ink">
                      Guidelines to check
                    </h2>
                    <Badge tone="info">{selectedIds.size} selected</Badge>
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted">
                    Choose the rules that govern this content. Findings always cite the exact rule.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <SearchInput
                    value={query}
                    onChange={setQuery}
                    placeholder="Find a rule…"
                    label="Search guideline rules"
                    className="w-full sm:w-52"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setSelectedIds(new Set(selectableGuidelines.map((guideline) => guideline.id)))
                    }
                  >
                    Select all
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
                    Clear
                  </Button>
                </div>
              </div>

              {errors.guidelines && (
                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[var(--danger)]" role="alert">
                  <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                  {errors.guidelines}
                </p>
              )}

              <div className="mt-4 space-y-4">
                {grouped.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-[var(--line-strong)] px-4 py-6 text-center text-[11px] text-subtle">
                    No rules match “{query}”. Clear the search to see all guidelines.
                  </p>
                ) : (
                  grouped.map((group) => {
                    const allSelected = group.items.every((item) => selectedIds.has(item.id))
                    return (
                      <div key={group.category}>
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-[10px] font-semibold uppercase tracking-[0.13em] text-subtle">
                              {group.category}
                            </h3>
                            <span className="text-[9px] text-subtle">
                              {group.items.filter((item) => selectedIds.has(item.id)).length}/
                              {group.items.length}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleCategory(group.items)}
                            className="rounded-md px-1.5 py-0.5 text-[10px] font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)]"
                          >
                            {allSelected ? 'Deselect group' : 'Select group'}
                          </button>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {group.items.map((guideline) => {
                            const severity = getSeverityMeta(guideline.severity.toLowerCase())
                            const checked = selectedIds.has(guideline.id)
                            return (
                              <label
                                key={guideline.id}
                                htmlFor={`rule-${guideline.id}`}
                                className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-2.5 transition-colors ${
                                  checked
                                    ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                                    : 'border-[var(--line)] bg-[var(--input-bg)] hover:border-[var(--line-strong)]'
                                }`}
                              >
                                <input
                                  id={`rule-${guideline.id}`}
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggle(guideline.id)}
                                  className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-[var(--line-strong)] accent-[var(--accent)]"
                                />
                                <span className="min-w-0 flex-1">
                                  <span className="flex items-start justify-between gap-2">
                                    <span className="font-mono text-[9px] font-semibold text-subtle">
                                      {guideline.code}
                                    </span>
                                    <Badge tone={severity.tone} className="!px-1.5 !py-0 !text-[8px]">
                                      {severity.label}
                                    </Badge>
                                  </span>
                                  <span className="mt-0.5 block text-[11px] font-medium leading-snug text-ink">
                                    {guideline.title}
                                  </span>
                                </span>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
            <section className="glass-panel p-5" aria-labelledby="review-readiness-heading">
              <div className="flex items-center justify-between gap-2">
                <h2 id="review-readiness-heading" className="text-sm font-semibold text-ink">
                  Review readiness
                </h2>
                <Badge tone={preview ? 'info' : 'neutral'} dot>
                  {preview ? 'Ready' : 'Draft'}
                </Badge>
              </div>

              <ul className="mt-4 space-y-2.5">
                {[
                  { ok: title.trim().length > 0, label: 'Title added' },
                  { ok: content.trim().length >= 40, label: 'Content pasted' },
                  { ok: selectedIds.size > 0, label: 'Guidelines selected' },
                ].map((item) => (
                  <li key={item.label} className="flex items-center gap-2 text-[11px]">
                    <span
                      className={`grid h-4 w-4 place-items-center rounded-full ${
                        item.ok
                          ? 'bg-[var(--success-soft)] text-[var(--success)]'
                          : 'bg-[var(--neutral-soft)] text-subtle'
                      }`}
                    >
                      {item.ok ? (
                        <Check className="h-2.5 w-2.5" aria-hidden="true" />
                      ) : (
                        <span className="h-1 w-1 rounded-full bg-current" aria-hidden="true" />
                      )}
                    </span>
                    <span className={item.ok ? 'text-ink' : 'text-subtle'}>{item.label}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] p-3">
                  <p className="text-lg font-semibold text-ink tabular-nums">{words}</p>
                  <p className="text-[9px] text-subtle">words</p>
                </div>
                <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] p-3">
                  <p className="text-lg font-semibold text-ink tabular-nums">{selectedIds.size}</p>
                  <p className="text-[9px] text-subtle">rules selected</p>
                </div>
              </div>

              {criticalSelected > 0 && (
                <p className="mt-3 flex items-start gap-1.5 rounded-lg border border-[var(--warning-line)] bg-[var(--warning-soft)] px-2.5 py-2 text-[10px] leading-relaxed text-[var(--warning)]">
                  <ShieldCheck className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                  {criticalSelected} critical rule{criticalSelected === 1 ? '' : 's'} selected.
                  Findings will need Legal or brand-owner attention before approval.
                </p>
              )}

              {preview && (
                <div className="mt-3 rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] p-3">
                  <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-subtle">
                    <ScanSearch className="h-3 w-3" aria-hidden="true" />
                    Live preview (local)
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-[11px] text-muted">
                      {preview.findings.length} possible finding
                      {preview.findings.length === 1 ? '' : 's'}
                    </p>
                    <p className="text-sm font-semibold text-ink tabular-nums">
                      {preview.complianceScore}/100
                    </p>
                  </div>
                  <p className="mt-2 text-[9px] leading-relaxed text-subtle">
                    Indicative only. The full review saves a record you can inspect and discuss.
                  </p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="mt-4 w-full"
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Analysing content…' : 'Run demo analysis'}
                {!isSubmitting && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
              </Button>
              <p className="mt-2 text-center text-[9px] leading-relaxed text-subtle">
                Creates a review record. Does not publish or approve content.
              </p>
            </section>

            <section className="glass-card p-4" aria-labelledby="what-happens-heading">
              <h2 id="what-happens-heading" className="text-xs font-semibold text-ink">
                What happens next
              </h2>
              <ol className="mt-3 space-y-2.5">
                {[
                  'The demo rules engine compares content with selected rules.',
                  'Findings are scored, explained and tied to a guideline.',
                  'You review each suggestion and accept or reject it.',
                  'A human reviewer records the final approval decision.',
                ].map((step, index) => (
                  <li key={step} className="flex gap-2 text-[10px] leading-relaxed text-muted">
                    <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-[var(--line)] bg-[var(--input-bg)] text-[8px] font-semibold text-subtle">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </section>
          </aside>
        </div>
      </form>

      {isSubmitting && (
        <div
          className="fixed inset-0 z-[95] grid place-items-center bg-[rgba(4,10,22,0.42)] p-4 backdrop-blur-[6px]"
          role="status"
          aria-live="polite"
        >
          <div className="glass-modal w-full max-w-md p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--accent-soft)] text-[var(--accent)]">
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">Running the demo analysis</p>
                <p className="mt-0.5 text-[11px] text-muted">
                  This takes a moment. Nothing is uploaded.
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-2">
              {STEPS.map((step, index) => {
                const done = index < stepIndex
                const active = index === stepIndex
                return (
                  <div
                    key={step}
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-[10px] ${
                      active ? 'bg-[var(--accent-soft)] text-ink' : 'text-subtle'
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--success)]" aria-hidden="true" />
                    ) : active ? (
                      <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-[var(--accent)]" aria-hidden="true" />
                    ) : (
                      <span className="h-3.5 w-3.5 shrink-0 rounded-full border border-[var(--line-strong)]" aria-hidden="true" />
                    )}
                    {step}
                  </div>
                )
              })}
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
                style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
