import { useMemo, useState } from 'react'
import {
  Clock3,
  MailPlus,
  ShieldCheck,
  UserCheck,
  UserRoundPlus,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAppData } from '../context/useAppData'
import { formatDate, relativeTime } from '../utils/format'
import { ROLE_META, ROLES } from '../utils/status'
import { Avatar } from '../components/common/Avatar'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import { EmptyState } from '../components/common/EmptyState'
import { Modal } from '../components/common/Modal'
import { PageHeader } from '../components/common/PageHeader'
import { SearchInput } from '../components/common/SearchInput'
import { Select, SelectField, TextField } from '../components/common/Form'
import { TeamActivityCard } from '../components/dashboard/TeamActivityCard'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function TeamPage() {
  const {
    team,
    currentUser,
    role,
    inviteMember,
    updateMemberRole,
  } = useAppData()

  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [invite, setInvite] = useState({ name: '', email: '', role: 'Creator' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [busyMember, setBusyMember] = useState(null)

  const canManage = role === 'Manager'
  const activeCount = team.filter((member) => member.status === 'active').length
  const invitedCount = team.filter((member) => member.status === 'invited').length
  const reviewerCount = team.filter((member) => member.role === 'Reviewer').length

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return team.filter((member) => {
      if (roleFilter !== 'all' && member.role !== roleFilter) return false
      if (statusFilter !== 'all' && member.status !== statusFilter) return false
      if (!term) return true
      return [member.name, member.email, member.title, member.location, member.role]
        .join(' ')
        .toLowerCase()
        .includes(term)
    })
  }, [query, roleFilter, statusFilter, team])

  const openInvite = () => {
    setInvite({ name: '', email: '', role: 'Creator' })
    setErrors({})
    setInviteOpen(true)
  }

  const updateInvite = (key, value) => {
    setInvite((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const submitInvite = async (event) => {
    event.preventDefault()
    const next = {}
    if (!invite.name.trim()) next.name = 'Enter the person’s full name.'
    if (!invite.email.trim()) next.email = 'Enter their work email.'
    else if (!EMAIL_PATTERN.test(invite.email.trim())) next.email = 'Enter a valid email address.'
    else if (team.some((member) => member.email.toLowerCase() === invite.email.trim().toLowerCase())) {
      next.email = 'This email is already in the workspace.'
    }
    setErrors(next)
    if (Object.keys(next).length > 0) return

    setSending(true)
    try {
      const member = await inviteMember({
        name: invite.name.trim(),
        email: invite.email.trim(),
        role: invite.role,
      })
      toast.success('Invitation recorded', {
        description: `${member.name} was added as a ${member.role}. No email was sent — invites are simulated.`,
      })
      setInviteOpen(false)
      setInvite({ name: '', email: '', role: 'Creator' })
    } catch (error) {
      toast.error(error.message || 'Unable to invite this member.')
    } finally {
      setSending(false)
    }
  }

  const changeRole = async (member, nextRole) => {
    setBusyMember(member.id)
    try {
      await updateMemberRole(member.id, nextRole)
      toast.success('Role updated', {
        description: `${member.name} is now a ${nextRole} in the local demo workspace.`,
      })
    } catch (error) {
      toast.error(error.message || 'Unable to change this role.')
    } finally {
      setBusyMember(null)
    }
  }

  if (role === 'Creator') {
    return (
      <div className="space-y-5">
        <PageHeader
          eyebrow="Team"
          title="People and permissions"
          description="Team management is limited to managers and reviewers in this demonstration."
        />
        <EmptyState
          icon={ShieldCheck}
          title="You do not have access to team settings"
          description="Creators can submit content and follow their reviews. In this demo, switch to Reviewer or Manager from Settings → Profile to preview team management."
          action={
            <Button variant="glass" size="sm" onClick={() => window.history.back()}>
              Go back
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Team"
        title={
          <>
            The people behind the{' '}
            <span className="font-serif font-normal italic text-[var(--accent)]">truth</span>.
          </>
        }
        description="Creators submit, reviewers decide and managers keep the rules current. Roles are enforced in the interface — and nothing happens without a person."
        actions={
          canManage && (
            <Button variant="primary" size="sm" icon={MailPlus} onClick={openInvite}>
              Invite member
            </Button>
          )
        }
      />

      <section aria-label="Team summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Team members', value: team.length, hint: 'In this workspace', icon: Users },
          { label: 'Active', value: activeCount, hint: 'Signed in recently', icon: UserCheck },
          { label: 'Pending invites', value: invitedCount, hint: 'Simulated invitations', icon: UserRoundPlus },
          { label: 'Reviewers', value: reviewerCount, hint: 'Can record decisions', icon: ShieldCheck },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="glass-card flex items-start gap-3 p-4">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--panel-muted)] text-muted">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.13em] text-subtle">
                  {stat.label}
                </p>
                <p className="mt-1 text-xl font-semibold leading-none text-ink tabular-nums">
                  {stat.value}
                </p>
                <p className="mt-1 text-[9px] text-subtle">{stat.hint}</p>
              </div>
            </div>
          )
        })}
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="glass-panel overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-[var(--line)] p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-[var(--teal-soft)] text-[var(--teal)]">
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-semibold text-ink">Workspace members</p>
                <p className="text-[9px] text-subtle">
                  {filtered.length} of {team.length} shown
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="Search people…"
                label="Search team members"
                className="w-full sm:w-48"
              />
              <Select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                aria-label="Filter by role"
                className="w-auto py-2 text-xs"
              >
                <option value="all">All roles</option>
                {ROLES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
              <Select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by member status"
                className="w-auto py-2 text-xs"
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="invited">Invited</option>
              </Select>
            </div>
          </div>

          <div>
            {filtered.length === 0 ? (
              <div className="p-4">
                <EmptyState
                  icon={Users}
                  title="No team members match"
                  description="Try a different search, role or status."
                  action={
                    <Button
                      size="sm"
                      variant="glass"
                      onClick={() => {
                        setQuery('')
                        setRoleFilter('all')
                        setStatusFilter('all')
                      }}
                    >
                      Clear filters
                    </Button>
                  }
                />
              </div>
            ) : (
              <ul>
                {filtered.map((member) => {
                  const isSelf = member.id === currentUser.id
                  const roleMeta = ROLE_META[member.role] ?? ROLE_META.Creator
                  return (
                    <li
                      key={member.id}
                      className={`flex flex-col gap-3 border-b border-[var(--line)] p-4 last:border-0 sm:flex-row sm:items-center ${
                        isSelf ? 'bg-[var(--accent-soft)]' : ''
                      }`}
                    >
                      <div className="flex min-w-0 flex-1 items-start gap-3">
                        <Avatar user={member} size="lg" showStatus />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="truncate text-xs font-semibold text-ink">{member.name}</p>
                            {isSelf && <Badge tone="info">You</Badge>}
                            {member.status === 'invited' && (
                              <Badge tone="changes" dot>
                                Invited
                              </Badge>
                            )}
                          </div>
                          <p className="truncate text-[10px] text-muted">{member.email}</p>
                          <p className="mt-0.5 truncate text-[9px] text-subtle">
                            {member.title}
                            {member.location ? ` · ${member.location}` : ''}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pl-[52px] sm:pl-0">
                        <div className="min-w-[130px]">
                          {canManage && !isSelf ? (
                            <>
                              <label htmlFor={`role-${member.id}`} className="sr-only">
                                Change role for {member.name}
                              </label>
                              <select
                                id={`role-${member.id}`}
                                value={member.role}
                                disabled={busyMember === member.id}
                                onChange={(event) => changeRole(member, event.target.value)}
                                className="glass-input !py-1.5 text-[11px]"
                              >
                                {ROLES.map((item) => (
                                  <option key={item} value={item}>
                                    {item}
                                  </option>
                                ))}
                              </select>
                            </>
                          ) : (
                            <Badge tone={roleMeta.tone}>{member.role}</Badge>
                          )}
                        </div>

                        <div className="min-w-[96px] text-right">
                          <p className="flex items-center justify-end gap-1 text-[9px] text-subtle">
                            <Clock3 className="h-2.5 w-2.5" aria-hidden="true" />
                            {member.lastActive ? relativeTime(member.lastActive) : 'Not yet active'}
                          </p>
                          <p className="mt-0.5 text-[9px] text-subtle">
                            Joined {formatDate(member.joinedAt, { month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="border-t border-[var(--line)] bg-[var(--panel-muted)] px-4 py-2.5">
            <p className="text-[9px] leading-relaxed text-subtle">
              Role changes take effect immediately in this browser demo. Invitations are never emailed.
            </p>
          </div>
        </div>

        <aside className="space-y-4">
          <TeamActivityCard />

          <section className="glass-card p-4" aria-labelledby="access-model-heading">
            <h2 id="access-model-heading" className="text-xs font-semibold text-ink">
              Access model
            </h2>
            <ul className="mt-3 space-y-3">
              {Object.entries(ROLE_META).map(([roleName, meta]) => (
                <li key={roleName} className="flex items-start gap-2.5">
                  <Badge tone={meta.tone} className="mt-0.5 shrink-0">
                    {roleName}
                  </Badge>
                  <p className="text-[9px] leading-relaxed text-muted">{meta.description}</p>
                </li>
              ))}
            </ul>
            <p className="mt-3 rounded-lg border border-[var(--line)] bg-[var(--panel-muted)] px-2.5 py-2 text-[9px] leading-relaxed text-subtle">
              Only managers can invite people or change roles. Reviewers can inspect the team but not
              edit permissions.
            </p>
          </section>
        </aside>
      </div>

      <Modal
        open={inviteOpen}
        onClose={() => (sending ? null : setInviteOpen(false))}
        title="Invite a team member"
        description="This creates a local demo member. No invitation email is sent."
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setInviteOpen(false)} disabled={sending}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="invite-form"
              variant="primary"
              icon={MailPlus}
              loading={sending}
            >
              Add member
            </Button>
          </>
        }
      >
        <form id="invite-form" className="space-y-4" onSubmit={submitInvite} noValidate>
          <TextField
            label="Full name"
            required
            placeholder="e.g. Amara Osei"
            value={invite.name}
            onChange={(event) => updateInvite('name', event.target.value)}
            error={errors.name}
            autoFocus
          />
          <TextField
            label="Work email"
            type="email"
            required
            placeholder="name@northwind.co"
            value={invite.email}
            onChange={(event) => updateInvite('email', event.target.value)}
            error={errors.email}
          />
          <SelectField
            label="Role"
            value={invite.role}
            onChange={(event) => updateInvite('role', event.target.value)}
            hint={ROLE_META[invite.role]?.description}
          >
            {ROLES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </SelectField>
          <p className="rounded-xl border border-[var(--line)] bg-[var(--panel-muted)] px-3 py-2.5 text-[10px] leading-relaxed text-subtle">
            <ShieldCheck className="mr-1 inline h-3 w-3 text-[var(--success)]" aria-hidden="true" />
            Invitations are simulated. The member appears in the list immediately and can be assigned
            a role in this demo.
          </p>
        </form>
      </Modal>
    </div>
  )
}
