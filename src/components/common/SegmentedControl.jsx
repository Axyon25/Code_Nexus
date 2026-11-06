import { cn } from '../../utils/cn'

export function SegmentedControl({ options, value, onChange, className, size = 'md', label }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5 rounded-xl border border-[var(--line)] bg-[var(--input-bg)] p-0.5',
        className,
      )}
      role="group"
      aria-label={label}
    >
      {options.map((option) => {
        const optionValue = typeof option === 'string' ? option : option.value
        const optionLabel = typeof option === 'string' ? option : option.label
        const active = value === optionValue
        return (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            aria-pressed={active}
            className={cn(
              'rounded-[9px] font-medium transition-all duration-200',
              size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs',
              active
                ? 'bg-[var(--glass-panel-strong)] text-ink shadow-[0_2px_8px_-4px_rgba(15,35,65,0.3)] ring-1 ring-[var(--line)]'
                : 'text-subtle hover:text-ink',
            )}
          >
            {optionLabel}
          </button>
        )
      })}
    </div>
  )
}
