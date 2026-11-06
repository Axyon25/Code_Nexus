import { Link, Outlet } from 'react-router-dom'
import {
  ArrowUpRight,
  CheckCircle2,
  FileSearch,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Logo } from '../components/common/Logo'
import { ThemeMenu } from '../components/common/ThemeMenu'
import { Badge } from '../components/common/Badge'
import { ProgressRing } from '../components/common/ProgressRing'

const BENEFITS = [
  {
    icon: FileSearch,
    title: 'Detect what copy review misses',
    body: 'Claims, stale dates, terminology drift and accessibility gaps — surfaced with the exact rule that was broken.',
  },
  {
    icon: ShieldCheck,
    title: 'Humans stay in control',
    body: 'Every suggestion is explained, attributable and optional. Nothing is published automatically.',
  },
  {
    icon: Sparkles,
    title: 'One source of brand truth',
    body: 'Guidelines, evidence and decisions live together, so governance improves with every review.',
  },
]

export function AuthLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="ambient-bg" aria-hidden="true" />
      <div className="relative mx-auto flex min-h-screen max-w-[1320px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link to="/" className="rounded-xl">
            <Logo />
            <span className="sr-only">home</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-muted transition-colors hover:bg-[var(--hover-surface)] hover:text-ink sm:flex"
            >
              Back to website
              <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </Link>
            <ThemeMenu />
          </div>
        </header>

        <main className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-14 lg:py-10">
          <section className="hidden lg:block" aria-label="About Truth Nuke">
            <div className="glass-panel relative min-h-[640px] overflow-hidden p-9">
              <div
                className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--accent)] opacity-[0.12] blur-3xl"
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-grid opacity-40" aria-hidden="true" />

              <div className="relative flex h-full flex-col">
                <Badge tone="info" dot>
                  Intelligent brand governance
                </Badge>

                <h1 className="mt-6 max-w-[440px] text-[42px] font-semibold leading-[1.04] tracking-[-0.045em] text-ink xl:text-[48px]">
                  Nuke inconsistencies{' '}
                  <span className="font-serif font-normal italic text-[var(--accent)]">
                    before
                  </span>{' '}
                  they reach your audience.
                </h1>
                <p className="mt-4 max-w-[420px] text-[13px] leading-relaxed text-muted">
                  One intelligent governance workspace for every claim, rule and piece of content.
                  AI finds and explains. Your team reviews and approves.
                </p>

                <ul className="mt-7 space-y-4">
                  {BENEFITS.map((benefit) => {
                    const Icon = benefit.icon
                    return (
                      <li key={benefit.title} className="flex gap-3">
                        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-[var(--line)] bg-[var(--glass-panel-strong)] text-[var(--accent)]">
                          <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span>
                          <span className="block text-xs font-semibold text-ink">{benefit.title}</span>
                          <span className="mt-0.5 block max-w-[360px] text-[11px] leading-relaxed text-muted">
                            {benefit.body}
                          </span>
                        </span>
                      </li>
                    )
                  })}
                </ul>

                <div className="relative mt-auto pt-8">
                  <div className="glass-card animate-float-slow flex items-center gap-4 p-4">
                    <ProgressRing value={68} size={72} strokeWidth={6} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-subtle">
                        Latest analysis
                      </p>
                      <p className="mt-1 truncate text-xs font-semibold text-ink">
                        Aurora X1 launch announcement
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <Badge tone="critical">2 critical</Badge>
                        <Badge tone="high">3 high</Badge>
                        <span className="text-[9px] text-subtle">9 findings</span>
                      </div>
                    </div>
                  </div>
                  <div className="glass-popover absolute -bottom-4 right-2 hidden items-center gap-2 px-3 py-2 xl:flex">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[var(--success)]" aria-hidden="true" />
                    <span className="text-[10px] font-medium text-ink">
                      Human approval still required
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-[var(--line)] pt-4">
                  <p className="max-w-[260px] text-[10px] leading-relaxed text-subtle">
                    “We stopped arguing about copy in comments. The rule and the source are right
                    there.”
                  </p>
                  <p className="text-right text-[10px] font-medium text-ink">
                    Maya Chen
                    <span className="mt-0.5 block font-normal text-subtle">Head of Brand, Northwind</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto w-full max-w-[440px]">
            <Outlet />
            <p className="mt-5 text-center text-[10px] leading-relaxed text-subtle">
              Frontend demonstration only. No authentication service is connected and no personal
              data is sent anywhere.
            </p>
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
