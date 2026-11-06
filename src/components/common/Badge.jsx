import { cn } from '../../utils/cn'

export function Badge({ tone = 'neutral', dot = false, icon: Icon, children, className }) {
  return (
    <span className={cn('badge', `tone-${tone}`, className)}>
      {dot && <span className="dot" aria-hidden="true" />}
      {Icon && <Icon className="h-3 w-3" aria-hidden="true" />}
      {children}
    </span>
  )
}
