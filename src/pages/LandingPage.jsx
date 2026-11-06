import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Accessibility,
  ArrowRight,
  BadgeCheck,
  Bell,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Eye,
  FileSearch,
  FileText,
  GitBranch,
  Layers,
  LibraryBig,
  LockKeyhole,
  Megaphone,
  Menu,
  Quote,
  ScanSearch,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  X,
  Zap,
} from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { Avatar } from '../components/common/Avatar'
import { Badge } from '../components/common/Badge'
import { Logo } from '../components/common/Logo'
import { ThemeMenu } from '../components/common/ThemeMenu'
import { buttonStyles } from '../utils/buttonStyles'
import { chartData, users } from '../data/mockData'
import { cn } from '../utils/cn'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Use cases', href: '#use-cases' },
  { label: 'Responsible AI', href: '#responsible-ai' },
]

const CAPABILITIES = [
  {
    icon: FileSearch,
    tone: 'violet',
    title: 'Claim and fact verification',
    body: 'Compare every quantified claim, date and product detail against your approved facts register. Findings show the source, not just a warning.',
    featured: true,
  },
  {
    icon: LibraryBig,
    tone: 'info',
    title: 'Guideline-anchored findings',
    body: 'Each issue cites the exact rule, category, severity and source document behind it.',
  },
  {
    icon: Accessibility,
    tone: 'amber',
    title: 'Accessibility checks',
    body: 'Catch unclear link text, all-caps passages and other content-level WCAG risks before publishing.',
  },
  {
    icon: MessageSquareIcon,
    tone: 'teal',
    title: 'Voice and terminology',
    body: 'Keep tone consistent and replace off-brand jargon with language your readers recognise.',
  },
  {
    icon: GitBranch,
    tone: 'rose',
    title: 'Human approval workflow',
    body: 'Route reviewed content to a person for approval, changes or rejection. Every step is recorded.',
  },
  {
    icon: Layers,
    tone: 'indigo',
    title: 'One source of truth',
    body: 'Guidelines, review history and decisions stay together so governance compounds over time.',
  },
]

function MessageSquareIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path
        d="M20 15a3 3 0 0 1-3 3H8l-4 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v9Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 9h8M8 13h5" strokeLinecap="round" />
    </svg>
  )
}

const WORKFLOW = [
  {
    step: '01',
    title: 'Upload your rules',
    body: 'Bring brand books, approved facts, terminology and accessibility standards into one searchable library.',
    icon: LibraryBig,
  },
  {
    step: '02',
    title: 'Submit content',
    body: 'Paste copy or drop a document. Choose which guideline sets should apply.',
    icon: FileText,
  },
  {
    step: '03',
    title: 'AI analysis',
    body: 'Content is checked against every selected rule with severity and an explanation for each finding.',
    icon: ScanSearch,
  },
  {
    step: '04',
    title: 'Review findings',
    body: 'See the highlighted source text alongside the guideline reference and suggested correction.',
    icon: Eye,
  },
  {
    step: '05',
    title: 'Apply corrections',
    body: 'Accept, reject or discuss each suggestion. The corrected version is a proposal — never a publication.',
    icon: BadgeCheck,
  },
  {
    step: '06',
    title: 'Human approval',
    body: 'A reviewer approves, requests changes or rejects. The decision and rationale are kept in the audit trail.',
    icon: ClipboardCheck,
  },
]

const USE_CASES = [
  {
    id: 'marketing',
    label: 'Marketing',
    icon: Megaphone,
    title: 'Ship campaigns without shipping contradictions',
    body: 'Campaigns move fast. Truth Nuke keeps launch copy, offers and product claims aligned with the latest approved facts — before they reach paid media.',
    bullets: [
      'Catch expired offers and stale launch dates',
      'Flag unverifiable superlatives and comparison claims',
      'Keep terminology consistent across every channel',
    ],
    metric: '9 issues found in a 280-word launch post',
    scenario: 'Aurora X1 launch announcement',
  },
  {
    id: 'legal',
    label: 'Legal & compliance',
    icon: Scale,
    title: 'Turn policy into a reviewable trail',
    body: 'Legal rules should not live in a PDF nobody opens. Convert restrictions into explicit rules with evidence, severity and a human decision record.',
    bullets: [
      'Require sources for financial and impact figures',
      'Block guaranteed outcomes and regulated wording',
      'Preserve revision history for audits',
    ],
    metric: 'Every finding linked to a source clause',
    scenario: 'Investor update review',
  },
  {
    id: 'brand',
    label: 'Brand teams',
    icon: Sparkles,
    title: 'Protect the voice at every touchpoint',
    body: 'Give writers a fast, consistent first pass without turning brand review into a bottleneck. AI suggests; the brand team decides.',
    bullets: [
      'Enforce tone, naming and preferred terminology',
      'Explain every suggestion in plain language',
      'Keep human judgement at the final gate',
    ],
    metric: 'One voice across web, email and social',
    scenario: 'Careers page refresh',
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    icon: Accessibility,
    title: 'Catch content-level barriers early',
    body: 'Catch the accessibility issues that design reviews miss: vague link text, all-caps emphasis and content that only works visually.',
    bullets: [
      'Flag non-descriptive link text',
      'Detect difficult all-caps passages',
      'Attach WCAG references to each finding',
    ],
    metric: 'WCAG 2.2 AA guidance built in',
    scenario: 'Onboarding email sequence',
  },
]

