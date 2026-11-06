import { cn } from '../../utils/cn'

export function Logo({ className, compact = false, subtitle = 'Brand governance' }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5 select-none', className)}>
      <span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-[11px] bg-gradient-to-br from-[#5b93ff] to-[#1045b5] shadow-[0_8px_20px_-8px_rgba(37,99,235,0.7),inset_0_1px_0_rgba(255,255,255,0.45)]">
        <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent" />
        <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M6 6h12L6 18h12"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block text-[15px] font-semibold tracking-[-0.02em] text-ink">
            Truth Nuke
          </span>
          {subtitle && (
            <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.14em] text-subtle">
              {subtitle}
            </span>
          )}
        </span>
      )}
    </span>
  )
}
