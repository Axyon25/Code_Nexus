import { useMemo, useState } from 'react'
import {
  Bell,
  Building2,
  Check,
  Database,
  Download,
  Mail,
  MapPin,
  Monitor,
  Moon,
  Palette,
  RotateCcw,
  ShieldCheck,
  Sun,
  UserRound,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAppData } from '../context/useAppData'
import { useTheme } from '../context/useTheme'
import { formatDate } from '../utils/format'
import { ROLE_META, ROLES } from '../utils/status'
import { Avatar } from '../components/common/Avatar'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { Modal } from '../components/common/Modal'
import { PageHeader } from '../components/common/PageHeader'
import { SelectField, TextAreaField, TextField, Toggle } from '../components/common/Form'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'organisation', label: 'Organisation', icon: Building2 },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'data', label: 'Data & demo', icon: Database },
]

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', description: 'Soft cool daylight', icon: Sun },
  { value: 'dark', label: 'Dark', description: 'Deep navy glass', icon: Moon },
  { value: 'system', label: 'System', description: 'Follow your device', icon: Monitor },
]

const DEFAULT_NOTIFICATIONS = {
  reviewAssigned: true,
  approvalDecision: true,
  weeklyDigest: true,
  guidelineReview: true,
  productUpdates: false,
}

const NOTIFICATION_ROWS = [
  {
    key: 'reviewAssigned',
    label: 'Review assigned to me',
    description: 'When a creator submits content that needs your review or approval.',
  },
  {
    key: 'approvalDecision',
    label: 'Approval decisions',
    description: 'When a reviewer approves, requests changes or rejects one of your reviews.',
  },
  {
    key: 'weeklyDigest',
    label: 'Weekly governance digest',
    description: 'A Monday summary of reviews, findings and time saved.',
  },
  {
    key: 'guidelineReview',
    label: 'Guideline needs attention',
    description: 'When a brand rule is overdue for review or a policy source changes.',
  },
  {
    key: 'productUpdates',
    label: 'Product updates',
    description: 'Occasional notes about new Truth Nuke capabilities.',
  },
]

