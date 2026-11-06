import { Link, useLocation } from 'react-router-dom'
import {
  ClipboardCheck,
  FilePlus2,
  History,
  LayoutDashboard,
  LibraryBig,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useAppData } from '../../context/useAppData'
import { cn } from '../../utils/cn'
import { reviewNeedsApproval } from '../../utils/status'
import { Avatar } from '../common/Avatar'
import { Badge } from '../common/Badge'
import { Logo } from '../common/Logo'

const NAV_GROUPS = [
  {
    label: 'Workspace',
    items: [
      {
        to: '/dashboard',
        label: 'Overview',
        icon: LayoutDashboard,
        match: (path) => path === '/dashboard',
        roles: ['Manager', 'Creator', 'Reviewer'],
      },
      {
        to: '/guidelines',
        label: 'Guideline Library',
        icon: LibraryBig,
        match: (path) => path.startsWith('/guidelines'),
        roles: ['Manager', 'Creator', 'Reviewer'],
      },
      {
        to: '/review/new',
        label: 'New Review',
        icon: FilePlus2,
        match: (path) => path === '/review/new',
        roles: ['Manager', 'Creator'],
      },
      {
        to: '/history',
        label: 'Review History',
        icon: History,
        match: (path) => path === '/history' || (path.startsWith('/review/') && path !== '/review/new'),
        roles: ['Manager', 'Creator', 'Reviewer'],
      },
    ],
  },
  {
    label: 'Governance',
    items: [
      {
        to: '/approvals',
        label: 'Approval Center',
        icon: ClipboardCheck,
        match: (path) => path.startsWith('/approvals'),
        roles: ['Manager', 'Reviewer'],
        badge: 'approvals',
      },
      {
        to: '/team',
        label: 'Team',
        icon: Users,
        match: (path) => path.startsWith('/team'),
        roles: ['Manager', 'Reviewer'],
      },
      {
        to: '/settings',
        label: 'Settings',
        icon: Settings,
        match: (path) => path.startsWith('/settings'),
        roles: ['Manager', 'Creator', 'Reviewer'],
      },
    ],
  },
]

function SidebarContent({ onNavigate }) {
  const { reviews, guidelines, currentUser, organisation } = useAppData()
  const location = useLocation()
  const role = currentUser?.role ?? 'Manager'
  const pendingCount = reviews.filter(reviewNeedsApproval).length
  const activeGuidelines = guidelines.filter((rule) => rule.status === 'active').length
  const coverage = guidelines.length
    ? Math.round((activeGuidelines / guidelines.length) * 100)
    : 0

  return (
    <div className="flex h-full min-h-0 flex-col px-4 pb-4 pt-5">
      <div className="flex items-center justify-between px-1.5">
        <Link
          to="/dashboard"
          onClick={onNavigate}
          className="rounded-lg focus-visible:outline-offset-4"
        >
          <Logo />
          <span className="sr-only">home</span>
        </Link>
        {onNavigate && (
          <button
            type="button"
            onClick={onNavigate}
            className="btn btn-ghost btn-icon lg:hidden"
            aria-label="Close navigation"
            autoFocus
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <Link
        to="/settings"
        onClick={onNavigate}
        className="mt-5 flex items-center gap-2.5 rounded-xl border border-[var(--line)] bg-[var(--input-bg)] px-3 py-2.5 transition-colors hover:border-[var(--line-strong)]"
      >
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--accent-soft)] text-[11px] font-bold text-[var(--accent)]">
          N
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-semibold text-ink">{organisation.name}</span>
          <span className="block text-[10px] text-subtle">{organisation.plan} workspace</span>
        </span>
        <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-[var(--success)]" aria-hidden="true" />
      </Link>

      <nav className="scrollbar-none mt-6 min-h-0 flex-1 overflow-y-auto" aria-label="Main navigation">
        {NAV_GROUPS.map((group) => {
          const items = group.items.filter((item) => item.roles.includes(role))
          if (!items.length) return null
          return (
            <div key={group.label} className="mb-5">
              <p className="mb-1.5 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-subtle">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon
                  const active = item.match(location.pathname)
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={onNavigate}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'group relative flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-medium transition-all duration-200',
                          active
                            ? 'bg-[var(--glass-panel-strong)] text-ink shadow-[inset_0_1px_0_var(--glass-highlight),0_4px_14px_-8px_rgba(15,35,65,0.3)] ring-1 ring-[var(--line)]'
                            : 'text-muted hover:bg-[var(--hover-surface)] hover:text-ink',
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-4 w-4 shrink-0 transition-colors',
                            active ? 'text-[var(--accent)]' : 'text-subtle group-hover:text-muted',
                          )}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.label}</span>
                        {item.badge === 'approvals' && pendingCount > 0 && (
                          <span
                            className={cn(
                              'ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums',
                              active
                                ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                                : 'bg-[var(--neutral-soft)] text-subtle',
                            )}
                          >
                            {pendingCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </nav>

      <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--panel-muted)] p-3.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-subtle">
            <Sparkles className="h-3 w-3 text-[var(--accent)]" aria-hidden="true" />
            Guideline coverage
          </span>
          <span className="text-[11px] font-semibold text-ink tabular-nums">{coverage}%</span>
        </div>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-[var(--line)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--cyan)]"
            style={{ width: `${coverage}%` }}
          />
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-subtle">
          {activeGuidelines} of {guidelines.length} rules active. AI suggests, humans approve.
        </p>
      </div>

      <Link
        to="/settings"
        onClick={onNavigate}
        className="mt-3 flex items-center gap-2.5 rounded-xl border border-transparent px-1.5 py-2 transition-colors hover:border-[var(--line)] hover:bg-[var(--hover-surface)]"
      >
        <Avatar user={currentUser} size="md" showStatus />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-xs font-semibold text-ink">{currentUser.name}</span>
          <span className="block truncate text-[10px] text-subtle">{currentUser.title}</span>
        </span>
        <Badge tone={role === 'Manager' ? 'violet' : role === 'Reviewer' ? 'teal' : 'info'}>
          {role}
        </Badge>
      </Link>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="glass-sidebar fixed bottom-4 left-4 top-4 z-30 hidden w-[264px] flex-col lg:flex">
      <SidebarContent />
    </aside>
  )
}

export function MobileSidebar({ open, onClose }) {
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <motion.button
            type="button"
            className="absolute inset-0 bg-[rgba(4,10,22,0.45)] backdrop-blur-[4px]"
            aria-label="Close navigation overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            className="glass-sidebar absolute bottom-3 left-3 top-3 w-[286px] overflow-hidden"
            initial={reduceMotion ? false : { x: -320, opacity: 0.6 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { x: -320, opacity: 0.6 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <SidebarContent onNavigate={onClose} />
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
