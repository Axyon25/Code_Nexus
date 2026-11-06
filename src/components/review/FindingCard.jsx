import { useState } from 'react'
import {
  Check,
  ChevronDown,
  Copy,
  CornerDownRight,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '../../utils/cn'
import { getCategoryMeta, getSeverityMeta } from '../../utils/status'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'

const DECISION_META = {
  pending: { label: 'Open', tone: 'neutral' },
  accepted: { label: 'Accepted', tone: 'approved' },
  rejected: { label: 'Rejected', tone: 'rejected' },
}

export function FindingCard({
  finding,
  guideline,
  index,
  expanded,
  selected,
  disabled = false,
  onToggle,
  onAccept,
  onReject,
  onReset,
  onLocate,
}) {
  const [copied, setCopied] = useState(false)
  const category = getCategoryMeta(finding.category)
  const severity = getSeverityMeta(finding.severity)
  const decision = DECISION_META[finding.status] ?? DECISION_META.pending

  const copyCorrection = async () => {
    try {
      await navigator.clipboard.writeText(finding.suggestedCorrection)
      setCopied(true)
      toast.success('Correction copied', {
        description: 'Paste it into your draft, then re-run the review.',
      })
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      toast('Copy is unavailable in this browser', {
        description: 'Select the suggested text manually instead.',
      })
    }
  }

  return (
    <article
      className={cn(
        'rounded-2xl border bg-[var(--input-bg)] transition-colors',
        selected ? 'border-[var(--accent)]' : 'border-[var(--line)]',
        finding.status === 'accepted' && 'bg-[var(--success-soft)]',
        finding.status === 'rejected' && 'bg-[var(--panel-muted)]',
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-start gap-2.5 p-3 text-left"
      >
        <span
          className={cn(
            'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border text-[10px] font-semibold tabular-nums',
            finding.status === 'accepted'
              ? 'border-[var(--success-line)] bg-[var(--success-soft)] text-[var(--success)]'
              : finding.status === 'rejected'
                ? 'border-[var(--line)] bg-[var(--panel-muted)] text-subtle'
                : 'border-[var(--line)] bg-[var(--panel-muted)] text-muted',
          )}
          aria-hidden="true"
        >
          {finding.status === 'accepted' ? (
            <Check className="h-3 w-3" />
          ) : finding.status === 'rejected' ? (
            <X className="h-3 w-3" />
          ) : (
            index + 1
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-1.5">
            <Badge tone={severity.tone}>{severity.label}</Badge>
            <Badge tone={category.tone}>{category.short}</Badge>
            <Badge tone={decision.tone} dot>
              {decision.label}
            </Badge>
          </span>
          <span className="mt-1.5 block text-[11px] font-medium leading-snug text-ink">
            “{finding.originalText.length > 88 ? `${finding.originalText.slice(0, 88)}…` : finding.originalText}”
          </span>
          {guideline && (
            <span className="mt-1 block font-mono text-[9px] text-subtle">
              {guideline.code}
            </span>
          )}
        </span>

        <ChevronDown
          className={cn(
            'mt-1 h-3.5 w-3.5 shrink-0 text-subtle transition-transform',
            expanded && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {expanded && (
        <div className="border-t border-[var(--line)] px-3 pb-3 pt-3">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] p-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-subtle">
              Original text
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink">
              “{finding.originalText}”
            </p>
          </div>

          <div className="mt-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-subtle">
              Why it was flagged
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">{finding.explanation}</p>
          </div>

          <div className="mt-3 rounded-xl border border-[var(--success-line)] bg-[var(--success-soft)] p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--success)]">
                <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
                Suggested correction
              </p>
              <button
                type="button"
                onClick={copyCorrection}
                className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9px] font-semibold text-[var(--success)] transition-colors hover:bg-[var(--success-soft)]"
                aria-label="Copy suggested correction"
              >
                {copied ? (
                  <Check className="h-2.5 w-2.5" aria-hidden="true" />
                ) : (
                  <Copy className="h-2.5 w-2.5" aria-hidden="true" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <p className="mt-1 text-[11px] font-medium leading-relaxed text-ink">
              {finding.suggestedCorrection}
            </p>
          </div>

          {guideline && (
            <div className="mt-3 flex items-start gap-1.5">
              <CornerDownRight className="mt-0.5 h-3 w-3 shrink-0 text-subtle" aria-hidden="true" />
              <p className="text-[10px] leading-relaxed text-subtle">
                <span className="font-mono text-[9px] font-semibold text-muted">{guideline.code}</span>{' '}
                · {guideline.title}{' '}
                <span className="text-[9px]">({guideline.source})</span>
              </p>
            </div>
          )}

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] pt-3">
            <span className="text-[9px] text-subtle">
              Demo confidence {Math.round((finding.confidence ?? 0.9) * 100)}%
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {onLocate && (
                <Button size="sm" variant="ghost" onClick={onLocate}>
                  View in content
                </Button>
              )}
              {disabled ? (
                <span className="text-[9px] font-medium text-subtle">
                  Review closed — decisions are read-only.
                </span>
              ) : finding.status === 'pending' ? (
                <>
                  <Button
                    size="sm"
                    variant="glass"
                    icon={X}
                    onClick={onReject}
                    className="text-[var(--danger)]"
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={Check}
                    onClick={onAccept}
                  >
                    Accept
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="ghost" icon={RotateCcw} onClick={onReset}>
                  Reset decision
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}
