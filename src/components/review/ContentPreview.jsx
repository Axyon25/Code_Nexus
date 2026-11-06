import { useMemo } from 'react'
import { Check, FileText, ScanSearch } from 'lucide-react'
import { buildSegments } from '../../utils/highlight'
import { getSeverityMeta } from '../../utils/status'
import { Badge } from '../common/Badge'
import { SegmentedControl } from '../common/SegmentedControl'

const MODES = [
  { value: 'highlighted', label: 'Highlighted' },
  { value: 'suggested', label: 'Suggested edits' },
  { value: 'original', label: 'Original' },
]

const MARK_TONES = {
  critical: 'bg-[var(--danger-soft)] text-[var(--danger)] decoration-[var(--danger)]',
  high: 'bg-[var(--warning-soft)] text-[var(--warning)] decoration-[var(--warning)]',
  medium: 'bg-[var(--teal-soft)] text-[var(--teal)] decoration-[var(--teal)]',
  low: 'bg-[var(--neutral-soft)] text-[var(--neutral)] decoration-[var(--neutral)]',
  accepted: 'bg-[var(--success-soft)] text-[var(--success)] decoration-[var(--success)]',
}

export function ContentPreview({
  content,
  findings,
  mode,
  onModeChange,
  selectedId,
  onSelect,
}) {
  const segments = useMemo(() => {
    if (mode === 'original') return [{ type: 'text', text: content }]
    if (mode === 'suggested') {
      const applicable = findings
        .filter((finding) => finding.status !== 'rejected')
        .map((finding) => ({ ...finding, status: 'accepted' }))
      return buildSegments(content, applicable, { corrected: true })
    }
    return buildSegments(content, findings)
  }, [content, findings, mode])

  const words = content.trim() ? content.trim().split(/\s+/).length : 0

  return (
    <section className="glass-panel overflow-hidden" aria-labelledby="content-preview-heading">
      <div className="flex flex-col gap-3 border-b border-[var(--line)] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="content-preview-heading" className="text-xs font-semibold text-ink">
              Submitted content
            </h2>
            <p className="text-[9px] text-subtle">
              {words} words · {content.length.toLocaleString('en-GB')} characters
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="violet" icon={ScanSearch}>
            Simulated analysis
          </Badge>
          <SegmentedControl
            size="sm"
            label="Content preview mode"
            options={MODES}
            value={mode}
            onChange={onModeChange}
          />
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="max-h-[560px] overflow-y-auto rounded-2xl border border-[var(--line)] bg-[var(--input-bg)] p-4 sm:p-5">
          <div className="whitespace-pre-wrap text-[12px] leading-[1.85] text-ink">
            {segments.map((segment, index) => {
              if (segment.type === 'text') {
                return <span key={`text-${index}`}>{segment.text}</span>
              }
              const finding = segment.finding
              const severity = getSeverityMeta(finding.severity)
              const isAccepted = segment.type === 'accepted'
              const tone = isAccepted ? 'accepted' : finding.severity
              return (
                <button
                  key={`${finding.id}-${index}`}
                  type="button"
                  id={`mark-${finding.id}`}
                  onClick={() => onSelect(finding.id)}
                  title={`${severity.label} ${isAccepted ? 'accepted' : 'finding'}: ${finding.explanation}`}
                  className={`mx-0.5 inline rounded-[3px] px-0.5 text-left font-medium underline decoration-2 underline-offset-2 transition-shadow hover:shadow-[0_0_0_2px_var(--accent-soft)] ${
                    MARK_TONES[tone] ?? MARK_TONES.low
                  } ${
                    selectedId === finding.id
                      ? 'shadow-[0_0_0_2px_var(--accent)]'
                      : ''
                  }`}
                >
                  {segment.text}
                  {isAccepted && (
                    <Check
                      className="ml-0.5 inline h-2.5 w-2.5 align-baseline"
                      aria-hidden="true"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          {['critical', 'high', 'medium', 'low'].map((severity) => {
            const meta = getSeverityMeta(severity)
            const count = findings.filter(
              (finding) => finding.severity === severity && finding.status !== 'rejected',
            ).length
            return (
              <span key={severity} className="flex items-center gap-1.5 text-[9px] text-subtle">
                <span
                  className={`h-2 w-2 rounded-full ${
                    severity === 'critical'
                      ? 'bg-[var(--danger)]'
                      : severity === 'high'
                        ? 'bg-[var(--warning)]'
                        : severity === 'medium'
                          ? 'bg-[var(--teal)]'
                          : 'bg-[var(--neutral)]'
                  }`}
                  aria-hidden="true"
                />
                {meta.label} · {count}
              </span>
            )
          })}
          <span className="flex items-center gap-1.5 text-[9px] text-subtle">
            <span className="h-2 w-2 rounded-full bg-[var(--success)]" aria-hidden="true" />
            Accepted · {findings.filter((finding) => finding.status === 'accepted').length}
          </span>
          <span className="ml-auto text-[9px] text-subtle">
            Click a highlight to open its finding.
          </span>
        </div>

        {mode === 'suggested' && (
          <p className="mt-3 rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] px-3 py-2 text-[10px] leading-relaxed text-muted">
            This is a <strong className="font-semibold text-ink">preview only</strong>. Every
            highlighted correction would replace the original text if applied. Accepted decisions are
            recorded per finding below.
          </p>
        )}
      </div>
    </section>
  )
}
