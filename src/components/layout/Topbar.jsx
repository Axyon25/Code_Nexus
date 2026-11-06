import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Bell,
  Building2,
  CheckCheck,
  Command,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  UserRound,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAppData } from '../../context/useAppData'
import { cn } from '../../utils/cn'
import { relativeTime } from '../../utils/format'
import { Avatar } from '../common/Avatar'
import { Badge } from '../common/Badge'
import { Popover } from '../common/Popover'
import { ThemeMenu } from '../common/ThemeMenu'

const PAGE_TITLES = {
  '/dashboard': 'Overview',
  '/guidelines': 'Guideline Library',
  '/review/new': 'New Review',
  '/approvals': 'Approval Center',
  '/history': 'Review History',
  '/team': 'Team',
  '/settings': 'Settings',
}

function getPageTitle(pathname) {
  if (pathname.startsWith('/review/') && pathname !== '/review/new') return 'Review Results'
  return PAGE_TITLES[pathname] ?? 'Workspace'
}

export function Topbar({ onOpenSearch, onOpenMobileNav, mobileNavOpen = false }) {
  const { notifications, markAllNotificationsRead, markNotificationRead, currentUser } = useAppData()
  const location = useLocation()
  const navigate = useNavigate()
  const unread = notifications.filter((notification) => !notification.read).length
  const role = currentUser?.role ?? 'Manager'

  return (
    <header className="glass-navbar sticky top-3 z-40 flex items-center gap-2 px-2.5 py-2 sm:top-4 sm:px-3">
      <button
        type="button"
        onClick={onOpenMobileNav}
        className="btn btn-ghost btn-icon lg:hidden"
        aria-label="Open navigation"
        aria-expanded={mobileNavOpen}
        aria-controls="mobile-navigation"
      >
        <Menu className="h-4.5 w-4.5" aria-hidden="true" />
      </button>

      <div className="hidden min-w-0 pl-1.5 pr-2 sm:block">
        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-subtle">
          Workspace
        </p>
        <p className="truncate text-[13px] font-semibold tracking-tight text-ink">
          {getPageTitle(location.pathname)}
        </p>
      </div>

      <button
        type="button"
        onClick={onOpenSearch}
        className="ml-auto hidden h-9 w-[240px] items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--input-bg)] px-3 text-left transition-colors hover:border-[var(--line-strong)] md:flex xl:w-[300px]"
      >
        <Search className="h-3.5 w-3.5 shrink-0 text-subtle" aria-hidden="true" />
        <span className="flex-1 truncate text-xs text-subtle">Search reviews, rules, pages…</span>
        <kbd
          className="flex items-center gap-0.5 rounded-md border border-[var(--line)] bg-[var(--glass-panel-strong)] px-1.5 py-0.5 text-[9px] font-medium text-subtle"
          aria-hidden="true"
        >
          <Command className="h-2.5 w-2.5" aria-hidden="true" />K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5 md:ml-0">
        <button
          type="button"
          onClick={onOpenSearch}
          className="btn btn-ghost btn-icon md:hidden"
          aria-label="Search workspace"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
        </button>

        <Link
          to="/review/new"
          className={cn('btn btn-primary btn-sm hidden lg:inline-flex', role === 'Reviewer' && 'hidden')}
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          New review
        </Link>

        <ThemeMenu />

        <Popover
          align="right"
          panelClassName="w-[350px] max-w-[calc(100vw-1.5rem)]"
          trigger={
            <button
              type="button"
              className="btn btn-glass btn-icon relative"
              aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--danger)] ring-2 ring-[var(--panel-strong)]" />
              )}
            </button>
          }
        >
          {({ close }) => (
            <div>
              <div className="flex items-center justify-between gap-2 border-b border-[var(--line)] px-4 py-3">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-ink">Notifications</p>
                  {unread > 0 && <Badge tone="info">{unread} new</Badge>}
                </div>
                <button
                  type="button"
                  onClick={markAllNotificationsRead}
                  className="flex items-center gap-1 rounded-md px-1.5 py-1 text-[10px] font-medium text-muted transition-colors hover:bg-[var(--hover-surface)] hover:text-ink"
                >
                  <CheckCheck className="h-3 w-3" aria-hidden="true" />
                  Mark all read
                </button>
              </div>
              <div className="max-h-[360px] overflow-y-auto p-1.5">
                {notifications.length === 0 ? (
                  <p className="px-3 py-8 text-center text-xs text-subtle">You are all caught up.</p>
                ) : (
                  notifications.map((notification) => (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => {
                        markNotificationRead(notification.id)
                        close()
                        navigate(notification.href)
                      }}
                      className={cn(
                        'flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[var(--hover-surface)]',
                        !notification.read && 'bg-[var(--accent-soft)]/40',
                      )}
                    >
                      <span
                        className={cn(
                          'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full',
                          notification.read ? 'bg-[var(--line-strong)]' : 'bg-[var(--accent)]',
                        )}
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block text-[11px] font-semibold leading-snug text-ink">
                          {notification.title}
                        </span>
                        <span className="mt-0.5 block text-[10px] leading-relaxed text-muted">
                          {notification.body}
                        </span>
                        <span className="mt-1 block text-[9px] font-medium uppercase tracking-wide text-subtle">
                          {relativeTime(notification.at)}
                        </span>
                      </span>
                    </button>
                  ))
                )}
              </div>
              <div className="border-t border-[var(--line)] px-4 py-2.5">
                <p className="text-[9px] text-subtle">
                  Demo notifications. No email or push delivery is connected.
                </p>
              </div>
            </div>
          )}
        </Popover>

        <Popover
          align="right"
          panelClassName="w-64"
          trigger={
            <button
              type="button"
              className="ml-0.5 flex items-center gap-2 rounded-xl border border-transparent p-0.5 pr-1 transition-colors hover:border-[var(--line)] hover:bg-[var(--hover-surface)]"
            >
              <Avatar user={currentUser} size="md" showStatus />
              <span className="hidden text-left xl:block">
                <span className="block max-w-[110px] truncate text-[11px] font-semibold text-ink">
                  {currentUser.name}
                </span>
                <span className="block text-[9px] text-subtle">{role}</span>
              </span>
              <span className="sr-only">Open profile menu</span>
            </button>
          }
        >
          {({ close }) => (
            <div>
              <div className="border-b border-[var(--line)] px-4 py-3">
                <p className="text-xs font-semibold text-ink">{currentUser.name}</p>
                <p className="mt-0.5 truncate text-[10px] text-muted">{currentUser.email}</p>
                <Badge
                  tone={role === 'Manager' ? 'violet' : role === 'Reviewer' ? 'teal' : 'info'}
                  className="mt-2"
                >
                  {role}
                </Badge>
              </div>
              <div className="p-1.5">
                <Link
                  to="/settings"
                  onClick={close}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[11px] font-medium text-muted transition-colors hover:bg-[var(--hover-surface)] hover:text-ink"
                >
                  <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                  Profile settings
                </Link>
                <Link
                  to="/settings"
                  onClick={close}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[11px] font-medium text-muted transition-colors hover:bg-[var(--hover-surface)] hover:text-ink"
                >
                  <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Organisation
                </Link>
                <Link
                  to="/settings"
                  onClick={close}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[11px] font-medium text-muted transition-colors hover:bg-[var(--hover-surface)] hover:text-ink"
                >
                  <Settings className="h-3.5 w-3.5" aria-hidden="true" />
                  Workspace settings
                </Link>
              </div>
              <div className="border-t border-[var(--line)] p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    close()
                    toast('Signed out of the demo workspace', {
                      description: 'Authentication is not connected in this frontend build.',
                    })
                    navigate('/login')
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[11px] font-medium text-[var(--danger)] transition-colors hover:bg-[var(--danger-soft)]"
                >
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                  Sign out
                </button>
                <p className="px-3 pb-1 pt-2 text-[9px] leading-relaxed text-subtle">
                  Frontend demo · data stays in your browser
                </p>
              </div>
            </div>
          )}
        </Popover>
      </div>
    </header>
  )
}