export default function SettingsPage() {
  const {
    currentUser,
    role,
    organisation,
    reviews,
    guidelines,
    team,
    updateProfile,
    updateOrganisation,
    switchCurrentRole,
    updateNotificationPreferences,
    notificationPreferences,
    resetDemo,
  } = useAppData()
  const { mode, resolvedTheme, setTheme } = useTheme()

  const [section, setSection] = useState('profile')
  const [profile, setProfile] = useState({
    name: currentUser.name,
    email: currentUser.email,
    title: currentUser.title,
    location: currentUser.location ?? '',
  })
  const [profileErrors, setProfileErrors] = useState({})
  const [org, setOrg] = useState({
    name: organisation.name,
    domain: organisation.domain,
    industry: organisation.industry,
    timezone: organisation.timezone,
    description: organisation.description,
  })
  const [orgErrors, setOrgErrors] = useState({})
  const [resetOpen, setResetOpen] = useState(false)
  const [resetting, setResetting] = useState(false)

  const prefs = useMemo(
    () => ({ ...DEFAULT_NOTIFICATIONS, ...(notificationPreferences ?? {}) }),
    [notificationPreferences],
  )

  const canManageOrg = role === 'Manager'
  const roleMeta = ROLE_META[role] ?? ROLE_META.Creator

  const changeDemoRole = (nextRole) => {
    if (nextRole === role) return
    switchCurrentRole(nextRole)
    toast.success(`Demo role switched to ${nextRole}`, {
      description:
        'Navigation and permissions update immediately. Reset the demo to restore the seeded Manager role.',
    })
  }

  const saveProfile = (event) => {
    event.preventDefault()
    const next = {}
    if (!profile.name.trim()) next.name = 'Enter your name.'
    if (!profile.email.trim()) next.email = 'Enter a work email.'
    else if (!EMAIL_PATTERN.test(profile.email.trim())) next.email = 'Enter a valid email address.'
    setProfileErrors(next)
    if (Object.keys(next).length > 0) return
    updateProfile({
      name: profile.name.trim(),
      email: profile.email.trim(),
      title: profile.title.trim(),
      location: profile.location.trim(),
    })
    toast.success('Profile updated', {
      description: 'Changes are saved in your browser for this demo.',
    })
  }

  const saveOrganisation = (event) => {
    event.preventDefault()
    if (!canManageOrg) return
    const next = {}
    if (!org.name.trim()) next.name = 'Enter the organisation name.'
    if (!org.domain.trim()) next.domain = 'Enter the workspace domain.'
    setOrgErrors(next)
    if (Object.keys(next).length > 0) return
    updateOrganisation({
      name: org.name.trim(),
      domain: org.domain.trim(),
      industry: org.industry,
      timezone: org.timezone,
      description: org.description.trim(),
    })
    toast.success('Organisation updated', {
      description: 'Workspace details are stored locally in this demo.',
    })
  }

  const togglePreference = (key, value) => {
    updateNotificationPreferences({ [key]: value })
  }

  const exportWorkspace = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      notice: 'Truth Nuke frontend demonstration data. No server data is included.',
      organisation,
      currentUser,
      reviews,
      guidelines,
      team,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json;charset=utf-8;',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'truth-nuke-workspace.json'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    toast.success('Workspace exported', {
      description: 'A JSON snapshot of the local demo data was downloaded.',
    })
  }

  const handleReset = async () => {
    setResetting(true)
    try {
      resetDemo()
      setProfile({
        name: currentUser.name,
        email: currentUser.email,
        title: currentUser.title,
        location: currentUser.location ?? '',
      })
      setOrg({
        name: organisation.name,
        domain: organisation.domain,
        industry: organisation.industry,
        timezone: organisation.timezone,
        description: organisation.description,
      })
      toast.success('Demo reset', {
        description: 'Reviews, guidelines and team data are back to their original sample state.',
      })
      setResetOpen(false)
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Settings"
        title={
          <>
            Your workspace, your{' '}
            <span className="font-serif font-normal italic text-[var(--accent)]">rules</span>.
          </>
        }
        description="Manage your profile, organisation details, appearance and local demo preferences. Everything is stored in this browser."
      />

      <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
        <nav
          className="glass-panel flex gap-1 overflow-x-auto p-2 xl:sticky xl:top-24 xl:h-fit xl:flex-col"
          aria-label="Settings sections"
        >
          {SECTIONS.map((item) => {
            const Icon = item.icon
            const active = section === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[11px] font-medium transition-colors ${
                  active
                    ? 'bg-[var(--glass-panel-strong)] text-ink shadow-sm ring-1 ring-[var(--line)]'
                    : 'text-muted hover:bg-[var(--hover-surface)] hover:text-ink'
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${active ? 'text-[var(--accent)]' : 'text-subtle'}`}
                  aria-hidden="true"
                />
                {item.label}
              </button>
            )
          })}
          <div className="mt-2 hidden border-t border-[var(--line)] px-3 pt-3 xl:block">
            <p className="text-[9px] leading-relaxed text-subtle">
              Demo workspace · data stays in your browser
            </p>
          </div>
        </nav>

        <div className="min-w-0 space-y-4">
          {section === 'profile' && (
            <section className="glass-panel p-5 sm:p-6" aria-labelledby="profile-heading">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 id="profile-heading" className="text-base font-semibold text-ink">
                    Profile
                  </h2>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">
                    How you appear to your team in reviews, comments and approvals.
                  </p>
                </div>
                <Badge tone={roleMeta.tone}>{role}</Badge>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--line)] bg-[var(--panel-muted)] p-4">
                <Avatar user={currentUser} size="2xl" showStatus />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">{currentUser.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted">{currentUser.title}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] text-subtle">
                    <span className="flex items-center gap-1">
                      <Mail className="h-2.5 w-2.5" aria-hidden="true" />
                      {currentUser.email}
                    </span>
                    {currentUser.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-2.5 w-2.5" aria-hidden="true" />
                        {currentUser.location}
                      </span>
                    )}
                    <span>Member since {formatDate(currentUser.joinedAt, { month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--panel-muted)] p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] font-semibold text-ink">Demo role</p>
                    <p className="mt-0.5 max-w-lg text-[9px] leading-relaxed text-muted">
                      Preview permissions for each role. This changes your local demo identity only
                      — managers control real roles from the Team page.
                    </p>
                  </div>
                  <Badge tone="neutral">Local only</Badge>
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-3" role="group" aria-label="Demo role">
                  {ROLES.map((item) => {
                    const meta = ROLE_META[item]
                    const active = role === item
                    return (
                      <button
                        key={item}
                        type="button"
                        aria-pressed={active}
                        onClick={() => changeDemoRole(item)}
                        className={`rounded-xl border p-3 text-left transition-colors ${
                          active
                            ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                            : 'border-[var(--line)] bg-[var(--input-bg)] hover:border-[var(--line-strong)]'
                        }`}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold text-ink">{item}</span>
                          {active && <Check className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />}
                        </span>
                        <span className="mt-1 block text-[9px] leading-relaxed text-muted">
                          {meta.description}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <form onSubmit={saveProfile} className="mt-5 space-y-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="Full name"
                    required
                    value={profile.name}
                    onChange={(event) => {
                      setProfile((prev) => ({ ...prev, name: event.target.value }))
                      setProfileErrors((prev) => ({ ...prev, name: undefined }))
                    }}
                    error={profileErrors.name}
                  />
                  <TextField
                    label="Work email"
                    type="email"
                    required
                    value={profile.email}
                    onChange={(event) => {
                      setProfile((prev) => ({ ...prev, email: event.target.value }))
                      setProfileErrors((prev) => ({ ...prev, email: undefined }))
                    }}
                    error={profileErrors.email}
                    hint="Not verified in this demo."
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="Job title"
                    value={profile.title}
                    onChange={(event) => setProfile((prev) => ({ ...prev, title: event.target.value }))}
                    placeholder="e.g. Head of Brand Governance"
                  />
                  <TextField
                    label="Location"
                    value={profile.location}
                    onChange={(event) => setProfile((prev) => ({ ...prev, location: event.target.value }))}
                    placeholder="e.g. London, UK"
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--line)] pt-4">
                  <p className="text-[9px] leading-relaxed text-subtle">
                    Use the demo role switcher above to preview other permissions. Workspace role
                    changes are managed by a manager from the Team page.
                  </p>
                  <Button type="submit" variant="primary" size="sm" icon={Check}>
                    Save profile
                  </Button>
                </div>
              </form>
            </section>
          )}

          {section === 'organisation' && (
            <section className="glass-panel p-5 sm:p-6" aria-labelledby="organisation-heading">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 id="organisation-heading" className="text-base font-semibold text-ink">
                    Organisation
                  </h2>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">
                    Workspace details used across reviews, exports and the guideline library.
                  </p>
                </div>
                <Badge tone="approved" icon={ShieldCheck}>
                  {organisation.plan}
                </Badge>
              </div>

              {!canManageOrg && (
                <p className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] px-3 py-2.5 text-[10px] leading-relaxed text-muted">
                  Only managers can edit organisation details. You can review the current values below.
                </p>
              )}

              <form onSubmit={saveOrganisation} className="mt-5 space-y-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    label="Organisation name"
                    required
                    value={org.name}
                    disabled={!canManageOrg}
                    onChange={(event) => {
                      setOrg((prev) => ({ ...prev, name: event.target.value }))
                      setOrgErrors((prev) => ({ ...prev, name: undefined }))
                    }}
                    error={orgErrors.name}
                  />
                  <TextField
                    label="Workspace domain"
                    required
                    value={org.domain}
                    disabled={!canManageOrg}
                    onChange={(event) => {
                      setOrg((prev) => ({ ...prev, domain: event.target.value }))
                      setOrgErrors((prev) => ({ ...prev, domain: undefined }))
                    }}
                    error={orgErrors.domain}
                    hint="Used to identify the workspace in this demo."
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <SelectField
                    label="Industry"
                    value={org.industry}
                    disabled={!canManageOrg}
                    onChange={(event) => setOrg((prev) => ({ ...prev, industry: event.target.value }))}
                  >
                    <option>Consumer technology</option>
                    <option>Financial services</option>
                    <option>Healthcare</option>
                    <option>Retail</option>
                    <option>Professional services</option>
                    <option>Other</option>
                  </SelectField>
                  <SelectField
                    label="Timezone"
                    value={org.timezone}
                    disabled={!canManageOrg}
                    onChange={(event) => setOrg((prev) => ({ ...prev, timezone: event.target.value }))}
                  >
                    <option value="Europe/London">Europe/London</option>
                    <option value="Europe/Berlin">Europe/Berlin</option>
                    <option value="America/Toronto">America/Toronto</option>
                    <option value="Asia/Dubai">Asia/Dubai</option>
                    <option value="Asia/Kolkata">Asia/Kolkata</option>
                  </SelectField>
                </div>
                <TextAreaField
                  label="Organisation description"
                  rows={3}
                  value={org.description}
                  disabled={!canManageOrg}
                  onChange={(event) => setOrg((prev) => ({ ...prev, description: event.target.value }))}
                  hint="A short description used in onboarding and exports."
                />
                {canManageOrg && (
                  <div className="flex items-center justify-end border-t border-[var(--line)] pt-4">
                    <Button type="submit" variant="primary" size="sm" icon={Check}>
                      Save organisation
                    </Button>
                  </div>
                )}
              </form>
            </section>
          )}

          {section === 'appearance' && (
            <section className="glass-panel p-5 sm:p-6" aria-labelledby="appearance-heading">
              <h2 id="appearance-heading" className="text-base font-semibold text-ink">
                Appearance
              </h2>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">
                Truth Nuke uses a liquid-glass interface in both light and dark themes. Your choice is
                remembered on this device.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {THEME_OPTIONS.map((option) => {
                  const Icon = option.icon
                  const active = mode === option.value
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setTheme(option.value)}
                      aria-pressed={active}
                      className={`relative overflow-hidden rounded-2xl border p-3 text-left transition-all ${
                        active
                          ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-sm'
                          : 'border-[var(--line)] bg-[var(--input-bg)] hover:border-[var(--line-strong)]'
                      }`}
                    >
                      <div
                        className={`relative mb-3 h-20 overflow-hidden rounded-xl border ${
                          option.value === 'dark'
                            ? 'border-[#2b3b58] bg-[#0b1424]'
                            : option.value === 'light'
                              ? 'border-[#d8e0ed] bg-[#f4f7fc]'
                              : 'border-[var(--line)] bg-gradient-to-r from-[#f4f7fc] via-[#e4ebf7] to-[#0b1424]'
                        }`}
                        aria-hidden="true"
                      >
                        <span
                          className={`absolute left-2 top-2 h-2 w-8 rounded-full ${
                            option.value === 'dark' ? 'bg-[#334a70]' : 'bg-[#c7d4e8]'
                          }`}
                        />
                        <span
                          className={`absolute left-2 top-6 h-10 w-12 rounded-lg border ${
                            option.value === 'dark'
                              ? 'border-[#2b3b58] bg-[#111a2b]'
                              : 'border-[#d8e0ed] bg-white/80'
                          }`}
                        />
                        <span
                          className={`absolute right-2 top-6 h-3 w-10 rounded-full ${
                            option.value === 'dark' ? 'bg-[#679bff]' : 'bg-[#2364e8]'
                          }`}
                        />
                        <span
                          className={`absolute bottom-2 right-2 h-8 w-14 rounded-lg border ${
                            option.value === 'dark'
                              ? 'border-[#2b3b58] bg-[#111a2b]'
                              : 'border-[#d8e0ed] bg-white/80'
                          }`}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon
                          className={`h-3.5 w-3.5 ${active ? 'text-[var(--accent)]' : 'text-muted'}`}
                          aria-hidden="true"
                        />
                        <p className="text-xs font-semibold text-ink">{option.label}</p>
                        {active && (
                          <span className="ml-auto grid h-4 w-4 place-items-center rounded-full bg-[var(--accent)] text-white">
                            <Check className="h-2.5 w-2.5" aria-hidden="true" />
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[9px] text-subtle">{option.description}</p>
                    </button>
                  )
                })}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] px-3.5 py-3">
                <div>
                  <p className="text-[11px] font-medium text-ink">
                    Currently using the {resolvedTheme} theme
                  </p>
                  <p className="mt-0.5 text-[9px] text-subtle">
                    System follows your device preference and updates automatically.
                  </p>
                </div>
                <Badge tone="approved" icon={Check}>
                  {mode === 'system' ? 'System preference' : `${mode} mode`}
                </Badge>
              </div>

              <div className="mt-4 rounded-xl border border-[var(--line)] p-3.5">
                <p className="text-[10px] font-semibold text-ink">Accessibility note</p>
                <p className="mt-1 text-[10px] leading-relaxed text-muted">
                  Both themes are designed for WCAG 2.2 AA contrast. Motion is reduced automatically
                  when your device requests it.
                </p>
              </div>
            </section>
          )}

          {section === 'notifications' && (
            <section className="glass-panel p-5 sm:p-6" aria-labelledby="notifications-heading">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 id="notifications-heading" className="text-base font-semibold text-ink">
                    Notifications
                  </h2>
                  <p className="mt-1 text-[11px] leading-relaxed text-muted">
                    Choose which events should appear in your demo notification centre.
                  </p>
                </div>
                <Badge tone="neutral" icon={Bell}>
                  Local only
                </Badge>
              </div>

              <div className="mt-4 divide-y divide-[var(--line)]">
                {NOTIFICATION_ROWS.map((row) => (
                  <Toggle
                    key={row.key}
                    label={row.label}
                    description={row.description}
                    checked={Boolean(prefs[row.key])}
                    onChange={(value) => togglePreference(row.key, value)}
                  />
                ))}
              </div>

              <p className="mt-3 rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] px-3 py-2.5 text-[9px] leading-relaxed text-subtle">
                Email and push delivery are not connected in this frontend build. These switches save a
                preference locally and do not send anything.
              </p>
            </section>
          )}

          {section === 'data' && (
            <section className="glass-panel p-5 sm:p-6" aria-labelledby="data-heading">
              <h2 id="data-heading" className="text-base font-semibold text-ink">
                Data & demo
              </h2>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">
                This is a frontend demonstration. Reviews, rules, team members and decisions live in
                your browser and are never sent to a server.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Reviews', value: reviews.length },
                  { label: 'Guidelines', value: guidelines.length },
                  { label: 'Team members', value: team.length },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] p-3"
                  >
                    <p className="text-lg font-semibold text-ink tabular-nums">{stat.value}</p>
                    <p className="text-[9px] text-subtle">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-2">
                <div className="flex flex-col gap-3 rounded-xl border border-[var(--line)] p-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-ink">Export workspace snapshot</p>
                    <p className="mt-0.5 text-[9px] leading-relaxed text-muted">
                      Download reviews, guidelines and team data as JSON.
                    </p>
                  </div>
                  <Button variant="glass" size="sm" icon={Download} onClick={exportWorkspace}>
                    Export JSON
                  </Button>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-[var(--danger-line)] bg-[var(--danger-soft)] p-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-[var(--danger)]">Reset demo data</p>
                    <p className="mt-0.5 text-[9px] leading-relaxed text-[var(--danger)]/80">
                      Restore the original sample reviews, guidelines and team. Your theme is kept.
                    </p>
                  </div>
                  <Button variant="danger" size="sm" icon={RotateCcw} onClick={() => setResetOpen(true)}>
                    Reset demo
                  </Button>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] p-3.5">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold text-ink">
                  <ShieldCheck className="h-3.5 w-3.5 text-[var(--success)]" aria-hidden="true" />
                  Simulated in this build
                </p>
                <ul className="mt-2 grid gap-1.5 text-[9px] leading-relaxed text-muted sm:grid-cols-2">
                  <li>• Authentication and account creation</li>
                  <li>• AI review analysis and scoring</li>
                  <li>• Guideline document imports</li>
                  <li>• Email invitations and notifications</li>
                  <li>• Human approval decisions</li>
                  <li>• Publishing and integrations</li>
                </ul>
              </div>
            </section>
          )}
        </div>
      </div>

      <Modal
        open={resetOpen}
        onClose={() => (resetting ? null : setResetOpen(false))}
        title="Reset the demo workspace?"
        description="This restores the original sample data in this browser."
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setResetOpen(false)} disabled={resetting}>
              Cancel
            </Button>
            <Button variant="danger" icon={RotateCcw} loading={resetting} onClick={handleReset}>
              Reset everything
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--danger-soft)] text-[var(--danger)]">
            <RotateCcw className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">All local changes will be lost</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">
              Reviews you created, suggestions you accepted, rule edits and invites will return to the
              seeded sample state. Your appearance preference is not affected.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
