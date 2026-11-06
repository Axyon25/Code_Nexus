import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  LibraryBig,
  Search,
  SearchX,
  Settings,
  ShieldCheck,
  Users,
  ArrowRight,
  CornerDownLeft,
} from 'lucide-react'
import { useAppData } from '../../context/useAppData'
import { cn } from '../../utils/cn'
import { Modal } from '../common/Modal'
import { StatusBadge } from '../common/StatusBadge'
import { EmptyState } from '../common/EmptyState'

const PAGES = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, hint: 'Dashboard and activity' },
  { label: 'Guideline Library', to: '/guidelines', icon: LibraryBig, hint: 'Brand rules and sources' },
  { label: 'New Review', to: '/review/new', icon: FileText, hint: 'Submit content for analysis' },
  { label: 'Approval Center', to: '/approvals', icon: ClipboardCheck, hint: 'Human approval queue' },
  { label: 'Review History', to: '/history', icon: ShieldCheck, hint: 'Past reviews and decisions' },
  { label: 'Team', to: '/team', icon: Users, hint: 'Members and roles' },
  { label: 'Settings', to: '/settings', icon: Settings, hint: 'Profile, brand, appearance' },
]

export function CommandPalette({ open, onClose }) {
  const { reviews, guidelines } = useAppData()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      const frame = window.requestAnimationFrame(() => inputRef.current?.focus())
      return () => window.cancelAnimationFrame(frame)
    }
    return undefined
  }, [open])

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) {
      return {
        pages: PAGES.slice(0, 4),
        reviews: [...reviews]
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 3),
        guidelines: [],
      }
    }
    return {
      pages: PAGES.filter(
        (page) =>
          page.label.toLowerCase().includes(term) || page.hint.toLowerCase().includes(term),
      ),
      reviews: reviews
        .filter(
          (review) =>
            review.title.toLowerCase().includes(term) ||
            review.id.toLowerCase().includes(term) ||
            review.contentType.toLowerCase().includes(term),
        )
        .slice(0, 4),
      guidelines: guidelines
        .filter(
          (guideline) =>
            guideline.title.toLowerCase().includes(term) ||
            guideline.code.toLowerCase().includes(term) ||
            guideline.category.toLowerCase().includes(term),
        )
        .slice(0, 4),
    }
  }, [guidelines, query, reviews])

  const hasResults =
    results.pages.length || results.reviews.length || results.guidelines.length

  const close = () => {
    setQuery('')
    onClose()
  }

  const go = (to) => {
    close()
    navigate(to)
  }

  return (
    <Modal
      open={open}
      onClose={close}
      title="Search the workspace"
      description="Jump to a page, review or guideline rule. Searches local demo data only."
      size="lg"
    >
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search reviews, rules, pages…"
          aria-label="Search workspace"
          className="glass-input py-3 pl-10 pr-12 text-sm"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-[var(--line)] bg-[var(--panel-muted)] px-1.5 py-0.5 text-[9px] font-medium text-subtle">
          ESC
        </kbd>
      </div>

      <div className="mt-4 max-h-[48vh] overflow-y-auto pr-1">
        {!hasResults ? (
          <EmptyState
            icon={SearchX}
            title="No matches found"
            description={`Nothing in this demo workspace matches “${query}”. Try a review ID, guideline code or page name.`}
          />
        ) : (
          <div className="space-y-5">
            {results.pages.length > 0 && (
              <section>
                <h3 className="mb-1.5 px-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-subtle">
                  Pages
                </h3>
                <div className="space-y-0.5">
                  {results.pages.map((page) => {
                    const Icon = page.icon
                    return (
                      <button
                        key={page.to}
                        type="button"
                        onClick={() => go(page.to)}
                        className="group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-[var(--hover-surface)]"
                      >
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[var(--line)] bg-[var(--panel-muted)]">
                          <Icon className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-xs font-semibold text-ink">{page.label}</span>
                          <span className="block text-[10px] text-subtle">{page.hint}</span>
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-subtle opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                      </button>
                    )
                  })}
                </div>
              </section>
            )}

            {results.reviews.length > 0 && (
              <section>
                <h3 className="mb-1.5 px-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-subtle">
                  Reviews
                </h3>
                <div className="space-y-0.5">
                  {results.reviews.map((review) => (
                    <button
                      key={review.id}
                      type="button"
                      onClick={() => go(`/review/${review.id}`)}
                      className="group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-[var(--hover-surface)]"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[var(--line)] bg-[var(--panel-muted)]">
                        <FileText className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold text-ink">
                          {review.title}
                        </span>
                        <span className="block text-[10px] text-subtle">
                          {review.id} · {review.contentType} · {review.complianceScore}/100
                        </span>
                      </span>
                      <StatusBadge status={review.status} />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {results.guidelines.length > 0 && (
              <section>
                <h3 className="mb-1.5 px-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-subtle">
                  Guidelines
                </h3>
                <div className="space-y-0.5">
                  {results.guidelines.map((guideline) => (
                    <button
                      key={guideline.id}
                      type="button"
                      onClick={() => go('/guidelines')}
                      className="group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-[var(--hover-surface)]"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[var(--line)] bg-[var(--panel-muted)]">
                        <LibraryBig className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold text-ink">
                          {guideline.title}
                        </span>
                        <span className="block text-[10px] text-subtle">
                          {guideline.code} · {guideline.category} · {guideline.severity}
                        </span>
                      </span>
                      <CornerDownLeft
                        className={cn(
                          'h-3.5 w-3.5 text-subtle opacity-0 transition-opacity group-hover:opacity-100',
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] pt-3 text-[9px] text-subtle">
        <span>Demo search · results reflect local mock data</span>
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-[var(--line)] bg-[var(--panel-muted)] px-1 py-0.5">⌘</kbd>
          <kbd className="rounded border border-[var(--line)] bg-[var(--panel-muted)] px-1 py-0.5">K</kbd>
          to open
        </span>
      </div>
    </Modal>
  )
}