const RESPONSIBLE = [
  {
    icon: ShieldCheck,
    title: 'No automatic publishing',
    body: 'Truth Nuke never sends content live. It prepares a decision for a person.',
  },
  {
    icon: Eye,
    title: 'Explainable by default',
    body: 'Every finding includes the original text, reason, severity and the guideline it violated.',
  },
  {
    icon: GitBranch,
    title: 'Traceable decisions',
    body: 'Accepted suggestions, rejected suggestions and human approvals are logged separately.',
  },
  {
    icon: LockKeyhole,
    title: 'Honest about the demo',
    body: 'This build uses a transparent local rules engine. No external AI service receives your content.',
  },
]

function Reveal({ children, delay = 0, className }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

function SectionHead({ eyebrow, title, description, align = 'left', className }) {
  return (
    <div className={cn(align === 'center' && 'mx-auto max-w-3xl text-center', className)}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-[clamp(1.9rem,3.6vw,3rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-ink">
        {title}
      </h2>
      {description && (
        <p className="mt-4 max-w-2xl text-[14px] leading-relaxed text-muted">
          {description}
        </p>
      )}
    </div>
  )
}

function HeroPreview() {
  const data = chartData.slice(-14)
  const previewFindings = [
    {
      category: 'Incorrect claim',
      tone: 'violet',
      text: 'clinically proven to reduce stress by 40%',
      rule: 'MC-003 · Health claims',
    },
    {
      category: 'Outdated fact',
      tone: 'orange',
      text: 'valid until March 2025',
      rule: 'AF-003 · Current dates',
    },
    {
      category: 'Accessibility',
      tone: 'amber',
      text: 'CLICK HERE',
      rule: 'AC-002 · Descriptive links',
    },
  ]

  return (
    <div className="relative mx-auto mt-12 max-w-5xl sm:mt-16">
      <div
        className="absolute -inset-x-10 bottom-10 top-16 rounded-[50%] bg-[var(--accent)] opacity-[0.13] blur-3xl"
        aria-hidden="true"
      />
      <div className="glass-panel relative p-2 shadow-[0_50px_120px_-40px_rgba(15,38,74,0.45)] sm:p-3">
        <div className="overflow-hidden rounded-[19px] border border-[var(--line)] bg-[var(--panel-strong)]/80">
          <div className="flex items-center gap-3 border-b border-[var(--line)] px-3 py-2.5 sm:px-4">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-[#5b93ff] to-[#1045b5]">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
                  <path d="M6 6h12L6 18h12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="text-[10px] font-semibold text-ink">Truth Nuke</span>
            </div>
            <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--panel-muted)] px-2.5 py-1.5 sm:ml-3">
              <Search className="h-3 w-3 text-subtle" aria-hidden="true" />
              <span className="truncate text-[9px] text-subtle">Search reviews, guidelines…</span>
            </div>
            <Bell className="h-3.5 w-3.5 text-subtle" aria-hidden="true" />
            <Avatar user={users[0]} size="xs" />
          </div>

          <div className="flex">
            <div className="hidden w-[124px] shrink-0 flex-col gap-1 border-r border-[var(--line)] p-2.5 sm:flex">
              {[
                { icon: LayoutDashboardIcon, label: 'Overview', active: true },
                { icon: LibraryBig, label: 'Guidelines' },
                { icon: FileSearch, label: 'New Review' },
                { icon: ClipboardCheck, label: 'Approvals' },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <span
                    key={item.label}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-2 py-1.5 text-[9px] font-medium',
                      item.active
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                        : 'text-subtle',
                    )}
                  >
                    <Icon className="h-3 w-3" aria-hidden="true" />
                    {item.label}
                  </span>
                )
              })}
              <span className="mt-auto flex items-center gap-2 rounded-lg border border-[var(--line)] px-2 py-1.5">
                <span className="h-4 w-4 rounded-full bg-gradient-to-br from-[#5ee3b4] to-[#0b7f5e]" />
                <span className="text-[8px] text-subtle">Daniel O.</span>
              </span>
            </div>

            <div className="min-w-0 flex-1 p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.14em] text-subtle">
                    Governance overview
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold tracking-tight text-ink">
                    Good morning, Maya
                  </p>
                </div>
                <span className="badge tone-approved hidden sm:inline-flex">
                  <span className="dot" aria-hidden="true" />
                  All systems reviewed
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {[
                  { label: 'Total reviews', value: '248', trend: '+12.4%', tone: 'text-[var(--success)]' },
                  { label: 'Pending', value: '12', trend: '4 today', tone: 'text-[var(--accent)]' },
                  { label: 'Issues found', value: '342', trend: '−14.6%', tone: 'text-[var(--success)]' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-[var(--line)] bg-[var(--panel-muted)] px-2.5 py-2"
                  >
                    <p className="text-[8px] text-subtle">{stat.label}</p>
                    <p className="mt-0.5 text-sm font-semibold tracking-tight text-ink">{stat.value}</p>
                    <p className={cn('text-[7px] font-medium', stat.tone)}>{stat.trend}</p>
                  </div>
                ))}
              </div>

              <div className="mt-2 grid gap-2 lg:grid-cols-[1.15fr_1fr]">
                <div className="rounded-lg border border-[var(--line)] bg-[var(--panel-muted)] p-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-semibold text-ink">Review activity</p>
                    <span className="text-[7px] text-subtle">Last 14 days</span>
                  </div>
                  <div className="mt-2 h-[78px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                        <defs>
                          <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="reviews"
                          stroke="var(--accent)"
                          strokeWidth={1.6}
                          fill="url(#heroArea)"
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-1 flex items-center justify-between border-t border-[var(--line)] pt-1.5">
                    <span className="truncate text-[8px] text-subtle">Aurora X1 launch announcement</span>
                    <span className="badge tone-changes !px-1.5 !py-0 !text-[7px]">Under Review</span>
                  </div>
                </div>

                <div className="rounded-lg border border-[var(--line)] bg-[var(--panel-muted)] p-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-semibold text-ink">Latest findings</p>
                    <span className="badge tone-critical !px-1.5 !py-0 !text-[7px]">9 issues</span>
                  </div>
                  <div className="mt-2 space-y-1.5">
                    {previewFindings.map((finding) => (
                      <div key={finding.text} className="rounded-md border border-[var(--line)] bg-[var(--panel-strong)]/60 px-2 py-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className={cn('badge !px-1.5 !py-0 !text-[7px]', `tone-${finding.tone}`)}>
                            {finding.category}
                          </span>
                          <span className="text-[7px] text-subtle">{finding.rule}</span>
                        </div>
                        <p className="mt-1 truncate text-[8px] text-muted">{finding.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card absolute -left-4 bottom-12 hidden w-[190px] p-3 lg:block xl:-left-10">
        <div className="flex items-center gap-3">
          <span className="relative grid h-14 w-14 place-items-center rounded-full border-[3px] border-[var(--warning-line)]">
            <span className="text-base font-semibold text-ink">68</span>
          </span>
          <div>
            <p className="text-[9px] font-semibold text-ink">Compliance baseline</p>
            <p className="mt-0.5 text-[8px] leading-relaxed text-subtle">
              9 findings across 4 categories
            </p>
          </div>
        </div>
      </div>

      <div className="glass-popover absolute -right-3 top-10 hidden items-center gap-2 px-3 py-2 lg:flex xl:-right-8">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--success-soft)]">
          <CheckCircle2 className="h-3.5 w-3.5 text-[var(--success)]" aria-hidden="true" />
        </span>
        <span>
          <span className="block text-[9px] font-semibold text-ink">Human decision required</span>
          <span className="block text-[8px] text-subtle">AI cannot approve content</span>
        </span>
      </div>
    </div>
  )
}

function LayoutDashboardIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  )
}

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [useCase, setUseCase] = useState('marketing')
  const activeCase = USE_CASES.find((item) => item.id === useCase) ?? USE_CASES[0]

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="ambient-bg" aria-hidden="true" />

      <div className="sticky top-3 z-50 px-3 sm:top-4 sm:px-5">
        <header className="glass-navbar relative mx-auto flex max-w-6xl items-center gap-3 px-3 py-2.5 sm:px-4">
          <Link to="/" className="shrink-0 rounded-lg">
            <Logo />
            <span className="sr-only">home</span>
          </Link>

          <nav className="ml-4 hidden items-center gap-0.5 md:flex" aria-label="Landing navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-1.5 text-[12px] font-medium text-muted transition-colors hover:bg-[var(--hover-surface)] hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <div className="hidden sm:block">
              <ThemeMenu />
            </div>
            <Link
              to="/login"
              className="hidden rounded-lg px-3 py-1.5 text-[12px] font-medium text-muted transition-colors hover:bg-[var(--hover-surface)] hover:text-ink sm:block"
            >
              Log in
            </Link>
            <Link to="/login" className={cn(buttonStyles({ variant: 'primary', size: 'sm' }), 'hidden sm:inline-flex')}>
              Start Reviewing
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="btn btn-glass btn-icon md:hidden"
              aria-expanded={mobileOpen}
              aria-controls="landing-mobile-nav"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>

          {mobileOpen && (
            <div
              id="landing-mobile-nav"
              className="glass-popover absolute inset-x-2 top-[calc(100%+8px)] p-2 md:hidden"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium text-muted transition-colors hover:bg-[var(--hover-surface)] hover:text-ink"
                >
                  {link.label}
                  <ChevronRight className="h-3.5 w-3.5 text-subtle" aria-hidden="true" />
                </a>
              ))}
              <div className="mt-1 flex gap-2 border-t border-[var(--line)] p-2">
                <Link to="/login" className={cn(buttonStyles({ variant: 'glass', size: 'sm' }), 'flex-1')}>
                  Log in
                </Link>
                <Link to="/login" className={cn(buttonStyles({ variant: 'primary', size: 'sm' }), 'flex-1')}>
                  Start Reviewing
                </Link>
              </div>
            </div>
          )}
        </header>
      </div>

      <main>
        {/* Hero */}
        <section className="relative px-4 pb-24 pt-14 sm:px-6 sm:pt-20 lg:pt-24">
          <div className="absolute inset-x-0 top-0 h-[620px] bg-grid opacity-50" aria-hidden="true" />
          <div className="relative mx-auto max-w-4xl text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--glass-panel)] px-3 py-1.5 text-[10px] font-medium text-muted shadow-sm backdrop-blur-md">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[var(--accent-soft)]">
                  <Sparkles className="h-2.5 w-2.5 text-[var(--accent)]" aria-hidden="true" />
                </span>
                Intelligent brand governance · built by Team Codex
                <span className="hidden h-3 w-px bg-[var(--line-strong)] sm:block" aria-hidden="true" />
                <span className="hidden text-[var(--success)] sm:inline">Hackathon demo</span>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mx-auto mt-6 max-w-[900px] text-[clamp(2.7rem,6.2vw,5.2rem)] font-semibold leading-[0.99] tracking-[-0.055em] text-ink">
                Your Brand. Your Rules.
                <span className="mt-1 block bg-gradient-to-r from-[var(--accent)] via-[#4c7dff] to-[var(--cyan)] bg-clip-text font-serif font-normal italic tracking-[-0.03em] text-transparent">
                  Zero Inconsistencies.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mx-auto mt-6 max-w-[620px] text-[14px] leading-relaxed text-muted sm:text-[15px]">
                Detect incorrect claims, outdated facts, and off-brand content before they reach your
                audience. One intelligent governance platform for every piece of content.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
                <Link
                  to="/login"
                  className={cn(buttonStyles({ variant: 'primary', size: 'lg' }), 'w-full sm:w-auto')}
                >
                  Start Reviewing
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <a
                  href="#features"
                  className={cn(buttonStyles({ variant: 'glass', size: 'lg' }), 'w-full sm:w-auto')}
                >
                  Explore Features
                </a>
              </div>
              <p className="mt-3 text-[10px] text-subtle">
                Frontend demo · no account required · mock content only
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5">
                <div className="flex -space-x-2">
                  {[users[0], users[1], users[2], users[4]].map((user) => (
                    <Avatar
                      key={user.id}
                      user={user}
                      size="sm"
                      className="ring-2 ring-[var(--app-bg)]"
                    />
                  ))}
                </div>
                <p className="max-w-xs text-left text-[10px] leading-relaxed text-subtle">
                  Built for the people who own the words —{' '}
                  <span className="font-medium text-muted">brand, legal and accessibility teams.</span>
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.28}>
            <HeroPreview />
          </Reveal>
        </section>

        {/* Product introduction */}
        <section className="landing-section px-4 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <Reveal>
              <SectionHead
                eyebrow="The governance layer"
                title={
                  <>
                    Publishing sped up.
                    <br />
                    <span className="font-serif font-normal italic text-[var(--accent)]">
                      Trust
                    </span>{' '}
                    didn’t.
                  </>
                }
                description="Content now moves through more channels, more tools and more people than any manual review process can reliably track. Truth Nuke adds a consistent intelligence layer between drafting and publishing."
              />
            </Reveal>

            <Reveal delay={0.08} className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  step: 'Detect',
                  icon: ScanSearch,
                  text: 'Surface claims, stale facts and off-brand language with severity and evidence.',
                },
                {
                  step: 'Explain',
                  icon: Eye,
                  text: 'Show the exact rule and source behind every finding, in plain language.',
                },
                {
                  step: 'Approve',
                  icon: ClipboardCheck,
                  text: 'Let a person decide what changes. Keep the decision on record.',
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.step} className="glass-card p-4">
                    <span className="mb-3 grid h-8 w-8 place-items-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)]">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <p className="text-xs font-semibold text-ink">{item.step}</p>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-muted">{item.text}</p>
                  </div>
                )
              })}
            </Reveal>
          </div>
        </section>

        {/* Problem */}
        <section className="px-4 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="glass-panel overflow-hidden">
                <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[0.85fr_1.15fr] lg:p-12">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--danger)]">
                      The problem
                    </p>
                    <h2 className="mt-3 text-[clamp(1.8rem,3.2vw,2.7rem)] font-semibold leading-[1.08] tracking-[-0.04em] text-ink">
                      Good content can still be wrong.
                    </h2>
                    <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-muted">
                      One outdated date, one unverified claim, one vague link — and a trusted brand
                      ships something it never meant to say.
                    </p>
                    <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[var(--danger-line)] bg-[var(--danger-soft)] px-3 py-2">
                      <Zap className="h-3.5 w-3.5 text-[var(--danger)]" aria-hidden="true" />
                      <span className="text-[10px] font-medium text-[var(--danger)]">
                        Illustrative demo: 9 issues in one 280-word post
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      {
                        icon: FileText,
                        title: 'Rules live in PDFs',
                        body: 'The brand book is three versions old and nobody can find the exact clause in review comments.',
                      },
                      {
                        icon: ClipboardCheck,
                        title: 'Feedback is subjective',
                        body: '“Feels off-brand” is hard to act on. Teams need the rule, the reason and a concrete alternative.',
                      },
                      {
                        icon: Scale,
                        title: 'Legal arrives last',
                        body: 'High-risk claims surface at final sign-off, after the campaign is already built around them.',
                      },
                      {
                        icon: Accessibility,
                        title: 'Accessibility is invisible',
                        body: 'Content barriers such as vague links or all-caps emphasis slip through design and copy review.',
                      },
                    ].map((item) => {
                      const Icon = item.icon
                      return (
                        <div
                          key={item.title}
                          className="rounded-2xl border border-[var(--line)] bg-[var(--panel-muted)] p-4"
                        >
                          <Icon className="h-4 w-4 text-[var(--danger)]" aria-hidden="true" />
                          <p className="mt-2.5 text-xs font-semibold text-ink">{item.title}</p>
                          <p className="mt-1.5 text-[11px] leading-relaxed text-muted">{item.body}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="border-t border-[var(--line)] bg-[var(--panel-muted)] px-6 py-3 sm:px-9 lg:px-12">
                  <p className="flex items-center gap-2 text-[10px] text-muted">
                    <ShieldCheck className="h-3.5 w-3.5 text-[var(--success)]" aria-hidden="true" />
                    Truth Nuke turns scattered knowledge into a consistent, explainable review layer.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Capabilities */}
        <section id="features" className="landing-section scroll-mt-28 px-4 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHead
                eyebrow="Key capabilities"
                title="Everything a careful editor would check. At machine speed."
                description="Six connected capabilities keep content accurate, consistent and accessible — without pretending the final decision belongs to a model."
                align="center"
              />
            </Reveal>

            <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {CAPABILITIES.map((capability, index) => {
                const Icon = capability.icon
                return (
                  <Reveal
                    key={capability.title}
                    delay={index * 0.04}
                    className={cn(capability.featured && 'md:col-span-2')}
                  >
                    <div className="glass-card glass-card-lift flex h-full flex-col overflow-hidden p-5">
                      <div className="flex items-start justify-between gap-3">
                        <span className={cn('badge', `tone-${capability.tone}`)}>
                          <Icon className="h-3 w-3" aria-hidden="true" />
                          {capability.icon === FileSearch ? 'Evidence-first' : 'Built in'}
                        </span>
                        <span className="font-serif text-2xl italic text-[var(--line-strong)]">
                          0{index + 1}
                        </span>
                      </div>
                      <h3 className="mt-4 text-[15px] font-semibold tracking-tight text-ink">
                        {capability.title}
                      </h3>
                      <p className="mt-2 text-[12px] leading-relaxed text-muted">{capability.body}</p>

                      {capability.featured && (
                        <div className="mt-5 grid gap-2 rounded-2xl border border-[var(--line)] bg-[var(--panel-muted)] p-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                          <div className="rounded-xl border border-[var(--danger-line)] bg-[var(--danger-soft)] px-3 py-2">
                            <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[var(--danger)]">
                              Claim detected
                            </p>
                            <p className="mt-1 text-[10px] font-medium text-ink">
                              “clinically proven to reduce stress”
                            </p>
                          </div>
                          <ArrowRight className="mx-auto hidden h-3.5 w-3.5 rotate-90 text-subtle sm:block sm:rotate-0" aria-hidden="true" />
                          <div className="rounded-xl border border-[var(--line)] bg-[var(--glass-panel-strong)] px-3 py-2">
                            <p className="text-[8px] font-semibold uppercase tracking-[0.12em] text-subtle">
                              Rule + evidence
                            </p>
                            <p className="mt-1 text-[10px] font-medium text-ink">
                              MC-003 · Legal Playbook §4.2
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section id="how-it-works" className="scroll-mt-28 px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="glass-panel overflow-hidden p-6 sm:p-9 lg:p-12">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <SectionHead
                    eyebrow="How it works"
                    title="Six steps from rough draft to defensible approval."
                    description="Clear enough for writers. Rigorous enough for legal. Fast enough for launch week."
                  />
                  <Link
                    to="/login"
                    className={cn(buttonStyles({ variant: 'glass', size: 'sm' }), 'shrink-0')}
                  >
                    Open the demo workspace
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>

                <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {WORKFLOW.map((step, index) => {
                    const Icon = step.icon
                    return (
                      <Reveal key={step.step} delay={index * 0.04}>
                        <div className="relative h-full rounded-2xl border border-[var(--line)] bg-[var(--panel-muted)] p-4">
                          <div className="flex items-center justify-between">
                            <span className="grid h-8 w-8 place-items-center rounded-xl border border-[var(--line)] bg-[var(--glass-panel-strong)] text-[var(--accent)]">
                              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                            </span>
                            <span className="font-serif text-2xl italic text-[var(--line-strong)]">
                              {step.step}
                            </span>
                          </div>
                          <h3 className="mt-3 text-xs font-semibold text-ink">{step.title}</h3>
                          <p className="mt-1.5 text-[11px] leading-relaxed text-muted">{step.body}</p>
                          {index < WORKFLOW.length - 1 && (
                            <span
                              className="absolute -right-2.5 top-1/2 hidden h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--glass-panel-strong)] text-subtle lg:flex"
                              aria-hidden="true"
                            >
                              <ChevronRight className="h-2.5 w-2.5" />
                            </span>
                          )}
                        </div>
                      </Reveal>
                    )
                  })}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Use cases */}
        <section id="use-cases" className="landing-section scroll-mt-28 px-4 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <SectionHead
                eyebrow="Built for the whole team"
                title="One review layer. Four very different pressures."
                description="Truth Nuke gives each stakeholder the view they need without duplicating the source of truth."
                align="center"
              />
            </Reveal>

            <Reveal delay={0.08} className="mt-9">
              <div className="glass-panel overflow-hidden">
                <div className="flex flex-wrap gap-1 border-b border-[var(--line)] p-2" role="tablist" aria-label="Use cases">
                  {USE_CASES.map((item) => {
                    const Icon = item.icon
                    const active = item.id === useCase
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        onClick={() => setUseCase(item.id)}
                        className={cn(
                          'flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-medium transition-all',
                          active
                            ? 'bg-[var(--glass-panel-strong)] text-ink shadow-[0_3px_12px_-6px_rgba(15,35,65,0.35)] ring-1 ring-[var(--line)]'
                            : 'text-muted hover:bg-[var(--hover-surface)] hover:text-ink',
                        )}
                      >
                        <Icon className={cn('h-3.5 w-3.5', active ? 'text-[var(--accent)]' : 'text-subtle')} aria-hidden="true" />
                        {item.label}
                      </button>
                    )
                  })}
                </div>

                <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:p-10">
                  <motion.div
                    key={activeCase.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Badge tone="info">{activeCase.label}</Badge>
                    <h3 className="mt-4 text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-ink">
                      {activeCase.title}
                    </h3>
                    <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-muted">
                      {activeCase.body}
                    </p>
                    <ul className="mt-5 space-y-2.5">
                      {activeCase.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2.5 text-[12px] text-muted">
                          <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[var(--success-soft)]">
                            <Check className="h-2.5 w-2.5 text-[var(--success)]" aria-hidden="true" />
                          </span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <div className="glass-card p-5">
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone="violet" dot>
                        Illustrative scenario
                      </Badge>
                      <span className="text-[9px] text-subtle">Demo data</span>
                    </div>
                    <p className="mt-4 text-[13px] font-semibold text-ink">{activeCase.scenario}</p>
                    <div className="mt-3 space-y-2">
                      <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] p-3">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-subtle">
                          Detected
                        </p>
                        <p className="mt-1 text-[11px] leading-relaxed text-ink">
                          Original wording highlighted with a specific severity and category.
                        </p>
                      </div>
                      <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] p-3">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-subtle">
                          Explained
                        </p>
                        <p className="mt-1 text-[11px] leading-relaxed text-ink">
                          The violated rule, its source and a plain-language reason.
                        </p>
                      </div>
                      <div className="rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] p-3">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-subtle">
                          Decided by a human
                        </p>
                        <p className="mt-1 text-[11px] leading-relaxed text-ink">
                          Accept, reject or discuss. Then route for formal approval.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 border-t border-[var(--line)] pt-3">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[var(--success)]" aria-hidden="true" />
                      <p className="text-[10px] font-medium text-muted">{activeCase.metric}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Responsible AI */}
        <section id="responsible-ai" className="scroll-mt-28 px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <div className="relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-[#08111f] p-6 text-white shadow-[0_40px_100px_-50px_rgba(6,18,40,0.9)] sm:p-10 lg:p-14">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#2f6bff] opacity-30 blur-3xl" aria-hidden="true" />
                <div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-[#16b7d4] opacity-20 blur-3xl" aria-hidden="true" />
                <div className="absolute inset-0 bg-grid opacity-[0.18]" aria-hidden="true" />

                <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                  <div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-medium text-white/70 backdrop-blur-sm">
                      <ShieldCheck className="h-3 w-3 text-[#6ee7b7]" aria-hidden="true" />
                      Responsible AI
                    </span>
                    <h2 className="mt-5 max-w-md text-[clamp(1.9rem,3.4vw,2.9rem)] font-semibold leading-[1.06] tracking-[-0.04em]">
                      AI finds and explains.{' '}
                      <span className="font-serif font-normal italic text-[#8ab4ff]">
                        Humans review and approve.
                      </span>
                    </h2>
                    <p className="mt-4 max-w-md text-[12px] leading-relaxed text-white/60">
                      Truth Nuke is designed around a simple principle: a model can prepare a decision,
                      but it cannot own one. Nothing is published automatically, and every suggestion
                      is attributable to a rule.
                    </p>

                    <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
                        <Quote className="h-3 w-3" aria-hidden="true" />
                        Product principle
                      </div>
                      <p className="mt-2 text-[13px] font-medium leading-relaxed text-white/85">
                        “A finding without a reason is just an opinion. A correction without a human
                        is just automation.”
                      </p>
                      <p className="mt-2 text-[9px] text-white/40">Team Codex · 2026</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {RESPONSIBLE.map((item) => {
                      const Icon = item.icon
                      return (
                        <div
                          key={item.title}
                          className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.06]"
                        >
                          <Icon className="h-4 w-4 text-[#8ab4ff]" aria-hidden="true" />
                          <h3 className="mt-2.5 text-xs font-semibold text-white">{item.title}</h3>
                          <p className="mt-1.5 text-[10px] leading-relaxed text-white/55">
                            {item.body}
                          </p>
                        </div>
                      )
                    })}
                    <div className="sm:col-span-2 rounded-2xl border border-[#8ab4ff]/25 bg-[#8ab4ff]/[0.08] p-4">
                      <p className="flex items-start gap-2 text-[10px] leading-relaxed text-white/65">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6ee7b7]" aria-hidden="true" />
                        <span>
                          <span className="font-semibold text-white">This build is honest about what it is: </span>
                          a frontend demonstration using a local mock rules engine. No LLM API or
                          backend is connected.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 pb-24 pt-10 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <Reveal>
              <div className="glass-panel relative overflow-hidden px-6 py-12 text-center sm:px-12 sm:py-16">
                <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[var(--accent)] opacity-20 blur-3xl" aria-hidden="true" />
                <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[var(--cyan)] opacity-15 blur-3xl" aria-hidden="true" />
                <div className="relative">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--glass-panel-strong)] shadow-sm">
                    <ShieldCheck className="h-5 w-5 text-[var(--accent)]" aria-hidden="true" />
                  </div>
                  <h2 className="mx-auto mt-5 max-w-2xl text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-ink">
                    Publish with confidence.
                    <span className="block font-serif font-normal italic text-[var(--accent)]">
                      Not crossed fingers.
                    </span>
                  </h2>
                  <p className="mx-auto mt-4 max-w-xl text-[13px] leading-relaxed text-muted">
                    Explore the complete governance workflow — from guideline library to human
                    approval — in a working frontend demo.
                  </p>
                  <div className="mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
                    <Link to="/login" className={cn(buttonStyles({ variant: 'primary', size: 'lg' }), 'w-full sm:w-auto')}>
                      Start Reviewing
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <Link to="/register" className={cn(buttonStyles({ variant: 'glass', size: 'lg' }), 'w-full sm:w-auto')}>
                      Create a demo account
                    </Link>
                  </div>
                  <p className="mt-4 flex items-center justify-center gap-1.5 text-[9px] text-subtle">
                    <CheckCircle2 className="h-3 w-3 text-[var(--success)]" aria-hidden="true" />
                    No credit card · Mock data · Frontend only
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--line)] px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Link to="/" className="inline-flex rounded-lg">
                <Logo />
                <span className="sr-only">home</span>
              </Link>
              <p className="mt-3 max-w-xs text-[11px] leading-relaxed text-subtle">
                Intelligent brand governance for teams who care what they publish. AI finds and
                explains. Humans review and approve.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Badge tone="approved" dot>
                  Human in the loop
                </Badge>
                <Badge tone="info">Hackathon 2026</Badge>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-subtle">Product</p>
              <ul className="mt-3 space-y-2 text-[11px] text-muted">
                <li><a href="#features" className="transition-colors hover:text-ink">Features</a></li>
                <li><a href="#how-it-works" className="transition-colors hover:text-ink">How it works</a></li>
                <li><a href="#use-cases" className="transition-colors hover:text-ink">Use cases</a></li>
                <li><Link to="/dashboard" className="transition-colors hover:text-ink">Dashboard demo</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-subtle">Platform</p>
              <ul className="mt-3 space-y-2 text-[11px] text-muted">
                <li><Link to="/guidelines" className="transition-colors hover:text-ink">Guideline Library</Link></li>
                <li><Link to="/review/new" className="transition-colors hover:text-ink">New Review</Link></li>
                <li><Link to="/approvals" className="transition-colors hover:text-ink">Approval Center</Link></li>
                <li><Link to="/history" className="transition-colors hover:text-ink">Review History</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-subtle">Account</p>
              <ul className="mt-3 space-y-2 text-[11px] text-muted">
                <li><Link to="/login" className="transition-colors hover:text-ink">Log in</Link></li>
                <li><Link to="/register" className="transition-colors hover:text-ink">Create account</Link></li>
                <li><Link to="/settings" className="transition-colors hover:text-ink">Settings</Link></li>
                <li><a href="#responsible-ai" className="transition-colors hover:text-ink">Responsible AI</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-9 flex flex-col items-start justify-between gap-3 border-t border-[var(--line)] pt-5 sm:flex-row sm:items-center">
            <p className="text-[10px] text-subtle">
              © 2026 Truth Nuke · Built by Team Codex. Frontend demonstration with mock data.
            </p>
            <p className="flex items-center gap-1.5 text-[10px] text-subtle">
              <BookOpenCheck className="h-3 w-3" aria-hidden="true" />
              No real authentication, file processing or AI service is connected.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
