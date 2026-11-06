import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/useTheme'
import { cn } from '../../utils/cn'
import { Popover } from './Popover'

const OPTIONS = [
  { value: 'light', label: 'Light', description: 'Soft cool daylight', icon: Sun },
  { value: 'dark', label: 'Dark', description: 'Deep navy glass', icon: Moon },
  { value: 'system', label: 'System', description: 'Follow your device', icon: Monitor },
]

export function ThemeMenu({ showLabel = false }) {
  const { mode, resolvedTheme, setTheme } = useTheme()
  const CurrentIcon = resolvedTheme === 'dark' ? Moon : Sun

  return (
    <Popover
      align="right"
      panelClassName="w-60 p-1.5"
      trigger={
        <button
          type="button"
          className={cn(
            'btn btn-glass',
            showLabel ? 'px-3 py-2' : 'btn-icon',
          )}
          aria-label={`Theme: ${mode}. Change appearance`}
          title="Change appearance"
        >
          <CurrentIcon className="h-4 w-4" aria-hidden="true" />
          {showLabel && (
            <span className="text-xs font-medium capitalize">{mode}</span>
          )}
        </button>
      }
    >
      {({ close }) => (
        <div>
          <p className="px-3 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-subtle">
            Appearance
          </p>
          {OPTIONS.map((option) => {
            const Icon = option.icon
            const active = mode === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setTheme(option.value)
                  close()
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                  active ? 'bg-[var(--accent-soft)]' : 'hover:bg-[var(--hover-surface)]',
                )}
              >
                <Icon
                  className={cn('h-4 w-4', active ? 'text-[var(--accent)]' : 'text-muted')}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-semibold text-ink">{option.label}</span>
                  <span className="block text-[10px] text-subtle">{option.description}</span>
                </span>
                {active && <Check className="h-3.5 w-3.5 text-[var(--accent)]" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      )}
    </Popover>
  )
}

export const THEME_OPTIONS = OPTIONS
