import { Link } from 'react-router-dom'
import { ArrowLeft, Compass, FileSearch, LayoutDashboard, ShieldCheck } from 'lucide-react'
import { Badge } from '../components/common/Badge'
import { buttonStyles } from '../utils/buttonStyles'
import { Logo } from '../components/common/Logo'
import { ThemeMenu } from '../components/common/ThemeMenu'

const DESTINATIONS = [
  {
    to: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
    description: 'Review health, activity and items waiting on you.',
  },
  {
    to: '/guidelines',
    icon: ShieldCheck,
    label: 'Guideline Library',
    description: 'The rules Truth Nuke checks every piece of content against.',
  },
  {
    to: '/history',
    icon: FileSearch,
    label: 'Review History',
    description: 'Every past review, decision and audit trail.',
  },
]

export default function NotFoundPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="ambient-bg" aria-hidden="true" />

      <div className="relative mx-auto flex min-h-screen max-w-[1080px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link to="/" className="rounded-xl">
            <Logo />
            <span className="sr-only">home</span>
          </Link>
          <ThemeMenu />
        </header>

        <main className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <section>
            <Badge tone="info" dot>
              Error 404
            </Badge>
            <p className="mt-6 font-serif text-[92px] italic leading-none text-[var(--accent)] sm:text-[120px]">
              404
            </p>
            <h1 className="mt-2 max-w-[480px] text-[36px] font-semibold leading-[1.05] tracking-[-0.045em] text-ink sm:text-[44px]">
              This page didn’t pass review.
            </h1>
            <p className="mt-4 max-w-[440px] text-sm leading-relaxed text-muted">
              The address may be outdated, mistyped, or removed. Nothing was published, and no
              content left your browser. Let’s get you back to solid ground.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Link to="/dashboard" className={buttonStyles({ variant: 'primary' })}>
                <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                Go to dashboard
              </Link>
              <Link to="/" className={buttonStyles({ variant: 'glass' })}>
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to website
              </Link>
            </div>
          </section>

          <section aria-label="Suggested destinations">
            <div className="glass-panel overflow-hidden p-5 sm:p-6">
              <div className="flex items-center gap-2 border-b border-[var(--line)] pb-4">
                <span className="grid h-8 w-8 place-items-center rounded-xl border border-[var(--line)] bg-[var(--glass-panel-strong)] text-[var(--accent)]">
                  <Compass className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-ink">Suggested destinations</p>
                  <p className="text-[10px] text-subtle">Popular places in the workspace</p>
                </div>
              </div>

              <ul className="mt-3 space-y-1.5">
                {DESTINATIONS.map((destination) => {
                  const Icon = destination.icon
                  return (
                    <li key={destination.to}>
                      <Link
                        to={destination.to}
                        className="group flex items-start gap-3 rounded-xl border border-transparent px-3 py-3 transition-colors hover:border-[var(--line)] hover:bg-[var(--hover-surface)] focus-visible:border-[var(--line-strong)]"
                      >
                        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[var(--line)] bg-[var(--glass-panel-strong)] text-muted transition-colors group-hover:text-[var(--accent)]">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-xs font-semibold text-ink">
                            {destination.label}
                          </span>
                          <span className="mt-0.5 block text-[11px] leading-relaxed text-muted">
                            {destination.description}
                          </span>
                        </span>
                      </Link>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] px-3 py-2.5">
                <p className="text-[10px] leading-relaxed text-subtle">
                  Looking for a specific review? Open the command palette with{' '}
                  <kbd className="rounded border border-[var(--line)] bg-[var(--glass-panel-strong)] px-1.5 py-0.5 font-sans text-[9px] font-semibold text-ink">
                    ⌘K
                  </kbd>{' '}
                  from any workspace page.
                </p>
              </div>
            </div>
          </section>
        </main>

        <footer className="flex flex-col items-center justify-between gap-2 border-t border-[var(--line)] py-4 text-[10px] text-subtle sm:flex-row">
          <p>© 2026 Truth Nuke · Team Codex</p>
          <p>AI finds and explains. Humans review and approve.</p>
        </footer>
      </div>
    </div>
  )
}
