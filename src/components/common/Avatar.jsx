import { cn } from '../../utils/cn'
import { initials } from '../../utils/format'

const TONES = {
  blue: 'from-[#66a3ff] to-[#1d4ed8]',
  emerald: 'from-[#5ee3b4] to-[#0b7f5e]',
  violet: 'from-[#b79bff] to-[#5b21b6]',
  amber: 'from-[#fcd34d] to-[#b45309]',
  rose: 'from-[#ff9db0] to-[#be123c]',
  teal: 'from-[#5eead4] to-[#0f766e]',
  cyan: 'from-[#7dd3fc] to-[#0369a1]',
  slate: 'from-[#a8b3c4] to-[#475569]',
}

const SIZES = {
  xs: 'h-6 w-6 text-[9px]',
  sm: 'h-7 w-7 text-[10px]',
  md: 'h-8 w-8 text-[11px]',
  lg: 'h-10 w-10 text-xs',
  xl: 'h-12 w-12 text-sm',
  '2xl': 'h-16 w-16 text-lg',
}

export function Avatar({ user, name, tone, size = 'md', className, showStatus = false }) {
  const label = name ?? user?.name ?? ''
  const colour = tone ?? user?.avatarTone ?? 'blue'
  const status = user?.status

  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      <span
        className={cn(
          'grid place-items-center rounded-full bg-gradient-to-br font-semibold tracking-wide text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_12px_-4px_rgba(0,0,0,0.35)] ring-1 ring-white/40',
          TONES[colour] ?? TONES.blue,
          SIZES[size] ?? SIZES.md,
        )}
        aria-hidden="true"
      >
        {initials(label)}
      </span>
      {showStatus && status === 'active' && (
        <span
          className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--panel-strong)] bg-[var(--success)]"
          role="img"
          aria-label="Active"
        />
      )}
    </span>
  )
}

export function AvatarStack({ users = [], max = 4, size = 'sm' }) {
  const visible = users.slice(0, max)
  const rest = users.length - visible.length
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {visible.map((user) => (
          <Avatar key={user.id} user={user} size={size} className="ring-2 ring-[var(--panel-strong)]" />
        ))}
      </div>
      {rest > 0 && (
        <span className="ml-2 text-xs font-medium text-subtle">+{rest}</span>
      )}
    </div>
  )
}
